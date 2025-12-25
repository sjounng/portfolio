"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: "light",
	setTheme: () => {},
	toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light");

	// 시스템 다크모드 감지 및 저장된 테마 적용
	useEffect(() => {
		const saved = window.localStorage.getItem("theme") as Theme | null;
		if (saved) {
			setTheme(saved);
		} else {
			const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setTheme(systemDark ? "dark" : "light");
		}
	}, []);

	// html 태그에 class 직접 적용
	useEffect(() => {
		const html = document.documentElement;
		html.classList.remove("light", "dark");
		html.classList.add(theme);
		window.localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
