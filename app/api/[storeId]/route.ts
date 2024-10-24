// This route not used yet

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
export async function GET (
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const store = await prismadb.store.findUnique({
			where: {
				id: params.storeId
			},
		});

		if (!store) {
			return new NextResponse("Store not found", { status: HTTP_STATUS.BAD_REQUEST });
		}

		return NextResponse.json(store);
	} catch (error) {
		console.error("[STOREID_GET] ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
