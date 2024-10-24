"use client"

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ProductColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface DashboardClientProps {
	data: ProductColumn[]
}

const DashboardClient: React.FC<DashboardClientProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Dashboard (${data.length !== undefined ? data.length : 0} products)`}
					description="Manage your products and sales"
				/>
				<Button
					onClick={() => router.push(`/dashboard/${params.storeId}/new`)}
					className="font-bold"
				>
					<Plus className="mr-2 h-4 w-4"/>
					Add New Product
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={data} searchKeys={["Name", "Category", "Date"]}/>
			<Heading title="API" description="API calls for billboards"/>
			<Separator />
			<ApiList entityName="products" entityIdName="productId"/>
		</>
	);
}

export default DashboardClient;
