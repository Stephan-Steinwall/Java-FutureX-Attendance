"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
	const search = useSearchParams();
	const status = search.get("status");

	return (
		<main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
			<div className="text-center max-w-md">
				<h1 className="text-3xl font-bold">
					{status === "already" ? "Attendance Already Marked" : "Attendance Marked"}
				</h1>
				<p className="mt-3 text-zinc-300">
					{status === "already"
						? "We found a previous submission for this NIC. You're good to enter."
						: "Thank you! You're all set to enter the event."}
				</p>
				<Link href="/" className="inline-block mt-6 rounded-lg bg-cyan-500 text-black px-6 py-3 font-semibold hover:bg-cyan-400">
					Back to Home
				</Link>
			</div>
		</main>
	);
}


