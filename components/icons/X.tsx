"use client"

import { Button } from "@/components/ui/button";

import X from "@/assets/X";
import X2 from "@/assets/X2";

const Social_X = ({
	isDarkMode
}: {
	isDarkMode: boolean
}) => {
	return (
		<div className="mr-1">
				<Button
					variant="ghost"
					onClick={() => window.open("https://x.com/GoblinKhalid", "_blank")}
					className="flex items-center h-8 w-8"
				>
					{ isDarkMode ? <X2 /> : <X /> }
				</Button>
		</div>
	);
}
 
export default Social_X;