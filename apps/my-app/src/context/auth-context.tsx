"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/app/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

// 관리자 이메일 리스트
const ADMIN_EMAILS = ["jwsong5160@gmail.com"];

type AuthContextType = {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signOut: () => Promise<void>;
	isAdmin: boolean;
};

const defaultValue: AuthContextType = {
	user: null,
	session: null,
	isLoading: true,
	signOut: async () => {},
	isAdmin: false,
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		// 현재 세션 가져오기
		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				console.error("세션 가져오기 오류:", error.message);
			} else {
				setSession(data.session);
				setUser(data.session?.user || null);
				// 관리자 이메일 체크
				setIsAdmin(
					data.session?.user?.email ? ADMIN_EMAILS.includes(data.session.user.email) : false
				);
			}
			setIsLoading(false);
		};

		getSession();

		// 인증 상태 변경 이벤트 구독
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
			setSession(newSession);
			setUser(newSession?.user || null);
			// 관리자 이메일 체크
			setIsAdmin(newSession?.user?.email ? ADMIN_EMAILS.includes(newSession.user.email) : false);
			setIsLoading(false);
		});

		return () => {
			// 구독 해제
			authListener.subscription.unsubscribe();
		};
	}, []);

	// 로그아웃 함수
	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const value = {
		user,
		session,
		isLoading,
		signOut,
		isAdmin,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 인증 컨텍스트 사용 훅
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다");
	}
	return context;
}
