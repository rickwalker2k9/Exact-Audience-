import { trpc } from "@/lib/trpc";
import {
  BREEZE_DESTINATIONS,
  type BreezeDestinationKey,
} from "@/lib/breezeTrafficDemo";
import { buildBreezeDemoSignal } from "@/lib/breezeLeadSignals";
import { BREEZE_SOURCE_TOTALS, BREEZE_SOURCE_TRAFFIC } from "@/lib/breezeSourceTraffic";
import { formatBreezeRefreshTime } from "@/lib/breezeRefreshTime";
import { BreezeFunnelHierarchy } from "@/components/BreezeFunnelHierarchy";
import { BREEZE_VERIFIED_SOURCE_RESULTS } from "@/lib/breezeVerifiedSourceResults";
import { BREEZE_WEBSITE_SNAPSHOT, BREEZE_WEBSITE_TRAFFIC } from "@/lib/breezeWebsiteTraffic";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  MapPin,
  Target,
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
  return <><section className="rounded-3xl border border-[#f97316]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#fdba74]">Traffic sources · illustrative demo data</p>
        <h2 className="mt-1 text-2xl font-black text-white">Daily traffic since August 10</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Google Ads, Meta Ads, and Email remain illustrative in this daily chart until you upload source results. Breeze does not connect to advertising-platform APIs.</p>
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
  </section><VerifiedSourceResults /><BreezeFunnelHierarchy /></>;
}

