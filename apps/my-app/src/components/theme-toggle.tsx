"use client";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			onClick={toggleTheme}
			className="w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none ml-2"
			aria-label="다크모드 토글"
			type="button"
		>
			<span
				className={`w-4 h-4 bg-white dark:bg-black rounded-full shadow-md transform transition-transform duration-300 ${
					isDark ? "translate-x-6" : "translate-x-0"
				}`}
			/>
		</button>
	);
}
