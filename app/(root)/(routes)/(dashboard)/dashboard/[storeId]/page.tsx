import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/columns";
import DashboardClient from "./components/client";
import { Product } from "@prisma/client";

interface DashboardPageProps {
	params: {
		storeId: string;
	};
}

const DashboardPage: React.FC<DashboardPageProps> = async ({
	params,
}) => {
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			category: {
				select: {
					name: true,
				}
			}
		}
	})

	const formattedProducts: ProductColumn[] = products.map((item: Product) => ({
		id: item.id,
		Name: item.name,
		Category: item.categoryId,
		Price: item.price.toNumber(),
		Stock: item.stock.toNumber(),
		IsFeatured: item.isFeatured,
		Date: format((item.createdAt), "MMMM do, yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<DashboardClient data={formattedProducts}/>
			</div>
		</div>
	);
}

export default DashboardPage;