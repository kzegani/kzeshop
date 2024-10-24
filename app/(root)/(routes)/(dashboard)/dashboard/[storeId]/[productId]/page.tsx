import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const ProductPage = async ({
	params,
}: {
	params: { storeId: string; productId: string }
}) => {
	const product = await prismadb.product.findUnique({
		where: {
			id: params.productId
		},
	});

	// Check if product exists and transform it for the ProductForm
	const initialData = product ? {
		...product,
		price: product.price.toNumber(),  // Convert Decimal to number
		stock: product.stock.toNumber(),   // Convert Decimal to number
	} : null;

	console.log('Product', initialData);

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductForm initialData={initialData}/>
			</div>
		</div>
	);
}

export default ProductPage;
