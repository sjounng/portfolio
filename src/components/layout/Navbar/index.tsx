"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../../ui/button";
import { ThemeToggle } from "../../theme-toggle";
import { useAuth } from "../../../context/auth-context";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-mono text-2xl">
          <div className="flex flex-row items-center gap-2">
            <div className="h-8 w-8 relative">
              <Image
                src="/icons/favicon.ico"
                alt="로고"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div>June</div>
          </div>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium hover:underline">
          Home
        </Link>
        <Link href="/info" className="text-sm font-medium hover:underline">
          Info
        </Link>
        <Link href="/blog" className="text-sm font-medium hover:underline">
          Blog
        </Link>
        <Link href="/algorithm" className="text-sm font-medium hover:underline">
          Algorithm
        </Link>
        <Link href="/fun" className="text-sm font-medium hover:underline">
          fun
        </Link>
      </nav>
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <Button
            onClick={() => signOut()}
            className="bg-stone-600 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 text-white dark:text-stone-950 rounded-full flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>로그아웃</span>
          </Button>
        ) : (
          <Button className="bg-stone-600 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 text-white dark:text-stone-950 rounded-full">
            <Link href="/login">로그인</Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
      {/* 모바일 햄버거 버튼 */}
      <Button
        className="md:hidden p-2 rounded-lg focus:outline-none bg-stone-600 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 text-white dark:text-stone-950"
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu size={24} />
      </Button>

      {/* 사이드바 오프캔버스 */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 z-10 bg-stone-200 dark:bg-stone-800 shadow-lg transform transition-transform
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-4 bg-stone-200 dark:bg-stone-800">
          <Button
            className="bg-stone-600 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 text-white dark:text-stone-950"
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X size={24} />
          </Button>
        </div>

        {/* 메뉴 항목 */}
        <nav className="flex flex-col items-start px-6 space-y-4">
          {["Home", "Info", "Blog", "Algorithm", "Fun"].map((label) => {
            const href = label === "Home" ? "/" : `/${label.toLowerCase()}`;
            return (
              <Link
                key={label}
                href={href}
                className="w-full py-2 text-lg font-medium hover:underline"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            );
          })}

          <div className="mt-4 w-full border-t border-gray-200 dark:border-gray-700 pt-4">
            {user ? (
              <Button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-full bg-stone-600 px-4 py-2 text-white hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
              >
                <LogOut size={16} /> 로그아웃
              </Button>
            ) : (
              <Button className="w-full rounded-full bg-stone-600 px-4 py-2 text-white hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  로그인
                </Link>
              </Button>
            )}

            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(false);
            }
          }}
        />
      )}
    </header>
  );
}
