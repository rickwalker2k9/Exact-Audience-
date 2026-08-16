import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Database,
  Filter,
  Globe2,
  LockKeyhole,
  MailCheck,
  MousePointerClick,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { BREEZE_CAMPAIGN_DESTINATIONS } from "@/lib/breezeCampaignDestinations";

function formatCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

function formatSourceRefresh(refreshedAt?: string) {
  if (!refreshedAt) return "Refreshing approved source…";
  return `Approved source refreshed ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(refreshedAt))}`;
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
          <StatusPill><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Operating status</StatusPill>
          {staff && <Link href="/breeze-insurance" className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 no-underline hover:bg-white/5">Review view</Link>}
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
  const review = trpc.breezePortal.ownerReview.useQuery({ limit: 500 }, { refetchInterval: 5 * 60 * 1000 });
  const validReady = Boolean(data?.valid.schemaReady);
  const goldReady = Boolean(data?.validGold.schemaReady);
  const approvedTotal = (data?.valid.count ?? 0) + (data?.validGold.count ?? 0);

  return <main className="min-h-screen bg-[#061018] text-slate-100">
    <PortalHeader />
    <section className="relative overflow-hidden border-b border-cyan-300/10 bg-[radial-gradient(circle_at_78%_0%,rgba(34,211,238,.18),transparent_34%),linear-gradient(110deg,#071722_0%,#092334_55%,#07131d_100%)]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="max-w-3xl">
          <StatusPill tone="emerald"><CheckCircle2 size={12} /> Owner review</StatusPill>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Breeze operating results.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Current approved-source inventory, recorded funnel events, and destination history. Counts are shown only where a source is connected; blank activity is not modeled or estimated.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 font-bold text-[#061018]"><Database size={16} /> Approved-source data</span>
          </div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-5 py-9">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Source status</p><h2 className="mt-1 text-2xl font-extrabold text-white">Approved records currently available for review.</h2><p className="mt-2 text-xs text-slate-400">{formatSourceRefresh(data?.refreshedAt)}</p></div>
        {!isLoading && <StatusPill tone={validReady && goldReady ? "emerald" : "amber"}>{validReady && goldReady ? "Schema ready" : "Action needed"}</StatusPill>}
      </div>
      {error ? <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">The approved-lead summary could not be refreshed. No lead details are exposed. Retry the source connection before acting on counts.</div> : <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Approved source roster" value={isLoading ? "—" : formatCount(approvedTotal)} description="Roster size only—not campaign traffic, quote, or completed-form performance." />
        <MetricCard label="Validated-gold review set" value={isLoading ? "—" : formatCount(data?.validGold.count ?? 0)} description="Approved contacts available for owner review; this is not a conversion result." tone="emerald" />
        <MetricCard label="General valid cohort" value={isLoading ? "—" : formatCount(data?.valid.count ?? 0)} description={validReady ? "Approved sendable records from the standard validated cohort." : "Awaiting the matching header row before this tab is imported automatically."} tone={validReady ? "cyan" : "amber"} />
      </div>}

      {!validReady && !isLoading && <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50"><CircleAlert className="mt-0.5 shrink-0 text-amber-300" size={18} /><span><strong>General valid tab is held safely.</strong> Add the reviewed header row used by the validated-gold tab before it is automatically imported. This prevents a column-order change from misclassifying real contacts.</span></div>}

      <section className="mt-10">
        <div className="rounded-2xl border border-white/10 bg-[#0b1b27] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Recorded event status</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">Funnel events recorded to date.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {[{ key: "approved", icon: Filter, title: "Approved", text: "Valid only" }, { key: "activated", icon: MailCheck, title: "Activated", text: "Email / paid touch" }, { key: "visited", icon: MousePointerClick, title: "Visited", text: "Website event" }, { key: "form-started", icon: ClipboardCheck, title: "Form started", text: "Intent signal" }, { key: "form-completed", icon: CheckCircle2, title: "Form completed", text: "Lead handoff" }].map((step, index) => <div key={step.title} className="relative rounded-xl border border-white/10 bg-[#07131d] p-4">{index < 4 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-cyan-300 sm:block" size={18} />}<step.icon className="text-cyan-300" size={20} /><p className="mt-5 text-sm font-bold text-white">{step.title}</p><p className="mt-1 text-2xl font-black text-cyan-100">{isLoading ? "—" : formatCount(data?.funnel?.[step.key as keyof NonNullable<typeof data>['funnel']] ?? 0)}</p><p className="mt-1 text-xs text-slate-400">{step.text}</p></div>)}</div>
          <p className="mt-5 text-sm leading-6 text-slate-300">These are recorded operating events only. Campaign delivery, clicks, quotes, website visits, and form outcomes remain unreported until their source data is connected.</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#0b1b27] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Destination history</p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">Traffic destination by period.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">May through July traffic was sent to the Income Protection Calculator. Current traffic is directed to the affiliate quote flow. This panel describes routing only; it does not infer traffic, clicks, quotes, or completed forms.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {BREEZE_CAMPAIGN_DESTINATIONS.map(destination => <article key={destination.period} className="rounded-xl border border-white/10 bg-[#07131d] p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{destination.period}</p><p className="mt-3 font-bold text-white">{destination.destination}</p><p className="mt-2 text-xs text-slate-400">{destination.status}</p>{destination.url && <a href={destination.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-200 hover:text-cyan-100">Open affiliate quote flow <ArrowRight size={14} /></a>}</article>)}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#0b1b27]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-6 py-5">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Approved roster</p><h2 className="mt-1 text-2xl font-extrabold text-white">Names and current recorded stage</h2><p className="mt-2 text-sm text-slate-400">Temporary owner-review view. Contact addresses and source controls are not displayed here.</p></div>
          <StatusPill tone="amber">Temporary review</StatusPill>
        </div>
        {review.isLoading ? <p className="p-6 text-sm text-slate-300">Loading approved roster…</p> : review.error ? <p className="p-6 text-sm text-rose-200">The approved review roster could not be refreshed.</p> : <div className="max-h-[34rem] overflow-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="sticky top-0 bg-[#0d2330] text-[10px] uppercase tracking-[0.15em] text-slate-400"><tr><th className="px-6 py-3">Approved contact</th><th className="px-6 py-3">Location</th><th className="px-6 py-3">Tier</th><th className="px-6 py-3">Funnel stage</th><th className="px-6 py-3">Last activity</th></tr></thead><tbody>{review.data?.map((lead, index) => <tr key={`${lead.name}-${index}`} className="border-t border-white/[.07] text-slate-200"><td className="px-6 py-3.5 font-semibold">{lead.name}</td><td className="px-6 py-3.5">{lead.location}</td><td className="px-6 py-3.5"><StatusPill tone={lead.tier === "valid-gold" ? "emerald" : "slate"}>{lead.tier === "valid-gold" ? "Validated gold" : "Valid"}</StatusPill></td><td className="px-6 py-3.5 capitalize">{lead.stage.replace("-", " ")}</td><td className="px-6 py-3.5 text-slate-400">{lead.lastKnownActivity}</td></tr>)}</tbody></table></div>}
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
