"use client";

import {
	Copy,
	Edit,
	MoreHorizontal,
	Trash2
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./columns";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";

interface CellActionProps {
	data:  ProductColumn
}

export const CellAction: React.FC<CellActionProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const onCopy = (id: string) => {
		// Copy the description to clipboard
		navigator.clipboard.writeText(id);
	}

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/products/${data.id}`);
			router.refresh();
			toast.success("Product deleted.");
			console.log("Product deleted.");
		} catch (error) {
			const axiosError = error as AxiosError;

			if (axiosError.response) {
				console.error(axiosError.response.data);
			} else {
				console.error("Unexpected error:", error);
			}
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<> 
			<AlertModal
				name={data.Name}
				type="product"
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4"/>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>
						Actions
					</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="mr-2 h-4 w-4"/>
						Copy ID
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => router.push(`/dashboard/${params.storeId}/${data.id}`)}>
						<Edit className="mr-2 h-4 w-4"/>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem className="bg-destructive text-white hover:cursor-pointer hover:bg-destructive" onClick={() => setOpen(true)}>
						<Trash2 className="mr-2 h-4 w-4"/>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}