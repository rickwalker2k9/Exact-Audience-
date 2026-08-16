import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Database,
  ExternalLink,
  Filter,
  Globe2,
  LockKeyhole,
  MailCheck,
  MousePointerClick,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/14E8eR5vIKd-_rYc1XBtAfkGosz2SKXau5qOTrOjZI4I/edit";

function formatCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

function StatusPill({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "amber" | "slate" }) {
  const classes = {
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    slate: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${classes[tone]}`}>{children}</span>;
}

function PortalHeader({ staff = false }: { staff?: boolean }) {
  return (
    <header className="border-b border-cyan-300/15 bg-[#07131d]/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/breeze-insurance" className="flex items-center gap-3 text-white no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-[#07131d] shadow-[0_0_28px_rgba(103,232,249,.28)]"><Globe2 size={21} strokeWidth={2.5} /></span>
          <span><span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200">Exact Audience</span><span className="block text-lg font-extrabold tracking-tight">Breeze Insurance</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusPill><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Live operations</StatusPill>
          {staff ? <Link href="/breeze-insurance" className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 no-underline hover:bg-white/5">Public view</Link> : <Link href="/breeze-insurance/staff" className="rounded-lg border border-cyan-300/30 px-3 py-2 text-xs font-semibold text-cyan-100 no-underline hover:bg-cyan-300/10">Staff workflow <ChevronRight className="ml-1 inline" size={13} /></Link>}
        </div>
      </div>
    </header>
  );
}

function MetricCard({ label, value, description, tone = "cyan" }: { label: string; value: string; description: string; tone?: "cyan" | "emerald" | "amber" }) {
  const toneClasses = { cyan: "border-cyan-300/20", emerald: "border-emerald-300/20", amber: "border-amber-300/20" };
  return <article className={`rounded-2xl border ${toneClasses[tone]} bg-[#0b1b27] p-5 shadow-[0_18px_50px_rgba(0,0,0,.18)]`}>
    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">{label}</p>
    <p className="mt-3 text-4xl font-black tracking-tight text-white">{value}</p>
    <p className="mt-3 text-sm leading-5 text-slate-300">{description}</p>
  </article>;
}

export default function BreezeLeadPortal() {
  const { data, isLoading, error } = trpc.breezePortal.summary.useQuery(undefined, { refetchInterval: 5 * 60 * 1000 });
  const validReady = Boolean(data?.valid.schemaReady);
  const goldReady = Boolean(data?.validGold.schemaReady);
  const approvedTotal = (data?.valid.count ?? 0) + (data?.validGold.count ?? 0);

  return <main className="min-h-screen bg-[#061018] text-slate-100">
    <PortalHeader />
    <section className="relative overflow-hidden border-b border-cyan-300/10 bg-[radial-gradient(circle_at_78%_0%,rgba(34,211,238,.18),transparent_34%),linear-gradient(110deg,#071722_0%,#092334_55%,#07131d_100%)]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="max-w-3xl">
          <StatusPill tone="emerald"><CheckCircle2 size={12} /> Approved-contact operation</StatusPill>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Turn verified insurance intent into completed forms.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">This is the live operating layer for approved Breeze contacts—not a pitch deck. It keeps the team focused on approved audiences, progression to the Breeze form, and the next action at each stage.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            <a href={SHEET_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 font-bold text-[#061018] no-underline hover:bg-cyan-200"><Database size={16} /> Source sheet <ExternalLink size={14} /></a>
            <Link href="/breeze-insurance/staff" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 font-bold text-white no-underline hover:bg-white/5"><LockKeyhole size={16} /> Staff lead workflow</Link>
          </div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-5 py-9">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Layer 1 · approved audience health</p><h2 className="mt-1 text-2xl font-extrabold text-white">Only approved records enter the operating funnel.</h2></div>
        {!isLoading && <StatusPill tone={validReady && goldReady ? "emerald" : "amber"}>{validReady && goldReady ? "Schema ready" : "Action needed"}</StatusPill>}
      </div>
      {error ? <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">The approved-lead summary could not be refreshed. No lead details are exposed. Retry the source connection before acting on counts.</div> : <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Approved contact pool" value={isLoading ? "—" : formatCount(approvedTotal)} description={validReady && goldReady ? "Validated and validated-gold contacts currently ready for a governed outreach workflow." : "Counts appear only after each approved tab passes header validation."} />
        <MetricCard label="Validated-gold priority" value={isLoading ? "—" : formatCount(data?.validGold.count ?? 0)} description="Highest-priority approved cohort. Staff can review this tier first after signing in." tone="emerald" />
        <MetricCard label="General valid cohort" value={isLoading ? "—" : formatCount(data?.valid.count ?? 0)} description={validReady ? "Approved sendable records from the standard validated cohort." : "Awaiting the matching header row before this tab is imported automatically."} tone={validReady ? "cyan" : "amber"} />
      </div>}

      {!validReady && !isLoading && <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50"><CircleAlert className="mt-0.5 shrink-0 text-amber-300" size={18} /><span><strong>General valid tab is held safely.</strong> Add the reviewed header row used by the validated-gold tab before it is automatically imported. This prevents a column-order change from misclassifying real contacts.</span></div>}

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0b1b27] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Layer 2 · conversion workflow</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">A simple, measurable path to the Breeze form.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {[{ key: "approved", icon: Filter, title: "Approved", text: "Valid only" }, { key: "activated", icon: MailCheck, title: "Activated", text: "Email / paid touch" }, { key: "visited", icon: MousePointerClick, title: "Visited", text: "Website event" }, { key: "form-started", icon: ClipboardCheck, title: "Form started", text: "Intent signal" }, { key: "form-completed", icon: CheckCircle2, title: "Form completed", text: "Lead handoff" }].map((step, index) => <div key={step.title} className="relative rounded-xl border border-white/10 bg-[#07131d] p-4">{index < 4 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-cyan-300 sm:block" size={18} />}<step.icon className="text-cyan-300" size={20} /><p className="mt-5 text-sm font-bold text-white">{step.title}</p><p className="mt-1 text-2xl font-black text-cyan-100">{isLoading ? "—" : formatCount(data?.funnel?.[step.key as keyof NonNullable<typeof data>['funnel']] ?? 0)}</p><p className="mt-1 text-xs text-slate-400">{step.text}</p></div>)}</div>
          <p className="mt-5 text-sm leading-6 text-slate-300">These counts come from the protected staff workflow or a future approved event connection. A zero is a real absence of a recorded event—not a modeled estimate.</p>
        </div>
        <aside className="rounded-2xl border border-cyan-300/20 bg-[linear-gradient(160deg,#0b2836,#0b1b27)] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Representative journey</p>
          <h2 className="mt-2 text-xl font-extrabold text-white">Validated contact → coverage inquiry</h2>
          <ol className="mt-5 space-y-4 text-sm leading-5 text-slate-300"><li><strong className="text-white">1. Segment:</strong> select an approved tier and a compliant audience rule.</li><li><strong className="text-white">2. Activate:</strong> coordinate email, Meta, Google, and LinkedIn toward a single Breeze form objective.</li><li><strong className="text-white">3. Observe:</strong> capture delivered, clicked, visited, started, and completed events as integrations are connected.</li><li><strong className="text-white">4. Follow through:</strong> staff see the approved individual workflow after sign-in.</li></ol>
        </aside>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {[{ name: "Email", note: "Validated cohort activation", icon: MailCheck }, { name: "Meta", note: "Form-completion retargeting", icon: Target }, { name: "Google", note: "High-intent demand capture", icon: Globe2 }, { name: "LinkedIn", note: "Professional audience workflows", icon: UsersRound }].map(channel => <article key={channel.name} className="rounded-xl border border-white/10 bg-[#0b1b27] p-4"><channel.icon size={18} className="text-cyan-300" /><p className="mt-4 font-bold text-white">{channel.name}</p><p className="mt-1 text-sm text-slate-400">{channel.note}</p><StatusPill tone="slate">Configured next</StatusPill></article>)}
      </section>
    </div>
  </main>;
}

const staffStages = ["approved", "activated", "visited", "form-started", "form-completed"] as const;

export function BreezeStaffLeads() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const [uploadTier, setUploadTier] = useState<"valid" | "valid-gold">("valid-gold");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const { data, isLoading, error } = trpc.breezePortal.staffLeads.useQuery({ limit: 50 }, { enabled: isAuthenticated, refetchInterval: 5 * 60 * 1000 });
  const updateStage = trpc.breezePortal.updateLeadStage.useMutation({ onSuccess: () => utils.breezePortal.invalidate() });
  const uploadCsv = trpc.breezePortal.uploadApprovedCsv.useMutation({ onSuccess: result => setUploadMessage(`${formatCount(result.approvedRecordCount)} approved ${result.tier} records validated and stored for staff review.`), onError: result => setUploadMessage(result.message) });
  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) { setUploadMessage("Please upload a CSV file with the reviewed header row."); return; }
    setUploadMessage("Validating and storing the approved source…");
    uploadCsv.mutate({ fileName: file.name, csvText: await file.text(), tier: uploadTier });
  };
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#061018] text-slate-200">Checking staff access…</div>;
  if (!isAuthenticated) return <main className="grid min-h-screen place-items-center bg-[#061018] p-6 text-center text-slate-100"><div className="max-w-md rounded-2xl border border-cyan-300/20 bg-[#0b1b27] p-8"><LockKeyhole className="mx-auto text-cyan-300" size={36} /><h1 className="mt-5 text-2xl font-black">Staff lead workflow</h1><p className="mt-3 text-sm leading-6 text-slate-300">Individual approved-lead records are available only to authorized Breeze staff.</p><button onClick={() => startLogin()} className="mt-6 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-[#061018]">Sign in for staff access</button></div></main>;
  return <main className="min-h-screen bg-[#061018] text-slate-100"><PortalHeader staff /><div className="mx-auto max-w-7xl px-5 py-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Staff only · approved contacts</p><h1 className="mt-1 text-3xl font-black">Breeze lead workflow</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">This view is server-protected and contains only valid or validated-gold contacts. Do not export or activate a record without confirming the applicable consent and compliance requirements.</p></div><StatusPill tone="emerald"><ShieldCheck size={12} /> Protected access</StatusPill></div>
    <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl border border-cyan-300/20 bg-[#0b1b27] p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-200">Source control</p><h2 className="mt-2 text-xl font-black">Approved-source intake</h2><p className="mt-2 text-sm leading-6 text-slate-300">The current Google Sheet remains the live approved source. Upload a reviewed CSV only to validate its schema and retain an authorized source record for staff review.</p><div className="mt-4 flex flex-wrap items-center gap-3"><select value={uploadTier} onChange={event => setUploadTier(event.target.value as "valid" | "valid-gold")} className="rounded-lg border border-white/15 bg-[#07131d] px-3 py-2 text-sm text-white"><option value="valid-gold">Validated gold</option><option value="valid">Validated</option></select><label className="cursor-pointer rounded-lg bg-cyan-300 px-3 py-2 text-sm font-bold text-[#061018]">Select reviewed CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={event => void handleUpload(event.target.files?.[0])} /></label></div>{uploadMessage && <p className="mt-3 text-sm text-cyan-100">{uploadMessage}</p>}</div><div className="rounded-2xl border border-white/10 bg-[#0b1b27] p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-200">Event status</p><h2 className="mt-2 text-xl font-black">Record what actually happened.</h2><p className="mt-2 text-sm leading-6 text-slate-300">Use the stage control per approved lead to record activation, website visit, form start, or form completion. These real staff events flow into the public aggregate funnel with no contact details exposed.</p></div></section>
    {error ? <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">{error.message}</div> : <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1b27]"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm text-slate-300"><span>{isLoading ? "Refreshing approved records…" : `${formatCount(data?.leads.length ?? 0)} approved records shown`}</span><span>Gold tier is prioritized first</span></div><div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left text-sm"><thead className="bg-white/[.03] text-[10px] uppercase tracking-[.14em] text-slate-400"><tr><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Tier</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Activity</th></tr></thead><tbody>{data?.leads.map((lead, index) => <tr key={`${lead.email}-${index}`} className="border-t border-white/[.07] text-slate-200"><td className="px-5 py-4 font-semibold">{lead.firstName} {lead.lastName}</td><td className="px-5 py-4">{[lead.city, lead.state].filter(Boolean).join(", ") || "—"}</td><td className="px-5 py-4"><StatusPill tone={lead.tier === "valid-gold" ? "emerald" : "slate"}>{lead.tier === "valid-gold" ? "Gold" : "Valid"}</StatusPill></td><td className="px-5 py-4">{lead.email}</td><td className="px-5 py-4"><select aria-label={`Update ${lead.firstName} ${lead.lastName} funnel stage`} value={lead.stage} disabled={updateStage.isPending} onChange={event => updateStage.mutate({ contactKey: lead.contactKey, stage: event.target.value as typeof staffStages[number] })} className="rounded-md border border-white/15 bg-[#07131d] px-2 py-1.5 text-xs text-white">{staffStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select></td><td className="px-5 py-4">{lead.lastKnownActivity || "—"}</td></tr>)}</tbody></table></div></div>}</div></main>;
}
