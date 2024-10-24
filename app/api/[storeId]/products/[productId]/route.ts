import * as z from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { utapi } from "@/app/api/uploadthing/core";
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

export async function PATCH (
	req: Request,
	{ params }: { params: { storeId: string, productId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHENTICATED });
		}

		if (!params.productId) {
			return new NextResponse("Product ID is required", { status: HTTP_STATUS.BAD_REQUEST })
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is required", { status: HTTP_STATUS.BAD_REQUEST })
		}

		// Protecting if client send invalid type content
		const contentType = req.headers.get('content-type');
		if (contentType !== 'application/json') {
			return new NextResponse('Invalid content type, expecting application/json', { status: HTTP_STATUS.BAD_REQUEST });
		}

		// Protection if user sent invalid JSON input or empty JSON
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

		const currentStore = await prismadb.store.findUnique({
			where: {
				userId
			}
		});

		// Protection against user isn't the owner of the stare
		if (!currentStore || currentStore.id !== params.storeId) {
			return new NextResponse("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED });
		}

		const { name, image, price, stock, category, subcategory, isFeatured } = validatedData.data;

		const product = await prismadb.product.update({
			where: {
				id: params.productId,
				storeId: params.storeId
			},
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
		console.error("[PRODUCTS_PATCH] ", error);
		if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
			console.error('Record not found:', error.message);
			return new NextResponse("Record not found", { status: HTTP_STATUS.BAD_REQUEST })
		}
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}

// Delete a single Product
export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string, productId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHENTICATED });
		}

		if (!params.productId) {
			return new NextResponse("Product ID is required", { status: HTTP_STATUS.BAD_REQUEST });
		}

		// Protection against user isn't the owner of the stare
		const currentStore = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!currentStore) {
			return new NextResponse("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED });
		}

		const data = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			}
		});

		if (!data) {
			return new NextResponse("Product Not Found", { status: HTTP_STATUS.NOT_FOUND });
		}

		try {
			const newUrl = data.imageUrl.substring(data.imageUrl.lastIndexOf("/") + 1);
			await utapi.deleteFiles(newUrl);
	
			console.log(JSON.stringify({ message: "ok uploadthing" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		} catch {
			console.error(JSON.stringify({ message: "error uploadthing" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}

		const product = await prismadb.product.delete({
			where: {
				id: params.productId,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.error("[PRODUCTS_DELETE] ", error);
		if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
			console.error('Record not found:', error.message);
			return new NextResponse("Record not found", { status: HTTP_STATUS.BAD_REQUEST })
		}
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}

// Find single product to display
export async function GET (
	req: Request,
	{ params }: { params: { storeId: string, productId: string } }
) {
	try {
		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.error("[PRODUCTID_GET] ", error);
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}
