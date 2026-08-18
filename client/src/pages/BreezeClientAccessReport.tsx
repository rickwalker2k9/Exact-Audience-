import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { Loader2, ShieldCheck } from "lucide-react";

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

export default function BreezeClientAccessReport() {
  const { user, loading, isAuthenticated } = useAuth();
  const report = trpc.breezeClient.accessReport.useQuery({ limit: 100 }, { enabled: isAuthenticated });

  if (loading) return <div className="grid min-h-screen place-items-center bg-black text-[#fde68a]"><Loader2 className="animate-spin" /></div>;
  if (!isAuthenticated) return <main className="grid min-h-screen place-items-center bg-black px-5 text-slate-100"><section className="w-full max-w-md rounded-3xl border border-[#fbbf24]/25 bg-black p-8 text-center"><ShieldCheck className="mx-auto text-[#14b8a6]" size={28} /><h1 className="mt-4 text-2xl font-black">Owner access required</h1><p className="mt-3 text-sm leading-6 text-slate-400">Sign in with the Exact Audience owner account to review Breeze client access activity.</p><button onClick={startLogin} className="mt-6 rounded-xl bg-[#fbbf24] px-5 py-3 text-sm font-black text-black transition-transform active:scale-[.97]">Sign in</button></section></main>;
  if (report.isLoading) return <div className="grid min-h-screen place-items-center bg-black text-[#fde68a]"><Loader2 className="animate-spin" /></div>;
  if (report.error) return <main className="grid min-h-screen place-items-center bg-black px-5 text-slate-100"><section className="max-w-md rounded-3xl border border-[#f97316]/30 bg-black p-8 text-center"><h1 className="text-2xl font-black">Owner access required</h1><p className="mt-3 text-sm leading-6 text-slate-400">This report is available only to the Exact Audience owner account.</p></section></main>;

  return <main className="min-h-screen bg-black px-5 py-10 text-slate-100"><section className="mx-auto max-w-5xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#99f6e4]">Private owner report</p><h1 className="mt-2 text-3xl font-black text-white">Breeze client access activity</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Successful protected-portal sessions only. Duration is calculated from login through the most recent recorded activity.</p></div><p className="rounded-full border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#99f6e4]">{user?.name ?? "Owner"}</p></div><div className="mt-7 overflow-hidden rounded-2xl border border-white/10"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[.03] text-[10px] uppercase tracking-[.15em] text-slate-500"><tr><th className="px-5 py-4">Login</th><th className="px-5 py-4">Logged in</th><th className="px-5 py-4">Latest activity</th><th className="px-5 py-4">Session duration</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{report.data?.map(session => <tr key={session.id} className="border-t border-white/10"><td className="px-5 py-4 font-semibold text-white">{session.loginName}</td><td className="px-5 py-4 text-slate-300">{new Date(session.loggedInAt).toLocaleString()}</td><td className="px-5 py-4 text-slate-300">{new Date(session.lastSeenAt).toLocaleString()}</td><td className="px-5 py-4 font-bold text-[#fde68a]">{formatDuration(session.durationSeconds)}</td><td className="px-5 py-4"><span className={session.closedAt ? "text-slate-400" : "text-[#99f6e4]"}>{session.closedAt ? "Closed" : "Active"}</span></td></tr>)}</tbody></table></div>{report.data?.length === 0 && <p className="p-7 text-center text-sm text-slate-400">No protected Breeze client sessions have been recorded.</p>}</div></section></main>;
}
