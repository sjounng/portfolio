import Image from "next/image";
export default async function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-4">포트폴리오 & 블로그</div>
        <h1 className="text-5xl md:text-9xl font-bold tracking-tighter mb-8">
          Hello.
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 relative">
            <Image
              src="/icons/favicon.ico"
              alt="로고"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <span className="font-medium"> Junwoo's Portfolio & Blog</span>
        </div>
      </div>
    </div>
  );
}
