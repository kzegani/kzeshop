/**
 * ImageUpload component is used to Display FileUpload trigger button if no initial data was available
 * else display the image of the current product by productId from URL.
 * 
 * And provides a dialog to host the FileUpload component that is used to upload file to uploadthing
 */

"use client"

import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import Image from "next/image";
import axios from "axios";

interface ImageUploadProps {
	disabled: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value
}) => {
	const [open, setOpen] = useState<boolean>(false);

	const onDelete = async (url: string) => {
		await axios.delete("/api/uploadthing", {
			data: {
				url: url,
			},
		});
	}

	return (
		<>
			{!value ? (
				<Button
					type="button"
					disabled={disabled}
					variant="secondary"
					onClick={() => setOpen(true)}
				>
					<ImagePlus className="h-4 w-4 mr-2" />
					Upload Image
				</Button>
			): (
				<div key={value} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
					<div className="absolute z-10 top-2 right-2">
						<Button type="button" onClick={() => {onDelete(value); onRemove(value);}} variant="destructive" size="icon">
							<Trash2 className="w-5 h-5"/>
						</Button>
					</div>
					<Image
						fill
						className="object-contain"
						alt="Image"
						src={value}
						sizes="(max-width: 768px) 100vw, 300px"
					/>
				</div>
			)}
			<Dialog open={open}>
				<DialogContent className="p-0 overflow-hidden justify-center items-center">
					<DialogHeader className="pt-8 px-6">
						<DialogTitle
							className="text-2xl text-center font-bold"
						>
							Upload product Image
						</DialogTitle>
						<DialogDescription className="text-center text-zinc-500">
							Please upload the images for your product. <br />
							Maximum size: 4MB image. <br />
							For best results, use high-resolution images (minimum 800x800 pixels). <br />
							Click the &quot;Choose File&quot; button to select images from your device.
						</DialogDescription>
					</DialogHeader>
						<div className="flex items-center justify-center text-center my-8">
							<FileUpload
								endpoint="productImage"
								value={value}
								onSuccess={(url: string) => {
									onChange(url);
								}}
								onDelete={onDelete}
							/>
						</div>
					<DialogFooter className="dark:bg-[#141A2A] px-6 py-4">
						<Button variant="dark" onClick={() => setOpen(false)}>
							Finish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default ImageUpload