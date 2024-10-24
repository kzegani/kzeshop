//* Code to intialize the Database with the required Categories and Subcategories

import { PrismaClient } from "@prisma/client";

// Use the globalThis object to reuse the Prisma client across multiple files
const prismadb = globalThis.prismadb || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prismadb = prismadb;

const initializeDatabase = async () => {
	const categories = [
		"Clothing & Apparel",
		"Electronics",
		"Home & Living",
		"Health & Beauty",
		"Sports & Outdoors",
		"Toys & Games",
		"Automotive",
		"Food & Beverages",
		"Books & Stationery",
		"Pet Supplies",
	];

	const categories_list = [
		{
			category: "Clothing & Apparel",
			names: [
				"Men’s, Women’s, and Children’s Clothing",
				"Activewear",
				"Accessories",
				"Shoes"
			]
		},
		{
			category: "Electronics",
			names: [
				"Smartphones and Accessories",
				"Laptops and Computers",
				"Home Appliances",
				"Audio and Headphones",
				"Cameras",
			]
		},
		{
			category: "Home & Living",
			names: [
				"Furniture",
				"Home Decor",
				"Kitchenware",
				"Bedding and Linens",
				"Gardening Supplies",
			]
		},
		{
			category: "Health & Beauty",
			names: [
				"Skincare Products",
				"Haircare Products",
				"Makeup and Cosmetics",
				"Personal Care Items",
				"Health Supplements",
			]
		},
		{
			category: "Sports & Outdoors",
			names: [
				"Fitness Equipment",
				"Outdoor Gear",
				"Sports Apparel",
				"Bicycles and Accessories",
			]
		},
		{
			category: "Toys & Games",
			names: [
				"Educational Toys",
				"Board Games and Puzzles",
				"Action Figures and Dolls",
				"Outdoor Play Equipment",
			]
		},
		{
			category: "Automotive",
			names: [
				"Car Accessories",
				"Tools and Equipment",
				"Motorcycle Gear",
				"Tires and Parts",
			]
		},
		{
			category: "Food & Beverages",
			names: [
				"Gourmet Foods",
				"Organic Products",
				"Snacks",
				"Beverages",
			]
		},
		{
			category: "Books & Stationery",
			names: [
				"Fiction and Non-Fiction Books",
				"Educational Materials",
				"Office Supplies",
				"Art Supplies",
			]
		},
		{
			category: "Pet Supplies",
			names: [
				"Pet Food",
				"Pet Toys",
				"Grooming Supplies",
				"Pet Accessories",
			]
		},
	];

	try {
		const result = await Promise.all(
			categories.map(async (category) => {
				return prismadb.category.create({
					data: {
						name: category,
					},
				});
			})
		);

		// Add logging to ensure the correct categories are created
		console.log("Created Categories:", result);

		await Promise.all(
			result.map((category) => {
				// Find the corresponding category in categories_list
				const subcategories = categories_list.find(
					(subcat) => subcat.category === category.name
				);

				// If subcategories exist, log them and proceed
				if (subcategories) {
					console.log(`Creating subcategories for: ${category.name}`);

					return Promise.all(
						subcategories.names.map((subcategory) =>
							prismadb.subcategory.create({
								data: {
									name: subcategory,
									categoryName: subcategories.category,
									categoryId: category.id,
								},
							})
						)
					);
				} else {
					console.warn(`No subcategories found for: ${category.name}`);
					return Promise.resolve(); // Avoid unhandled promise
				}
			})
		);
	} catch (error) {
		console.error("[INIT_CATEGORIES]", error);
	} finally {
		await prismadb.$disconnect(); // Ensure to disconnect the Prisma Client
	}
};

initializeDatabase();
