//* The folowing is from https://docs.uploadthing.com/getting-started/appdir#setting-up-your-environment
//* Provided by uploadthing company to interact with their API

import {
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
