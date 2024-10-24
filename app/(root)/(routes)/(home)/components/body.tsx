"use client"

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Body = () => {
	return (
		<div className='flex flex-col w-full h-screen items-center justify-center'>
			<Heading
				title='Welcome to KZE shop'
				description='Start selling your products and achieve your dreams'
			/>
			<Link href="/dashboard/new">
				<Button
					variant="dark"
					className='mt-20'
				>
					Get Started
				</Button>
			</Link>
		</div>
	);
}
 
export default Body;