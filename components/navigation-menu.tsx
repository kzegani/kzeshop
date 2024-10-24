/**
 * Home navigation menu
 */

"use client"

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import categories from "@/data/categories.json";
import { useUser } from "@clerk/nextjs";

export function NavMenu() {
	const { theme } = useTheme();
	const { user } = useUser();

	return (
		<NavigationMenu>
		<NavigationMenuList>
			<NavigationMenuItem>
			<NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
			<NavigationMenuContent>
				<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
					<li className="row-span-3">
						<NavigationMenuLink asChild>
						<Link
							className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
							href="/"
						>
							<Image
								className="object-contain"
								alt="logo"
								height={24}
								width={24}
								loading="lazy"
								src={theme === "dark"
									? "/logo_white.svg"
									: "/logo.svg"
								}
							/>
							<div className="mb-2 mt-4 text-lg font-medium">
								kzeshop
							</div>
							<p className="text-sm leading-tight text-muted-foreground">
								Discover unbeatable deals at KZE Shop!
								Enjoy savings of up to 90% on a wide range of products.
								Shop now for the best online shopping experience.
							</p>
						</Link>
						</NavigationMenuLink>
					</li>
					<ListItem href="/products" title="Overview" aria-label="Discover all kinds of products available in our store">
						Discover all kinds of products available in our store.
					</ListItem>
					<ListItem href="/discount" title="Discount" aria-label="Discount - Get discounts on products up to 90%">
						Learn how to get discounts of up to 90%.
					</ListItem>
					<ListItem href={`/dashboard/${user?.id}`} title="Dashboard" aria-label="Dashboard - Reach more customers and maximize your sales">
						<span>Reach more customers and maximize your sales.</span>
					</ListItem>
				</ul>
			</NavigationMenuContent>
			</NavigationMenuItem>
			<NavigationMenuItem>
			<NavigationMenuTrigger>Categories</NavigationMenuTrigger>
			<NavigationMenuContent>
				<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
					{categories.map((component) => (
						<ListItem
							key={component.title}
							title={component.title}
							href={component.href}
						>
							{component.description}
						</ListItem>
					))}
				</ul>
			</NavigationMenuContent>
			</NavigationMenuItem>
			<NavigationMenuItem>
			<Link href="/support" legacyBehavior passHref>
				<NavigationMenuLink className={navigationMenuTriggerStyle()}>
					Support
				</NavigationMenuLink>
			</Link>
			</NavigationMenuItem>
		</NavigationMenuList>
		</NavigationMenu>
	)
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = "ListItem"
