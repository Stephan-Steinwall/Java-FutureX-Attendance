"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function AdminDashboard() {
	const router = useRouter();
	const [sessionChecked, setSessionChecked] = useState(false);
	const [userEmail, setUserEmail] = useState("");
    const [rows, setRows] = useState([]);
	const total = rows.length;

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getSession();
			if (!data.session) {
				return router.replace("/admin/login");
			}
			setUserEmail(data.session.user.email || "");
			setSessionChecked(true);
		})();
	}, [router]);

	useEffect(() => {
		if (!sessionChecked) return;
		// Initial fetch
        const fetchRows = async () => {
            const { data, error } = await supabase
                .from("attendance")
                .select("fname,lname,nic,email,batch,created_at")
                .order("created_at", { ascending: false });
			if (!error) setRows(data || []);
		};
		fetchRows();

		// Realtime subscription to keep totals live
		const channel = supabase
			.channel("attendance-count")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "attendance" },
				() => fetchRows()
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [sessionChecked]);

    function exportCSV() {
        const data = rows.map(({ created_at, ...rest }) => rest);
        const csv = Papa.unparse(data);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		downloadBlob(blob, `attendance.csv`);
	}

    function exportXLSX() {
        const data = rows.map(({ created_at, ...rest }) => rest);
        const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Attendance");
		const blob = new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
		downloadBlob(blob, `attendance.xlsx`);
	}

	function downloadBlob(blob, filename) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function signOut() {
		await supabase.auth.signOut();
		router.replace("/admin/login");
	}

	if (!sessionChecked) return null;

	return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,.15),transparent_60%)]" />
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="opacity-70">{userEmail}</span>
                        <button onClick={signOut} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 hover:bg-zinc-800">Sign out</button>
                    </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-2xl bg-gradient-to-b from-zinc-950 to-black border border-zinc-800 p-6 shadow-[0_0_40px_rgba(34,211,238,.08)]">
                        <p className="text-zinc-400 text-sm">Total Attendance</p>
                        <p className="text-4xl font-extrabold mt-2 text-cyan-400">{total}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={exportCSV} className="rounded-lg bg-cyan-500 text-black px-4 py-2 font-semibold hover:bg-cyan-400">Export CSV</button>
                    <button onClick={exportXLSX} className="rounded-lg bg-emerald-500 text-black px-4 py-2 font-semibold hover:bg-emerald-400">Export XLSX</button>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40 backdrop-blur">
                    <table className="min-w-full text-sm">
                        <thead className="bg-zinc-900/70">
                            <tr>
                                <th className="text-left px-4 py-3">Time</th>
                                <th className="text-left px-4 py-3">First Name</th>
                                <th className="text-left px-4 py-3">Last Name</th>
                                <th className="text-left px-4 py-3">NIC</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Batch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.nic} className="odd:bg-zinc-950/60">
                                    <td className="px-4 py-2 text-zinc-300">{new Date(r.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-2">{r.fname}</td>
                                    <td className="px-4 py-2">{r.lname}</td>
                                    <td className="px-4 py-2">{r.nic}</td>
                                    <td className="px-4 py-2">{r.email}</td>
                                    <td className="px-4 py-2">{r.batch}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
	);
}


