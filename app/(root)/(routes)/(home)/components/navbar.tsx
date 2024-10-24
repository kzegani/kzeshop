"use client"

import { UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { NavMenu } from "@/components/navigation-menu";
import SearchCommand from "@/components/search-command";
import LoginRegister from "@/app/(root)/(routes)/(home)/components/login-register";
import Logo from "@/components/icons/logo";
import Social_X from "@/components/icons/X";

export const NavBar = () => {
	const { theme } = useTheme();
	const [isDarkMode, setIsDarkMode] = useState(theme === "light");
	const [isMounted, setIsMounted] = useState(false);
	const { isSignedIn } = useUser();

	useEffect(() => {
		setIsMounted(true);
		if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
			setIsDarkMode(true);
		else
			setIsDarkMode(false);
	}, [theme]);

	if (!isMounted) return null;

	return (
		<nav className="h-[60px] flex z-50 fixed backdrop-blur-md w-full bg-transparent items-center px-4">
			<Logo
				isDarkMode={isDarkMode}
				height={40}
				width={40}
				darkModeUrl="/logo_white.svg"
				lightModeUrl="/logo.svg"
				url="/"
			/>
			<div className="flex w-full ml-10">
				<NavMenu />
			</div>
			<div className="flex items-center pr-5">
				<SearchCommand />
				<Social_X isDarkMode={isDarkMode}/>
				<ModeToggle />
				{isSignedIn ? (
					<UserButton />
				): (
					<LoginRegister />
				)}
			</div>
		</nav>
	);
}
