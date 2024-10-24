/**
 * Alert model to warn user when they try to delete a product or multiple products
 */

"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlertModalProps {
	name: string,
	type: string,
	isOpen: boolean;
	isMultiSelect?: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
	name,
	type,
	isOpen,
	isMultiSelect,
	onClose,
	onConfirm,
	loading
}) => {
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");
	
	useEffect(() => {
		setIsMounted(true);
	}, []);
	
	if (!isMounted) {
		return null;
	}

	const isNameMatched = inputValue === name;

	return (
		<Modal
			title={!isMultiSelect
				? `The ${type} "${name}" will be deleted`
				: `Caution ${name} units will be deleted`
			}
			description={!isMultiSelect
				? `Please type the ${type} name to confirm. This action cannot be undone.`
				: "Please type the number of units to confirm. This action cannot be undone."
			}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="pt-4">
				<Input
					placeholder="Enter store name"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}  // Update input value as user types
					disabled={loading}
				/>
			</div>

			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button disabled={loading} variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button
					disabled={!isNameMatched || loading}  // Enable only if name matches
					variant="destructive"
					onClick={onConfirm}
				>
					Continue
				</Button>
			</div>
		</Modal>
	);
}
