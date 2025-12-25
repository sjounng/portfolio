"use client";
import { useEffect, useRef, useState } from "react";

type Point4D = [number, number, number, number];
type Point3D = [number, number, number];
type Point2D = [number, number];

export default function FunPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef({ xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const velocityRef = useRef({ xw: 0, yw: 0, zw: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 다크 모드 감지
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const bgColor = isDarkMode ? "rgb(41, 37, 36)" : "rgb(228, 227, 223)";
    const strokeColor = isDarkMode ? "rgba(168, 162, 158, 0.8)" : "rgba(120, 113, 108, 0.8)";
    const dotColor = isDarkMode ? "rgb(231, 229, 228)" : "rgb(68, 64, 60)";

    // 4차원 초입방체의 16개 꼭짓점
    const vertices: Point4D[] = [];
    for (let i = 0; i < 16; i++) {
      vertices.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1,
      ]);
    }

    // 초입방체의 모서리 (32개)
    const edges: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices[i][k] !== vertices[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    // 4D 회전 행렬 적용
    const rotate4D = (point: Point4D, angles: typeof angleRef.current): Point4D => {
      let [x, y, z, w] = point;

      // XY 평면 회전
      const cosXY = Math.cos(angles.xy);
      const sinXY = Math.sin(angles.xy);
      [x, y] = [x * cosXY - y * sinXY, x * sinXY + y * cosXY];

      // XZ 평면 회전
      const cosXZ = Math.cos(angles.xz);
      const sinXZ = Math.sin(angles.xz);
      [x, z] = [x * cosXZ - z * sinXZ, x * sinXZ + z * cosXZ];

      // XW 평면 회전
      const cosXW = Math.cos(angles.xw);
      const sinXW = Math.sin(angles.xw);
      [x, w] = [x * cosXW - w * sinXW, x * sinXW + w * cosXW];

      // YZ 평면 회전
      const cosYZ = Math.cos(angles.yz);
      const sinYZ = Math.sin(angles.yz);
      [y, z] = [y * cosYZ - z * sinYZ, y * sinYZ + z * cosYZ];

      // YW 평면 회전
      const cosYW = Math.cos(angles.yw);
      const sinYW = Math.sin(angles.yw);
      [y, w] = [y * cosYW - w * sinYW, y * sinYW + w * cosYW];

      // ZW 평면 회전
      const cosZW = Math.cos(angles.zw);
      const sinZW = Math.sin(angles.zw);
      [z, w] = [z * cosZW - w * sinZW, z * sinZW + w * cosZW];

      return [x, y, z, w];
    };

    // 4D → 3D 투영
    const project4Dto3D = (point: Point4D): Point3D => {
      const distance = 2;
      const w = point[3];
      const factor = distance / (distance - w);
      return [point[0] * factor, point[1] * factor, point[2] * factor];
    };

    // 3D → 2D 투영
    const project3Dto2D = (point: Point3D): Point2D => {
      const distance = 3;
      const z = point[2];
      const factor = distance / (distance - z);
      return [point[0] * factor, point[1] * factor];
    };

    // 마우스 핸들러
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      velocityRef.current = { xw: 0, yw: 0, zw: 0 };
      lastPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;

      // 움직임이 없으면 멈춤
      if (deltaX === 0 && deltaY === 0) {
        velocityRef.current = { xw: 0, yw: 0, zw: 0 };
        return;
      }

      const sensitivity = 0.002;
      angleRef.current.xw += deltaX * sensitivity;
      angleRef.current.yw += deltaY * sensitivity;
      angleRef.current.zw += (deltaX + deltaY) * sensitivity * 0.5;

      velocityRef.current = {
        xw: deltaX * sensitivity,
        yw: deltaY * sensitivity,
        zw: (deltaX + deltaY) * sensitivity * 0.5,
      };

      lastPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseup", handleMouseUp);

    // 애니메이션 루프
    const animate = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 회전 각도 업데이트 (드래그 중이 아닐 때만 모멘텀 적용)
      if (!isDragging) {
        angleRef.current.xw += velocityRef.current.xw;
        angleRef.current.yw += velocityRef.current.yw;
        angleRef.current.zw += velocityRef.current.zw;

        // 마찰 적용
        const friction = 0.995;
        velocityRef.current = {
          xw: velocityRef.current.xw * friction,
          yw: velocityRef.current.yw * friction,
          zw: velocityRef.current.zw * friction,
        };
      }

      // 투영된 점들 계산
      const projectedPoints: Point2D[] = vertices.map((vertex) => {
        const rotated = rotate4D(vertex, angleRef.current);
        const proj3D = project4Dto3D(rotated);
        const proj2D = project3Dto2D(proj3D);
        return [
          proj2D[0] * 250 + width / 2,
          proj2D[1] * 250 + height / 2,
        ];
      });

      // 모서리 그리기
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      for (const [i, j] of edges) {
        ctx.beginPath();
        ctx.moveTo(projectedPoints[i][0], projectedPoints[i][1]);
        ctx.lineTo(projectedPoints[j][0], projectedPoints[j][1]);
        ctx.stroke();
      }

      // 꼭짓점 그리기
      ctx.fillStyle = dotColor;
      for (const point of projectedPoints) {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e4e3df] dark:bg-stone-800">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      />
    </div>
  );
}
