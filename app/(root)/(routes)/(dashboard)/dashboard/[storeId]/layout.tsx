import * as React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { NavBar } from "./components/navigation/navbar";
import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
	children,
	params
}: {
	children: React.ReactNode,
	params: { storeId: string }
}) {
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const store = await prismadb.store.findUnique({
		where: {
			userId
		}
	});

	if (!store) {
		try {
			const newStore = await prismadb.store.create({
				data: {
					userId
				}
			});
			redirect(`/dashboard/${newStore.id}`)
		} catch {
			redirect("/");
		}
	}
	if (params.storeId !== store.id)
		redirect(`/dashboard/${store.id}`);

	return (
		<>
			<NavBar />
			<div className="pt-[60px]">
				{children}
			</div>
		</>
	);
}
