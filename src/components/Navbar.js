"use client";

import Link from "next/link";

export default function Navbar() {
	return (
		<header className="w-full sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-zinc-900">
			<div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-3">
					<img src="/futurex-logo.png" alt="Java FutureX" className="h-8 w-auto" />
				</Link>
				<nav className="flex items-center gap-3">
					<Link href="/register" className="rounded-lg bg-cyan-500 text-black px-4 py-2 font-semibold hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.25)]">
						Mark Attendance
					</Link>
				</nav>
			</div>
		</header>
	);
}


