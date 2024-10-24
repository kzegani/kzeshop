import * as z from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const HTTP_STATUS = {
	UNAUTHENTICATED: 401,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 403,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500,
};

const formSchema = z.object({
	name: z.string().min(2, { message: "Product name is required" }),
	image: z.string().min(1, { message: "Please provide an image for the product" }),
	price: z.number().min(1, { message: "Price must be at least 1 USD" }),
	stock: z.coerce.number().min(1, { message: "Stock must be at least 1 unit" }),
	category: z.string().min(1, { message: "A valid category must be provided" }),
	subcategory: z.string().min(1, { message: "A valid subcategory must be provided" }),
	isFeatured: z.boolean().optional(),
});

// Create a new Product
export async function POST (
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHENTICATED });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is required", { status: HTTP_STATUS.BAD_REQUEST })
		}

		const contentType = req.headers.get('content-type');
		if (contentType !== 'application/json') {
			return new NextResponse('Invalid content type, expecting application/json', { status: HTTP_STATUS.BAD_REQUEST });
		}

		let body;
		try {
			body = await req.json();
		} catch {
			return new NextResponse('Invalid JSON input', { status: HTTP_STATUS.BAD_REQUEST });
		}

		const validatedData = formSchema.safeParse(body);

		if (!validatedData.success) {
			// Return validation error with specific messages
			return new NextResponse(
				JSON.stringify(validatedData.error.format()), 
				{ status: HTTP_STATUS.BAD_REQUEST }
			);
		}

		// Protection against user isn't the owner of the stare
		const currentStore = await prismadb.store.findUnique({
			where: {
				userId
			}
		});

		if (!currentStore || currentStore.id !== params.storeId) {
			return new NextResponse("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED });
		}

		const { name, image, price, stock, category, subcategory, isFeatured } = validatedData.data;

		const product = await prismadb.product.create({
			data: {
				storeId: params.storeId, // Link product with owner's store
				name,
				imageUrl: image,
				price,
				stock,
				categoryId: category,
				subcategoryId: subcategory,
				isFeatured
			}
		})

		return NextResponse.json(product);
	} catch (error) {
		console.error("[PRODUCTS_POST] ", error);
		if (error instanceof PrismaClientKnownRequestError && (error.code === "P2002")) {
			return new NextResponse("Record already exists", { status: HTTP_STATUS.BAD_REQUEST })
		}
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}

// Find multiple products to display
export async function GET (
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return NextResponse.json(products);
	} catch (error) {
		console.error("[Colors_GET] ", error);
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}
