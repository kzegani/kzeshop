import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const HTTP_STATUS = {
	UNAUTHENTICATED: 401,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 403,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500,
};

// Find multiple billboards to display
export async function GET () {
	try {
		const products = await prismadb.product.findMany({
			where: {
				isFeatured: true
			}
		});

		if (!products || products.length === 0) {
			return new NextResponse("No products found", { status: HTTP_STATUS.NOT_FOUND });
		}

		return NextResponse.json(products);
	} catch (error) {
		console.error("[PRODUCTS_GET] ", error);
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}