function VerifiedSourceResults() {
  const result = BREEZE_VERIFIED_SOURCE_RESULTS;
  return <section className="mt-7 rounded-3xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#99f6e4]">Verified source allocation</p><h2 className="mt-1 text-2xl font-black text-white">Approved records by reported ad source</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Aggregate allocation from the supplied reporting worksheet. These are approved records, not ad-platform click totals or pixel-measured landing-page visits.</p></div><Pill tone="teal">{result.sourceLabel}</Pill></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-4"><Metric label="Verified records" value={formatCount(result.totalRecords)} note={`Reported ${result.reportedOn}.`} /><Metric label="Google Ads" value={formatCount(result.googleAdsRecords)} note="User-confirmed allocation." /><Metric label="Meta Ads" value={formatCount(result.metaAdsRecords)} note="Balance of supplied records." /><Metric label="Landing-page visits" value="—" note="No visit spreadsheet supplied." /></div>
    <p className="mt-4 text-xs leading-5 text-slate-400">The daily source-monitoring chart remains labeled illustrative because the supplied worksheet contains contact records only; it has no daily Google Ads, Meta Ads, click, or landing-page-visit fields.</p>
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
      <p className="mt-3 text-sm leading-6 text-slate-300">Seen {signal.views} engagement exposure{signal.views === 1 ? "" : "s"} across {signal.channels.join(", ")}. This illustrative sequence is replaced only when uploaded source results and SiteID events are supplied; Breeze does not connect to advertising-platform APIs.</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric label="Ad-seen score" value={`${signal.views} / 6`} note="Illustrative exposures." />
        <Metric label="Likely in 7 days" value={`${signal.sevenDay}%`} note="Ad-seen signal." />
        <Metric label="Likely in 30 days" value={`${signal.thirtyDay}%`} note="Ad-seen signal." />
      </div>
    </section>
    <section className="mt-5 rounded-xl border border-[#fbbf24]/25 bg-black p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fde68a]">Customer journey</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#14b8a6]" /><div><strong className="text-white">Exact Audience behavior-based list</strong><p className="text-slate-400">This record begins in the supplied Exact Audience source layer.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f97316]" /><div><strong className="text-white">Google or Meta response</strong><p className="text-slate-400">This source is reviewed as an ad-response record; total platform delivery is not inferred.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#fdba74]" /><div><strong className="text-white">SiteID website visitor status</strong><p className="text-slate-400">Awaiting the SiteID pixel CSV; no website visit is claimed until a matching event is supplied.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#fbbf24]" /><div><strong className="text-white">Breeze affiliate quote link</strong><p className="text-slate-400">Current destination: {destinationTitle}. Affiliate-page conversions are unavailable and are not displayed.</p></div></li>
      </ol>
    </section>
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
  const pixelsQuery = trpc.breezePortal.pixelConfigurations.useQuery();
  const pixels = (pixelsQuery.data ?? []) as BreezePixelConfiguration[];
  const statusTone = (status: BreezePixelConfiguration["status"]) => status === "active" ? "teal" : status === "paused" ? "gold" : "orange" as const;
  return <section className="rounded-3xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#99f6e4]">Pixel management</p><h2 className="mt-1 text-2xl font-black text-white">Tracking-pixel operations</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Current platform configurations, operating status, and tracked events are maintained in this operating view.</p></div><Pill tone="teal">{pixels.length} configured</Pill></div>
    <div className="mt-5 overflow-hidden rounded-2xl border border-white/15">{pixelsQuery.isLoading ? <p className="p-5 text-sm text-slate-400">Loading pixel configurations…</p> : pixels.length === 0 ? <p className="p-5 text-sm text-slate-400">No tracking-pixel configurations are currently listed.</p> : <table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-black text-[10px] uppercase tracking-[.14em] text-[#fde68a]"><tr><th className="px-4 py-3">Platform</th><th className="px-4 py-3">Pixel ID</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Events</th></tr></thead><tbody>{pixels.map(pixel => <tr key={pixel.id} className="border-t border-white/10 text-slate-200"><td className="px-4 py-3 font-bold text-white">{pixel.platform}</td><td className="px-4 py-3 font-mono text-xs">{pixel.pixelId}</td><td className="px-4 py-3"><Pill tone={statusTone(pixel.status)}>{pixel.status.replace("-", " ")}</Pill></td><td className="px-4 py-3 text-xs">{pixel.eventNames.join(", ")}</td></tr>)}</tbody></table>}</div>
  </section>;
}

function DestinationPage({ leads, onBack }: { leads: OwnerReviewLead[]; onBack: () => void }) {
  const config = BREEZE_DESTINATIONS.affiliate;
  return <main className="min-h-screen bg-black text-slate-100"><header className="border-b border-[#fbbf24]/25 bg-black"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-[#fde68a] hover:text-white"><ArrowLeft size={17} /> Breeze funnel</button><span className="text-lg font-black text-white">Breeze</span><Pill tone="teal">Affiliate destination</Pill></div></header><div className="mx-auto max-w-7xl px-5 py-9"><div className="flex flex-wrap items-start justify-between gap-5"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#fde68a]">{config.eyebrow}</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-white">{config.title}</h1><p className="mt-3 text-base leading-7 text-slate-300">{config.description}</p></div><a href={config.destinationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#fbbf24] px-4 py-3 text-sm font-bold text-black">Open affiliate link <ExternalLink size={16} /></a></div><div className="mt-7 grid gap-4 md:grid-cols-3"><Metric label="Affiliate destination" value="Active" note="Current Breeze quote route." /><Metric label="Source records" value={formatCount(leads.length)} note="Approved roster shown below." /><Metric label="Conversions" value="—" note="Affiliate conversion data unavailable." /></div><LeadTable leads={leads} destination="affiliate" /></div></main>;
}

export default function BreezeLeadPortal() {
  const summary = trpc.breezePortal.summary.useQuery(undefined, { refetchInterval: 5 * 60 * 1000 });
  const rosterQuery = trpc.breezePortal.ownerReview.useQuery({ limit: 500 }, { refetchInterval: 5 * 60 * 1000 });
  const [destination, setDestination] = useState<"affiliate" | null>(null);
  const leads = (rosterQuery.data ?? []) as OwnerReviewLead[];
  if (destination) return <DestinationPage leads={leads} onBack={() => setDestination(null)} />;
  const approvedCount = (summary.data?.valid.count ?? 0) + (summary.data?.validGold.count ?? 0);
  return <main className="min-h-screen bg-black text-slate-100"><section className="border-b border-[#fbbf24]/25 bg-[radial-gradient(circle_at_68%_20%,rgba(249,115,22,.24),transparent_34%),radial-gradient(circle_at_82%_4%,rgba(20,184,166,.16),transparent_28%),#000000]"><div className="mx-auto max-w-7xl px-5 py-12 sm:py-16"><div className="breeze-logo-frame"><img src="/manus-storage/breeze-logo_57fe72cd.png" alt="Breeze" className="breeze-logo-wordmark" /></div><p className="mt-5 text-lg font-medium text-[#fde68a] sm:text-xl">Intent prospects based on behavioral activity.</p></div></section><div className="mx-auto max-w-7xl space-y-7 px-5 py-9"><WebsiteTrafficChart /><SourceTrafficChart /><div className="grid gap-5">{(["affiliate"] as const).map(key => { const item = BREEZE_DESTINATIONS[key]; return <button key={key} onClick={() => setDestination(key)} className="group rounded-3xl border border-[#14b8a6]/45 bg-black p-7 text-left transition-all hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,.6)]"><div className="flex items-start justify-between gap-4"><Pill tone="teal">Affiliate destination</Pill><ChevronRight className="text-[#fbbf24] transition-transform group-hover:translate-x-1" /></div><div className="mt-6 flex items-center gap-4"><div className="flex h-16 w-36 items-center overflow-hidden rounded-xl border border-[#fbbf24]/25 bg-black p-2"><img src="/manus-storage/breeze-logo_57fe72cd.png" alt="Breeze" className="w-full object-contain" /></div><div><h3 className="text-3xl font-black text-white">{item.title}</h3><p className="mt-1 text-sm text-slate-300">The sole Breeze destination.</p></div></div><p className="mt-5 text-sm leading-6 text-slate-300">{item.description}</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><Metric label="Affiliate link" value="Active" note="Current Breeze quote route." /><Metric label="Source records" value={rosterQuery.isLoading ? "—" : formatCount(leads.length)} note="Approved roster review." /><Metric label="Conversions" value="—" note="Affiliate conversion data unavailable." /></div><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#fde68a]">Open Breeze destination details <ArrowRight size={16} /></span></button>; })}</div><PixelManagement /><section className="rounded-2xl border border-[#fbbf24]/25 bg-black p-5"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 shrink-0 text-[#fbbf24]" size={18} /><p className="text-sm leading-6 text-slate-300"><strong className="text-white">Data status:</strong> {summary.isLoading ? "Refreshing approved source…" : `${formatCount(approvedCount)} approved spreadsheet records are available for review.`} <span className="text-[#fde68a]">Approved-source refresh: {formatBreezeRefreshTime(summary.data?.refreshedAt)}.</span> The Exact Audience list, Google/Meta responders, and SiteID visitor layer are shown separately. Website visits remain a placeholder until the SiteID CSV is supplied, and affiliate conversions are not available.</p></div></section></div></main>;
}

export function BreezeStaffLeads() {
  return <BreezeLeadPortal />;
}
