import { trpc } from "@/lib/trpc";
import {
  BREEZE_DESTINATIONS,
  BREEZE_DESTINATION_DAILY_TRAFFIC,
  type BreezeDestinationKey,
} from "@/lib/breezeTrafficDemo";
import { buildBreezeDemoSignal } from "@/lib/breezeLeadSignals";
import { BREEZE_SOURCE_TOTALS, BREEZE_SOURCE_TRAFFIC } from "@/lib/breezeSourceTraffic";
import { BREEZE_WEBSITE_SNAPSHOT, BREEZE_WEBSITE_TRAFFIC } from "@/lib/breezeWebsiteTraffic";
import { BreezeFormFillWorkflow } from "@/components/BreezeFormFillWorkflow";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FileSpreadsheet,
  MapPin,
  Target,
  Upload,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type OwnerReviewLead = {
  name: string;
  location: string;
  ageRange: string;
  email: string;
  emailProvider: string;
  stage: string;
  lastKnownActivity: string;
};

type BreezePixelConfiguration = {
  id: number;
  platform: string;
  pixelId: string;
  status: "active" | "paused" | "needs-review";
  eventNames: string[];
  sourceLabel: string;
  updatedAt: Date;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function Pill({ children, tone = "teal" }: { children: React.ReactNode; tone?: "orange" | "gold" | "teal" | "neutral" }) {
  const className = {
    orange: "border-[#f97316]/50 bg-[#f97316]/10 text-[#fdba74]",
    gold: "border-[#fbbf24]/50 bg-[#fbbf24]/10 text-[#fde68a]",
    teal: "border-[#14b8a6]/50 bg-[#14b8a6]/10 text-[#99f6e4]",
    neutral: "border-white/20 bg-white/5 text-slate-200",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] ${className}`}>{children}</span>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="rounded-xl border border-white/15 bg-black p-4">
    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-black text-white">{value}</p>
    <p className="mt-2 text-xs leading-5 text-slate-400">{note}</p>
  </article>;
}

function BreezeTooltip() {
  return { background: "#000000", border: "1px solid rgba(251,191,36,.45)", borderRadius: 10, color: "#f8fafc", fontSize: 12 };
}

function WebsiteTrafficChart() {
  return <section className="rounded-3xl border border-[#fbbf24]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#fde68a]">Main website traffic · Similarweb estimate</p>
        <h2 className="mt-1 text-2xl font-black text-white">meetbreeze.com site-traffic trend</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">A third-party website measurement snapshot for the main site. This is not first-party analytics or campaign delivery data.</p>
      </div>
      <Pill tone="gold">{BREEZE_WEBSITE_SNAPSHOT.retrievedOn} snapshot</Pill>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-4">
      <Metric label="Reported visits" value="20.3K" note="Similarweb July panel." />
      <Metric label="Month over month" value="+24.19%" note="Similarweb-reported change." />
      <Metric label="Bounce rate" value="47.24%" note="Similarweb estimate." />
      <Metric label="Average duration" value="2:38" note="Similarweb estimate." />
    </div>
    <div className="mt-6 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={BREEZE_WEBSITE_TRAFFIC} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="breezeSiteEstimate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.48} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.12)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={value => `${Math.round(value / 1000)}K`} />
          <Tooltip contentStyle={BreezeTooltip()} formatter={(value: number) => [`${formatCount(value)} visits`, "Estimated site traffic"]} />
          <Area type="monotone" dataKey="visits" name="Estimated site traffic" stroke="#fbbf24" fill="url(#breezeSiteEstimate)" strokeWidth={3} dot={{ r: 4, fill: "#f97316", stroke: "#fbbf24", strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-400">July is the reported 20.3K Similarweb visit estimate. June is a transparent derived point calculated from the same source’s reported +24.19% month-over-month change; no unreported daily values are modeled.</p>
  </section>;
}

function SourceTrafficChart() {
  return <section className="rounded-3xl border border-[#f97316]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#fdba74]">Traffic sources · illustrative demo data</p>
        <h2 className="mt-1 text-2xl font-black text-white">Daily traffic since August 10</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Google Ads, Meta Ads, and Email are modeled only for the operating-demo view until source-platform reporting is connected.</p>
      </div>
      <Pill tone="orange">Demo source monitoring</Pill>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <Metric label="Google Ads" value={formatCount(BREEZE_SOURCE_TOTALS.google)} note="Illustrative Aug 10–17 traffic." />
      <Metric label="Meta Ads" value={formatCount(BREEZE_SOURCE_TOTALS.meta)} note="Illustrative Aug 10–17 traffic." />
      <Metric label="Email" value={formatCount(BREEZE_SOURCE_TOTALS.email)} note="Illustrative Aug 10–17 traffic." />
    </div>
    <div className="mt-6 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={BREEZE_SOURCE_TRAFFIC} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.12)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
          <Tooltip contentStyle={BreezeTooltip()} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#cbd5e1", paddingTop: 14 }} />
          <Line type="monotone" dataKey="google" name="Google Ads" stroke="#f97316" strokeWidth={3} dot={{ r: 3, fill: "#f97316" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="meta" name="Meta Ads" stroke="#fbbf24" strokeWidth={3} dot={{ r: 3, fill: "#fbbf24" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="email" name="Email" stroke="#14b8a6" strokeWidth={3} dot={{ r: 3, fill: "#14b8a6" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>;
}

function DailyTrafficChart({ destination }: { destination: BreezeDestinationKey }) {
  const points = BREEZE_DESTINATION_DAILY_TRAFFIC[destination];
  const max = Math.max(...points.map(point => point.hits), 1);
  const accent = destination === "affiliate" ? "from-[#14b8a6] to-[#99f6e4]" : "from-[#f97316] to-[#fbbf24]";
  return <section className="rounded-2xl border border-[#fbbf24]/25 bg-black p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fde68a]">Daily traffic · illustrative demo data</p>
        <h3 className="mt-1 text-xl font-black text-white">Traffic going to this link</h3>
      </div>
      <Pill tone="gold">Demo only</Pill>
    </div>
    <div className="mt-6 flex h-48 items-end gap-1.5 border-b border-white/15 pb-5">
      {points.map(point => <div key={point.day} className="group flex min-w-0 flex-1 flex-col justify-end">
        <div className={`relative rounded-t-md bg-gradient-to-t ${accent}`} style={{ height: `${Math.max(2, (point.hits / max) * 100)}%` }}>
          <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block">{formatCount(point.hits)} hits</span>
        </div>
        <span className="mt-2 truncate text-center text-[9px] text-slate-500">{point.day.replace(" ", "")}</span>
      </div>)}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-400">This is a labeled illustrative traffic review series. The calculator route is zero in July and August after the destination transition.</p>
  </section>;
}

function LeadJourney({ lead, destination }: { lead: OwnerReviewLead; destination: BreezeDestinationKey }) {
  const signal = buildBreezeDemoSignal(lead.name);
  const destinationTitle = BREEZE_DESTINATIONS[destination].title;
  return <aside className="rounded-2xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Pill tone="teal"><UserRound size={12} /> Lead detail</Pill>
        <h3 className="mt-3 text-2xl font-black text-white">{lead.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-300"><MapPin size={14} /> {lead.location}</p>
      </div>
      <Pill tone="orange">Demo journey</Pill>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <Metric label="Age range" value={lead.ageRange || "Not supplied"} note="Approved-sheet field when available." />
      <Metric label="Income level" value="Not supplied" note="No income field has been connected." />
      <Metric label="Email" value={lead.email || "Not supplied"} note={`Approved-sheet contact · ${lead.emailProvider || "provider unavailable"}`} />
      <Metric label="Phone" value="Not supplied" note="No phone number is connected in this view." />
    </div>
    <section className="mt-5 rounded-xl border border-[#f97316]/30 bg-black p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fdba74]">Ad engagement journey · illustrative demo</p>
      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: 6 }).map((_, index) => <span key={index} className={`h-3 flex-1 rounded-full ${index < signal.views ? "bg-[#f97316]" : "bg-white/10"}`} />)}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">Seen {signal.views} engagement exposure{signal.views === 1 ? "" : "s"} across {signal.channels.join(", ")}. Demo website engagement begins after exposure {signal.engagedAfter}; live source-platform and website events are not connected yet.</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric label="Ad-seen score" value={`${signal.views} / 6`} note="Illustrative exposures." />
        <Metric label="Likely in 7 days" value={`${signal.sevenDay}%`} note="Ad-seen signal." />
        <Metric label="Likely in 30 days" value={`${signal.thirtyDay}%`} note="Ad-seen signal." />
      </div>
    </section>
    <section className="mt-5 rounded-xl border border-[#fbbf24]/25 bg-black p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fde68a]">Customer journey</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#14b8a6]" /><div><strong className="text-white">Approved lead record</strong><p className="text-slate-400">Included in the approved spreadsheet review set.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f97316]" /><div><strong className="text-white">Source engagement sequence</strong><p className="text-slate-400">Illustrative Google Ads, Meta Ads, and Email engagement sequence.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#fbbf24]" /><div><strong className="text-white">Destination: {destinationTitle}</strong><p className="text-slate-400">Destination-specific link routing is shown in this view.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/50" /><div><strong className="text-white">Form-fill workflow</strong><p className="text-slate-400">Unique email, unique phone, consent questions, and submission are staged pending workflow activation.</p></div></li>
      </ol>
    </section>
    <BreezeFormFillWorkflow leadName={lead.name} />
  </aside>;
}

function LeadTable({ leads, destination }: { leads: OwnerReviewLead[]; destination: BreezeDestinationKey }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<OwnerReviewLead | null>(null);
  const filtered = useMemo(() => leads.filter(lead => `${lead.name} ${lead.location}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100), [leads, query]);
  return <section className="mt-6 rounded-2xl border border-[#fbbf24]/25 bg-black p-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fde68a]">Leads sent to this link</p><h2 className="mt-1 text-2xl font-black text-white">Approved lead roster</h2><p className="mt-2 text-sm text-slate-400">Select a name to see profile data, ad-seen engagement, likelihood windows, and the staged form-fill workflow.</p></div><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name or location" className="w-full rounded-lg border border-[#fbbf24]/25 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#14b8a6] sm:w-64" /></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.82fr]"><div className="overflow-hidden rounded-xl border border-white/15"><div className="max-h-[37rem] overflow-auto"><table className="w-full min-w-[690px] text-left text-sm"><thead className="sticky top-0 bg-black text-[10px] uppercase tracking-[.14em] text-[#fde68a]"><tr><th className="px-4 py-3">Lead</th><th className="px-4 py-3">Age range</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Stage</th></tr></thead><tbody>{filtered.map((lead, index) => <tr key={`${lead.name}-${index}`} onClick={() => setSelected(lead)} className={`cursor-pointer border-t border-white/[.1] text-slate-200 transition-colors hover:bg-[#14b8a6]/10 ${selected?.name === lead.name ? "bg-[#14b8a6]/15" : ""}`}><td className="px-4 py-3 font-semibold">{lead.name}</td><td className="px-4 py-3">{lead.ageRange || "Not supplied"}</td><td className="px-4 py-3">{lead.location}</td><td className="px-4 py-3 capitalize">{lead.stage.replace("-", " ")}</td></tr>)}</tbody></table></div>{filtered.length === 0 && <p className="p-5 text-sm text-slate-400">No approved leads match this search.</p>}</div>{selected ? <LeadJourney lead={selected} destination={destination} /> : <div className="grid min-h-72 place-items-center rounded-xl border border-dashed border-[#14b8a6]/35 bg-black p-6 text-center"><div><Target className="mx-auto text-[#14b8a6]" size={26} /><h3 className="mt-3 font-bold text-white">Select a lead</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">Click a row to open the engagement journey, 7-day and 30-day likelihood, and staged form-fill view.</p></div></div>}</div>
  </section>;
}

