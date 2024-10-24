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
		const subcategories = await prismadb.subcategory.findMany();

		if (!subcategories || subcategories.length === 0) {
			return new NextResponse("No subcategories found", { status: HTTP_STATUS.NOT_FOUND });
		}

		return NextResponse.json(subcategories);
	} catch (error) {
		console.error("[SUBCATEGORIES_GET] ", error);
		return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
	}
}
