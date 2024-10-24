"use client"

import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import ImageUpload from '@/components/ui/image-upload';
import categories from '@/data/categories-with-subcategories.json';
import { Switch } from '@/components/ui/switch';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';

interface ProductFormProps {
	initialData: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		name: string;
		storeId: string;
		price: number;
		stock: number;
		isFeatured: boolean;
		imageUrl: string;
		categoryId: string;
		subcategoryId: string | null;
	} | null;
}

interface Subcategory {
	title: string;
	href: string;
	description: string;
}

const formSchema = z.object({
	name: z.string().min(2, { message: "Product name is required" }),
	image: z.string().min(1, { message: "Please provide an image for the product" }),
	price: z.coerce.number().min(1, { message: "Price must be at least 1 USD" }),
	stock: z.coerce.number().min(1, { message: "Stock must be at least 1 unit" }),
	category: z.string().min(1, { message: "A valid category must be provided" }),
	subcategory: z.string().min(1, { message: "A valid category must be provided" }),
	isFeatured: z.boolean().default(false).optional(),
})

type ProductFormValue = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({
	initialData
}) => {
	const params = useParams(); // To get productId
	const router = useRouter(); // To refresh and redirect page

	const [open, setOpen] = useState<boolean>(false); // To help open or close the AlertModel
	const [loading, setLoading] = useState<boolean>(false); // To help disable the Submit buttons
	const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

	const title = initialData ? "Edit Product" : "Create Product";
	const description = initialData ? "Update the product information" : "Fill in the form to create a new product";
	const toastMessage = initialData ? "product updated." : "product created.";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<ProductFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ? {
			...initialData,
			image: initialData.imageUrl,
			category: initialData.categoryId,
			subcategory: initialData.subcategoryId || ''
		} : {
			name: '',
			image: '',
			price: 1,
			stock: 1,
			category: '',
			subcategory: '',
			isFeatured: false,
		}
	});

	// Trigger function on Submit button pressed, to CREATE product or UPDATE product
	const onSubmit = async (data: ProductFormValue) => {
		try {
			setLoading(true);
			if (initialData)
				await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
			else
				await axios.post(`/api/${params.storeId}/products`, data);
			router.push(`/dashboard/${params.userId}`)
			router.refresh();
			console.log(toastMessage);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (axiosError.response) {
				if (axiosError.response.status === 500) {
					console.error("Something went wrong. Please try again later.");
				} else {
					console.error(axiosError.response.data);
				}
			} else {
				console.error("Unexpected error:", error);
			}
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const selectedCategory = form.getValues('category');
		const category = categories.find(c => c.category === selectedCategory);

		if (category) {
			setFilteredSubcategories(category.subcategories);
		} else {
			setFilteredSubcategories([]);
		}
	}, [form, form.watch('category')]);

	return (
		<>
			{initialData && (
				<AlertModal
					name={initialData.name}
					type="product"
					isOpen={open}
					onClose={() => setOpen(false)}
					onConfirm={() => console.log("Delete product")}
					loading={loading}
				/>
			)}
			<div className="flex items-center justify-between">
				<Heading
					title={title}
					description={description}
				/>
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash2 className="w-5 h-5"/>
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel className='block text-lg font-bold '>Product Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? field.value : ""}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid gap-8 grid-cols-1 mx:grid-cols-2'>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder='Product name' {...field}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price (USD)</FormLabel>
									<FormControl>
										<Input type='number' disabled={loading} {...field}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map(( category ) => (
												<SelectItem
													key={category.category}
													value={category.category}
												>
													{category.category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subcategory"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subcategory</FormLabel>
									<Select
										disabled={loading || filteredSubcategories.length === 0}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a subcategory"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{filteredSubcategories.map(( subcategory ) => (
												<SelectItem
													key={subcategory.title}
													value={subcategory.title}
												>
													{subcategory.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stock"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Stock (units)</FormLabel>
									<FormControl>
										<Input type="number" disabled={loading} {...field}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Highlight Your Product
										</FormLabel>
										<FormDescription>
											Boost visibility in product listings and increase sales with premium placement.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="flex ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
}

export default ProductForm;