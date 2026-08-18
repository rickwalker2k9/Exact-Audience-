import BreezeLeadPortal from "@/pages/BreezeLeadPortal";
import { trpc } from "@/lib/trpc";
import { Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function BreezeClientLogin() {
  const status = trpc.breezeClient.status.useQuery();
  const login = trpc.breezeClient.login.useMutation({ onSuccess: () => status.refetch() });
  const activity = trpc.breezeClient.activity.useMutation();
  const [acknowledged, setAcknowledged] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const lastActivityAt = useRef(0);

  useEffect(() => {
    if (!status.data?.authenticated) return;
    const markActivity = () => {
      const now = Date.now();
      if (now - lastActivityAt.current < 30_000) return;
      lastActivityAt.current = now;
      activity.mutate();
    };
    const visibilityHandler = () => markActivity();
    window.addEventListener("focus", markActivity);
    window.addEventListener("pagehide", markActivity);
    document.addEventListener("visibilitychange", visibilityHandler);
    document.addEventListener("pointerdown", markActivity, { passive: true });
    document.addEventListener("keydown", markActivity);
    return () => {
      window.removeEventListener("focus", markActivity);
      window.removeEventListener("pagehide", markActivity);
      document.removeEventListener("visibilitychange", visibilityHandler);
      document.removeEventListener("pointerdown", markActivity);
      document.removeEventListener("keydown", markActivity);
    };
  }, [activity, status.data?.authenticated]);

  if (status.isLoading) return <div className="grid min-h-screen place-items-center bg-black text-[#fde68a]"><Loader2 className="animate-spin" /></div>;
  if (status.data?.authenticated) return <BreezeLeadPortal showIndividualRecords />;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    login.mutate({ username, password, acknowledged: true });
  };

  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_75%_12%,rgba(249,115,22,.18),transparent_28%),radial-gradient(circle_at_20%_82%,rgba(20,184,166,.14),transparent_30%),#000] px-5 text-slate-100"><section className="w-full max-w-md rounded-3xl border border-[#fbbf24]/30 bg-black p-7 shadow-[0_22px_80px_rgba(0,0,0,.6)] sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#14b8a6]/40 bg-[#14b8a6]/10 text-[#99f6e4]"><LockKeyhole size={20} /></div><p className="mt-6 text-[10px] font-bold uppercase tracking-[.2em] text-[#fde68a]">Breeze client portal</p><h1 className="mt-2 text-3xl font-black text-white">Secure access</h1>{!acknowledged ? <div className="mt-5"><p className="text-sm leading-6 text-slate-300">Access activity may be logged for security and operational purposes.</p><button onClick={() => setAcknowledged(true)} className="mt-7 w-full rounded-xl bg-[#fbbf24] px-4 py-3 text-sm font-black text-black transition-transform active:scale-[.97]">Continue</button></div> : <form className="mt-6 space-y-4" onSubmit={submit}><label className="block text-xs font-bold uppercase tracking-[.14em] text-slate-400">Username<input required autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black px-3 py-3 text-base text-white outline-none focus:border-[#14b8a6]" /></label><label className="block text-xs font-bold uppercase tracking-[.14em] text-slate-400">Password<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black px-3 py-3 text-base text-white outline-none focus:border-[#14b8a6]" /></label>{login.error && <p className="text-sm text-[#fdba74]">The supplied credentials could not be verified.</p>}<button disabled={login.isPending} className="w-full rounded-xl bg-[#14b8a6] px-4 py-3 text-sm font-black text-black transition-transform active:scale-[.97] disabled:opacity-60">{login.isPending ? "Verifying…" : "Access Breeze portal"}</button></form>}<p className="mt-7 text-center text-[10px] leading-5 text-slate-500">Copyright 2026 Exact Audience AI, a service of Imagine Agency LLC. All rights reserved.</p></section></main>;
}

export default BreezeClientLogin;
