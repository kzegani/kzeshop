/**
 * Search bar for avalable products in database
 */

"use client"

import * as React from "react"
import axios from "axios"
import { Product } from "@prisma/client"

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command"

const SearchCommand = () => {
	const [open, setOpen] = React.useState(false);
	const [products, setProducts] = React.useState<Product[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
		if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault()
			setOpen((open) => !open)
		}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, []);

	React.useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get("/api/products");
				setProducts(response.data);
			} catch (error) {
				console.error("Failed to fetch products:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	return (
		<>
			<div onClick={() => setOpen(true)} className="mr-4 border-[1px] rounded-md bg-[#f5f5f5] dark:bg-[#141A2A] w-[280px] h-8 hover:cursor-pointer">
				<div className="flex justify-between items-center pt-1 pl-4 text-sm pr-1 bg-transparent">
					<span className="text-[#737373] dark:text-[#AEAEAE] hover:text-black dark:hover:text-white">Search Products...</span>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">⌘</span>J
					</kbd>
				</div>
			</div>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<Command className="rounded-lg border shadow-md md:min-w-[450px]">
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						{loading ? (
							<CommandEmpty>Loading...</CommandEmpty>
						) : products.length === 0 ? (
							<CommandEmpty>No results found.</CommandEmpty>
						) : (
							<CommandGroup heading="Suggestions">
								{products.map((product) => (
									// When clicked nothing happens only the product is being console logged
									<CommandItem key={product.id}>
										<span
											onClick={() => console.log(product)}
											className="w-full h-full hover:cursor-pointer"
										>
											{product.name}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}
						<CommandSeparator />
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	)
}

export default SearchCommand;
