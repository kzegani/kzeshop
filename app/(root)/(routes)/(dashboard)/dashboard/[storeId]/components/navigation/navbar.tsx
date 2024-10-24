"use client"

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { ModeToggle } from "@/components/ui/mode-toggle";
import Logo from "@/components/icons/logo";
import { MainNav } from "./main-nav";

export const NavBar = () => {
	const { theme } = useTheme();
	const [isDarkMode, setIsDarkMode] = useState(theme === "light");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
			setIsDarkMode(true);
		else
			setIsDarkMode(false);
	}, [theme]);

	if (!isMounted) return null;

	return (
		<header className="h-[60px] flex z-50 fixed backdrop-blur-md w-full justify-between bg-transparent items-center px-4">
			<Logo
				isDarkMode={isDarkMode}
				height={40}
				width={40}
				darkModeUrl="/logo_white.svg"
				lightModeUrl="/logo.svg"
				url="/"
			/>
			<MainNav className="w-full lg:pl-20 md:pl-10"/>
			<div className="flex items-center pr-5">
				<ModeToggle />
				<UserButton />
			</div>
		</header>
	);
}
