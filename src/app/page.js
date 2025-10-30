"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";
import Navbar from "@/components/Navbar";

const orbitron = Orbitron({ subsets: ["latin"], weights: ["400", "600", "800"] });

export default function Home() {
	return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">
            <Navbar />
            <div className="pointer-events-none absolute inset-0 z-0 bg-animated-gradient" />
            <div className="pointer-events-none absolute inset-0 z-0 grid-overlay" />
            <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 flex flex-col items-center text-center gap-8">
                <motion.h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent ${orbitron.className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
					Java FutureX 2025 Attendance
				</motion.h1>
                <p className="text-zinc-300 max-w-2xl">
                    Entry free. Mark your attendance to enter the event.
                </p>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 }} className="w-full">
                    <div className="mx-auto max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur px-6 py-6 mb-4">
                        <p className="text-zinc-400 text-sm">Fast mobile check-in for the event.</p>
                    </div>
                    <Link href="/register" className="inline-block rounded-xl bg-cyan-500 px-7 py-3 font-semibold text-black shadow-[0_0_30px_rgba(34,211,238,.45)] hover:bg-cyan-400">
						Mark Attendance
					</Link>
				</motion.div>
                {/* Floating shapes */}
                <motion.div className="absolute -z-10 top-24 left-10 h-24 w-24 rounded-lg border border-cyan-500/40" animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute -z-10 bottom-20 right-12 h-28 w-28 rounded-full border border-emerald-500/30" animate={{ y: [0, 12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                <div className="mt-10 opacity-80">
                    <img src="/uni-logo.png" alt="University" className="h-14 md:h-16 mx-auto" />
				</div>
			</section>
		</main>
	);
}
