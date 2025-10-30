"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const { error: err } = await supabase.auth.signInWithPassword({ email, password });
		setLoading(false);
		if (err) return setError("Invalid credentials");
		router.push("/admin");
	}

	return (
		<main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
			<form onSubmit={onSubmit} className="w-full max-w-sm grid gap-4">
				<h1 className="text-2xl font-bold">Admin Login</h1>
				<input type="email" placeholder="Email" className="rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" required value={email} onChange={(e) => setEmail(e.target.value)} />
				<input type="password" placeholder="Password" className="rounded-md bg-zinc-900 border border-zinc-800 px-4 py-3" required value={password} onChange={(e) => setPassword(e.target.value)} />
				{error && <p className="text-red-400 text-sm">{error}</p>}
				<button disabled={loading} className="rounded-lg bg-cyan-500 text-black px-6 py-3 font-semibold hover:bg-cyan-400 disabled:opacity-60">{loading ? "Signing in..." : "Sign In"}</button>
			</form>
		</main>
	);
}


