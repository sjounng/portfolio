"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { techStacks } from "../../../constants/data";
import { SkeletonContainer } from "../../../components/ui/Skeleton";

export default function Info() {
  const [isLoading, setIsLoading] = useState(true);
  const [baekjoonLoaded, setBaekjoonLoaded] = useState(false);
  const [githubLoaded, setGithubLoaded] = useState(false);

  useEffect(() => {
    // 초기 로딩 상태를 false로 설정
    setIsLoading(false);
  }, []);

  return (
    <div className="container mx-auto mt-24 mb-24 px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* 좌측 콘텐츠 (텍스트, 스택, 프로젝트, 학력) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            안녕하세요,
            <br />
            저는 <span className="text-black dark:text-white">송준우 </span>
            입니다.
          </h1>
          <p className="text-lg text-gray-700 dark:text-stone-400 mb-6">
            풀스택 웹 개발자를 지망하고 있습니다. React와 Spring을 활용한 풀스택
            개발을 공부하며, TypeScript와 TailwindCSS로 더 나은 사용자 경험을
            만들어가는 개발자가 되고자 합니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">stack</h3>
              <div className="flex flex-wrap gap-2">
                {techStacks.map((tech, index) => (
                  <motion.img
                    key={tech.name}
                    alt={tech.name}
                    src={`https://img.shields.io/badge/${tech.name}-${
                      tech.color
                    }.svg?&style=for-the-badge&logo=${tech.logo}&logoColor=${
                      tech.logoColor || "white"
                    }`}
                    className="h-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">project</h3>
              <div className="text-sm text-gray-600 dark:text-stone-400 mb-2">
                게임 드래프트 팀 관리 웹사이트 | 2025.01 ~ 2025.07
              </div>
              <div className="text-sm text-gray-600 dark:text-stone-400">
                AI 챗봇 개발 프론트/백 | 2025.05 ~ 2025.07
              </div>
              <div className="text-sm text-gray-600 dark:text-stone-400">
                한양대학교 중앙 동아리 Forif SW팀 | 2025.07 ~
              </div>

              <div className="space-y-2">
                <div>
                  <div className="font-bold mt-6 mb-2">portfolio</div>
                  <div className="text-sm text-gray-600 dark:text-stone-400">
                    개인 블로그 | 2025.04 ~
                  </div>
                </div>
              </div>
              <h3 className="font-bold mt-6 mb-2">education</h3>
              <div className="space-y-2">
                <div>
                  <div className="font-medium">대진고등학교</div>
                  <div className="text-sm text-gray-600 dark:text-stone-400">
                    졸업 | 2021 - 2023
                  </div>
                  <div className="font-medium">한양대학교 정보시스템학과</div>
                  <div className="text-sm text-gray-600 dark:text-stone-400">
                    재학중 | 2024 ~
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 우측 이미지 */}
        <div className="relative w-full min-h-[500px] flex items-center justify-center">
          {isLoading ? (
            <SkeletonContainer />
          ) : (
            <motion.div
              className="flex flex-col justify-center items-center space-y-8 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div className="w-5/6 h-[200px] flex items-center justify-center mb-28">
                <motion.img
                  src="http://mazassumnida.wtf/api/v2/generate_badge?boj=jwsong0595"
                  alt="Baekjoon Badge"
                  className="w-full h-auto"
                  onLoad={() => setBaekjoonLoaded(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <div className="w-5/6 h-[200px] flex items-center justify-center">
                <motion.img
                  src="https://mazandi.herokuapp.com/api?handle=jwsong0595&theme=cold"
                  alt="GitHub Stat"
                  className="w-full h-auto"
                  onLoad={() => setGithubLoaded(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