function PixelManagement() {
  const utils = trpc.useUtils();
  const pixelsQuery = trpc.breezePortal.pixelConfigurations.useQuery();
  const importMutation = trpc.breezePortal.importPixelCsv.useMutation();
  const [message, setMessage] = useState<string | null>(null);
  const pixels = (pixelsQuery.data ?? []) as BreezePixelConfiguration[];
  const statusTone = (status: BreezePixelConfiguration["status"]) => status === "active" ? "teal" : status === "paused" ? "gold" : "orange" as const;
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) { setMessage("Please export the spreadsheet as a CSV file before importing."); return; }
    setMessage(null);
    try {
      const response = await importMutation.mutateAsync({ fileName: file.name, csvText: await file.text() });
      await utils.breezePortal.pixelConfigurations.invalidate();
      setMessage(`${response.importedCount} pixel configuration${response.importedCount === 1 ? "" : "s"} imported.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The pixel spreadsheet could not be imported.");
    }
  };
  return <section className="rounded-3xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#99f6e4]">Pixel management</p><h2 className="mt-1 text-2xl font-black text-white">Tracking-pixel operations</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Import the current platform, pixel ID, operating status, and tracked events from a spreadsheet. Imports are retained for owner or administrator access only.</p></div><Pill tone="teal">{pixels.length} configured</Pill></div>
    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_.9fr]"><div className="rounded-2xl border border-[#fbbf24]/25 bg-black p-4"><div className="flex items-center gap-2 text-[#fde68a]"><FileSpreadsheet size={17} /><h3 className="font-black">CSV import</h3></div><p className="mt-2 text-sm leading-6 text-slate-300">Required columns: <strong className="text-white">Platform</strong>, <strong className="text-white">Pixel ID</strong>, <strong className="text-white">Status</strong>, and <strong className="text-white">Events</strong>. Use <strong className="text-white">active</strong>, <strong className="text-white">paused</strong>, or <strong className="text-white">needs-review</strong> for status. Separate events with semicolons.</p><label className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-3 py-2 text-xs font-black text-black transition-transform active:scale-[.97]"><Upload size={15} />{importMutation.isPending ? "Importing…" : "Import pixel CSV"}<input type="file" accept=".csv,text/csv" onChange={handleFile} className="sr-only" disabled={importMutation.isPending} /></label>{message && <p className="mt-3 text-xs leading-5 text-[#fde68a]">{message}</p>}</div><div className="rounded-2xl border border-[#f97316]/25 bg-black p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fdba74]">Template row</p><code className="mt-3 block overflow-x-auto rounded-lg border border-white/10 bg-black p-3 text-xs text-slate-200">Platform,Pixel ID,Status,Events<br />Meta Pixel,123456789,active,PageView;Lead;QuoteStart</code><p className="mt-3 text-xs leading-5 text-slate-400">The raw CSV is stored securely with the import record. This panel stores configuration and event labels; it does not claim that a tag is firing until verification data is connected.</p></div></div>
    <div className="mt-5 overflow-hidden rounded-2xl border border-white/15">{pixelsQuery.isLoading ? <p className="p-5 text-sm text-slate-400">Loading pixel configurations…</p> : pixels.length === 0 ? <p className="p-5 text-sm text-slate-400">No pixel configuration spreadsheet has been imported yet.</p> : <table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-black text-[10px] uppercase tracking-[.14em] text-[#fde68a]"><tr><th className="px-4 py-3">Platform</th><th className="px-4 py-3">Pixel ID</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Events</th><th className="px-4 py-3">Source</th></tr></thead><tbody>{pixels.map(pixel => <tr key={pixel.id} className="border-t border-white/10 text-slate-200"><td className="px-4 py-3 font-bold text-white">{pixel.platform}</td><td className="px-4 py-3 font-mono text-xs">{pixel.pixelId}</td><td className="px-4 py-3"><Pill tone={statusTone(pixel.status)}>{pixel.status.replace("-", " ")}</Pill></td><td className="px-4 py-3 text-xs">{pixel.eventNames.join(", ")}</td><td className="px-4 py-3 text-xs text-slate-400">{pixel.sourceLabel}</td></tr>)}</tbody></table>}</div>
  </section>;
}

function DestinationPage({ destination, leads, onBack }: { destination: BreezeDestinationKey; leads: OwnerReviewLead[]; onBack: () => void }) {
  const config = BREEZE_DESTINATIONS[destination];
  const currentLeadCount = destination === "affiliate" ? leads.length : 0;
  return <main className="min-h-screen bg-black text-slate-100"><header className="border-b border-[#fbbf24]/25 bg-black"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-[#fde68a] hover:text-white"><ArrowLeft size={17} /> All destinations</button><span className="text-lg font-black text-white">Breeze</span><Pill tone={destination === "affiliate" ? "teal" : "orange"}>Destination detail</Pill></div></header><div className="mx-auto max-w-7xl px-5 py-9"><div className="flex flex-wrap items-start justify-between gap-5"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#fde68a]">{config.eyebrow}</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-white">{config.title}</h1><p className="mt-3 text-base leading-7 text-slate-300">{config.description}</p></div>{config.destinationUrl ? <a href={config.destinationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#fbbf24] px-4 py-3 text-sm font-bold text-black">Open affiliate link <ExternalLink size={16} /></a> : <Pill tone="neutral">No July–August routing</Pill>}</div><div className="mt-7 grid gap-4 md:grid-cols-3"><Metric label="Traffic period" value={config.activePeriod} note="Illustrative traffic review." /><Metric label="Leads routed" value={formatCount(currentLeadCount)} note={destination === "affiliate" ? "Current approved roster shown below." : "No historical lead attribution connected."} /><Metric label="Opt-ins" value="Not connected" note="Connect form events to report actual opt-ins." /></div><div className="mt-6"><DailyTrafficChart destination={destination} /></div>{destination === "calculator" ? <section className="mt-6 rounded-2xl border border-[#f97316]/30 bg-black p-6 text-sm leading-7 text-[#fed7aa]"><strong>Income Protection Tool historical view.</strong> This route has illustrative May–June traffic and zero July–August traffic. Individual calculator-lead attribution and opt-ins have not been connected from the current sheet.</section> : <LeadTable leads={leads} destination={destination} />}</div></main>;
}

export default function BreezeLeadPortal() {
  const summary = trpc.breezePortal.summary.useQuery(undefined, { refetchInterval: 5 * 60 * 1000 });
  const rosterQuery = trpc.breezePortal.ownerReview.useQuery({ limit: 500 }, { refetchInterval: 5 * 60 * 1000 });
  const [destination, setDestination] = useState<BreezeDestinationKey | null>(null);
  const leads = (rosterQuery.data ?? []) as OwnerReviewLead[];
  if (destination) return <DestinationPage destination={destination} leads={leads} onBack={() => setDestination(null)} />;
  const approvedCount = (summary.data?.valid.count ?? 0) + (summary.data?.validGold.count ?? 0);
  return <main className="min-h-screen bg-black text-slate-100"><section className="border-b border-[#fbbf24]/25 bg-[radial-gradient(circle_at_68%_20%,rgba(249,115,22,.24),transparent_34%),radial-gradient(circle_at_82%_4%,rgba(20,184,166,.16),transparent_28%),#000000]"><div className="mx-auto max-w-7xl px-5 py-12 sm:py-16"><div className="breeze-logo-frame"><img src="/manus-storage/breeze-logo_57fe72cd.png" alt="Breeze" className="breeze-logo-wordmark" /></div><p className="mt-5 text-lg font-medium text-[#fde68a] sm:text-xl">Intent prospects based on behavioral activity.</p></div></section><div className="mx-auto max-w-7xl space-y-7 px-5 py-9"><WebsiteTrafficChart /><SourceTrafficChart /><div className="grid gap-5 lg:grid-cols-2">{(Object.keys(BREEZE_DESTINATIONS) as BreezeDestinationKey[]).map(key => { const item = BREEZE_DESTINATIONS[key]; const affiliate = key === "affiliate"; return <button key={key} onClick={() => setDestination(key)} className={`group rounded-3xl border bg-black p-7 text-left transition-all hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,.6)] ${affiliate ? "border-[#14b8a6]/45" : "border-[#f97316]/45"}`}><div className="flex items-start justify-between gap-4"><Pill tone={affiliate ? "teal" : "orange"}>{item.eyebrow}</Pill><ChevronRight className="text-[#fbbf24] transition-transform group-hover:translate-x-1" /></div><h3 className="mt-8 text-3xl font-black text-white">{item.title}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-slate-300">{item.description}</p><div className="mt-7 grid grid-cols-3 gap-3"><Metric label="Traffic" value={item.activePeriod} note="Review range" /><Metric label="Leads" value={affiliate ? (rosterQuery.isLoading ? "—" : formatCount(leads.length)) : "0"} note={affiliate ? "Approved roster" : "No linked roster"} /><Metric label="Opt-ins" value="—" note="Not connected" /></div><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#fde68a]">Open destination details <ArrowRight size={16} /></span></button>; })}</div><PixelManagement /><section className="rounded-2xl border border-[#fbbf24]/25 bg-black p-5"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 shrink-0 text-[#fbbf24]" size={18} /><p className="text-sm leading-6 text-slate-300"><strong className="text-white">Data status:</strong> {summary.isLoading ? "Refreshing approved source…" : `${formatCount(approvedCount)} approved spreadsheet records are available for review.`} Website traffic is displayed as an attributed Similarweb estimate; destination and ad-source activity remain clearly labeled illustrative data until connected.</p></div></section></div></main>;
}

export function BreezeStaffLeads() {
  return <BreezeLeadPortal />;
}
