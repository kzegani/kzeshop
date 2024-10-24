"use client"

import { ArrowUpDown } from "lucide-react"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CellActions } from "./cell-actions"

export type ProductColumn = {
	id: string
	Name: string
	Category: string
	Price: number
	Stock: number
	IsFeatured: boolean
	Date: string // createdAt
}

export const columns: ColumnDef<ProductColumn>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "Name",
		header: "Name",
	},
	{
		accessorKey: "Category",
		header: "Category",
	},
	{
		accessorKey: "Price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "Stock",
		header: "Stock",
	},
	{
		accessorKey: "IsFeatured",
		header: "IsFeatured",
	},
	{
		accessorKey: "Date",
		header: "Date",
	},
	{
		id: "actions",
		header: ({ table }) => {
			// Get selected rows data
			const selectedData = table.getSelectedRowModel().rows.map(row => row.original);

			return (
				<>
					{selectedData.length > 0 && (
						<CellActions data={selectedData} /> // Modify CellAction to accept multiple items
					)}
				</>
			);
		},
		cell: ({ row }) => <CellAction data={row.original} />,
	}
]
