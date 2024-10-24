"use client"

import {
	Avatar,
	AvatarImage,
} from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
	url: string
	height?: number
	width?: number
	blank?: boolean
	isDarkMode: boolean
	darkModeUrl: string
	lightModeUrl: string
}

const Logo = ({
	url,
	height,
	width,
	blank = false,
	isDarkMode,
	darkModeUrl,
	lightModeUrl,
}: LogoProps) => {
	console.log("urls", darkModeUrl, lightModeUrl);

	return (
		<>
			<a
				href={url}
				onClick={() => (!blank ? window.location.assign(url) : window.open(url, "_blank"))}
			>
				<Image
					src={isDarkMode
						? darkModeUrl
						: lightModeUrl
					}
					height={height}
					width={width}
					alt="logo"
					className="ml-5 hover:cursor-pointer flex-none bg-background rounded-full"
				/>
			</a>
		</>
	);
}
 
export default Logo;