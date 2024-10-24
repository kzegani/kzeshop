"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
	className,
}: React.HTMLAttributes<HTMLElement>) {
	const routes = [
		{
			href: `/`,
			label: 'Overview',
		},
		{
			href: `/categories/{category}`,
			label: 'Categories',
		},
		{
			href: `/categories/{category}/{subcategory}`,
			label: 'Subcategories',
		},
	];

	return (
		<nav className={cn("flex items-center space-x-4 lg:space-x-6 ml-4 lg:ml-6", className)}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						"text-bg transition-colors hover:text-primary font-[400]",
						"text-black dark:text-gray-500 text-muted-foreground dark:hover:text-white"
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}