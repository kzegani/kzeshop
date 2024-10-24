import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginRegister = () => {
	return (
		<div className="flex gap-3">
			<Link href="/sign-in">
				<Button variant="ghost" className="underline font-bold">
					Login
				</Button>
			</Link>
			<Link href="/sign-up">
				<Button variant="dark">
					Register
				</Button>
			</Link>
		</div>
	);
}

export default LoginRegister;