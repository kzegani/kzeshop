"use client";

import {
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

interface CellActionsProps {
	data:  ProductColumn[]
}

export const CellActions: React.FC<CellActionsProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const onDelete = async () => {
		try {
			setLoading(true);
			data.map(async (item) => {
				await axios.delete(`/api/${params.storeId}/products/${item.id}`);
				router.refresh();
			});
			toast.success("Product deleted.");
			console.log("Product deleted.");
		} catch (error) {
			const axiosError = error as AxiosError;

			if (axiosError.response) {
				if (axiosError.response.status === 500) {
					console.error("Something went wrong. Please try again later.");
				} else {
					console.error(axiosError.response.data);
				}
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
				name={`${data.length}`}
				type="products"
				isOpen={open}
				isMultiSelect={true}
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
					<DropdownMenuItem className="bg-destructive text-white hover:cursor-pointer hover:bg-destructive" onClick={() => setOpen(true)}>
						<Trash2 className="mr-2 h-4 w-4"/>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}