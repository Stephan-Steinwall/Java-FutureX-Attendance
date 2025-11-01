"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabasePublic } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

const BATCHES = ["Default"];

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({ fname: "", lname: "", nic: "", email: "", batch: BATCHES[0] });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
        try {
            const { error: insertError } = await supabasePublic.from("attendance").insert({
				fname: form.fname.trim(),
				lname: form.lname.trim(),
				nic: form.nic.trim(),
				email: form.email.trim(),
				batch: form.batch,
			});
			if (insertError) {
				// Unique constraint error (avoid duplicates by NIC)
				if (
					insertError.code === "23505" ||
					/duplicate|already exists|unique constraint/i.test(insertError.message || "")
				) {
					return router.push("/success?status=already");
				}
				// RLS or permission issues
				if (
					insertError.code === "42501" ||
					/new row violates row-level security/i.test(insertError.message || "")
				) {
					setError("Registration is currently restricted. Please contact an admin.");
					console.error("Supabase RLS error:", insertError);
					return;
				}

				console.error("Supabase insert error:", insertError);
				throw insertError;
			}
			router.push("/success");
		} catch (err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">
            <Navbar />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,.15),transparent_60%)]" />
            <div className="mx-auto w-full max-w-xl px-6 py-10">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur p-6 shadow-[0_0_40px_rgba(34,211,238,.08)]">
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Mark Attendance</h1>
                <p className="text-zinc-400 mb-6 text-sm">Please enter your details to register.</p>
                <form onSubmit={onSubmit} className="grid gap-4">
					<div className="grid gap-2">
						<label className="text-sm text-zinc-300">First Name</label>
						<input className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" required value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} />
					</div>
					<div className="grid gap-2">
						<label className="text-sm text-zinc-300">Last Name</label>
						<input className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" required value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} />
					</div>
					<div className="grid gap-2">
						<label className="text-sm text-zinc-300">NIC</label>
						<input className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" required value={form.nic} onChange={(e) => setForm({ ...form, nic: e.target.value })} />
					</div>
					<div className="grid gap-2">
						<label className="text-sm text-zinc-300">Email</label>
						<input type="email" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
					</div>
					<div className="grid gap-2">
						<label className="text-sm text-zinc-300">Batch</label>
						<select className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}>
							{BATCHES.map((b) => (
								<option key={b} value={b}>{b}</option>
							))}
						</select>
					</div>
					{error && <p className="text-red-400 text-sm">{error}</p>}
                    <button disabled={loading} className="mt-2 rounded-lg bg-cyan-500 text-black px-6 py-3 font-semibold hover:bg-cyan-400 disabled:opacity-60 shadow-[0_0_30px_rgba(34,211,238,.35)]">
						{loading ? "Submitting..." : "Submit"}
					</button>
				</form>
                </div>
			</div>
		</main>
	);
}


