/**
 * FileUpload component to upload file to uploadthing
 */

'use client'

import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

interface FileUploadProps {
	endpoint: "productImage" | "messageFile"
	value: string
	onSuccess: (result: string) => void
	onDelete: (url: string) => void
}

const FileUpload: React.FC<FileUploadProps> = ({
	endpoint,
	value,
	onSuccess,
	onDelete
}) => {
	if (value) {
		return (
			<div className="relative h-[200px] w-[300px] rounded-md overflow-hidden">
				<Image
					fill
					src={value}
					alt="Product Image"
					className="border object-contain"
					sizes="(max-width: 768px) 100vw, 300px"
				/>
				<button
					onClick={() => { onSuccess(""); onDelete(value); }}
					className="bg-rose-500 text-white p-1 rended-full absolute top-0 right-0 shadow-sm"
				>
					<X className="h-5 w-5"/>
				</button>
			</div>
		);
	}

	return (
		<UploadDropzone
			className="mx-10 dark:text-gray-500"
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onSuccess(res?.[0].url)
			}}
			onUploadError={(error: Error) => {
				console.log(error);
			}}
		/>
	);
}

export default FileUpload;