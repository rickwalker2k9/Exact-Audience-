import { trpc } from "@/lib/trpc";
import {
  BREEZE_DESTINATIONS,
  type BreezeDestinationKey,
} from "@/lib/breezeTrafficDemo";
import { buildBreezeEngagementSignal } from "@/lib/breezeLeadSignals";
import { BREEZE_SOURCE_TOTALS, getBreezeSourceTraffic } from "@/lib/breezeSourceTraffic";
import { millisecondsUntilNextLocalDay } from "@/lib/liveDateSeries";
import { formatBreezeRefreshTime } from "@/lib/breezeRefreshTime";
import { BreezeFunnelHierarchy } from "@/components/BreezeFunnelHierarchy";
import { breezeCounterValue } from "@/lib/breezeMotion";
import { BREEZE_VERIFIED_SOURCE_RESULTS, getBreezeVerifiedSourceShares } from "@/lib/breezeVerifiedSourceResults";
import { BREEZE_WEBSITE_SNAPSHOT, BREEZE_WEBSITE_TRAFFIC, formatBreezeOperatingDate } from "@/lib/breezeWebsiteTraffic";
import { BREEZE_WORDMARK_DATA_URI } from "@/lib/breezeWordmark";
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
import { useEffect, useMemo, useRef, useState } from "react";
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

function useBreezeReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [allowMotion, setAllowMotion] = useState(true);
  useEffect(() => {
    const element = ref.current;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setAllowMotion(!reducedMotion);
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    if (!element || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, revealed, allowMotion };
}

function useBreezeCountUp(target: number, revealed: boolean, duration = 980) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!revealed) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(breezeCounterValue(target, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, revealed, target]);
  return value;
}

function AnimatedMetric({ label, target, note, suffix = "", decimals = 0 }: { label: string; target: number; note: string; suffix?: string; decimals?: number }) {
  const { ref, revealed } = useBreezeReveal();
  const value = useBreezeCountUp(target, revealed);
  const formatted = decimals > 0 ? (value / Math.pow(10, decimals)).toFixed(decimals) : formatCount(value);
  return <div ref={ref}><Metric label={label} value={`${formatted}${suffix}`} note={note} /></div>;
}

function BreezeTooltip() {
  return { background: "#000000", border: "1px solid rgba(251,191,36,.45)", borderRadius: 10, color: "#f8fafc", fontSize: 12 };
}

function WebsiteTrafficChart() {
  const { ref, revealed, allowMotion } = useBreezeReveal();
  const [operatingDate, setOperatingDate] = useState(() => new Date());
  const chartData = revealed ? BREEZE_WEBSITE_TRAFFIC : BREEZE_WEBSITE_TRAFFIC.map(point => ({ ...point, visits: 0 }));
  useEffect(() => {
    const refreshAtMidnight = () => setOperatingDate(new Date());
    const timeout = window.setTimeout(refreshAtMidnight, millisecondsUntilNextLocalDay());
    return () => window.clearTimeout(timeout);
  }, []);
  return <section ref={ref} className="rounded-3xl border border-[#fbbf24]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#fde68a]">Main website traffic · Similarweb estimate</p>
        <h2 className="mt-1 text-2xl font-black text-white">meetbreeze.com site-traffic trend</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">An outside estimate for the main website.</p>
      </div>
      <Pill tone="gold">{formatBreezeOperatingDate(operatingDate)} operating view</Pill>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-4">
      <AnimatedMetric label="Website visits" target={20_300} note="July estimate." />
      <AnimatedMetric label="Change from June" target={2419} suffix="%" decimals={2} note="July compared with June." />
      <AnimatedMetric label="Bounce rate" target={4724} suffix="%" decimals={2} note="Outside estimate." />
      <Metric label="Average visit" value="2:38" note="Outside estimate." />
    </div>
    <div className={`breeze-chart-reveal mt-6 h-64 ${revealed ? "breeze-chart-reveal--active" : ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
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
          <Area type="monotone" dataKey="visits" name="Estimated site traffic" stroke="#fbbf24" fill="url(#breezeSiteEstimate)" strokeWidth={3} dot={{ r: 4, fill: "#f97316", stroke: "#fbbf24", strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={revealed && allowMotion} animationDuration={1200} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-400">Source check: {BREEZE_WEBSITE_SNAPSHOT.retrievedOn}. July website estimate: 20.3K visits.</p>
  </section>;
}

function SourceTrafficChart({ showIndividualRecords = false }: { showIndividualRecords?: boolean }) {
  const [trafficSeries, setTrafficSeries] = useState(() => getBreezeSourceTraffic());
  const { ref, revealed, allowMotion } = useBreezeReveal();
  const chartData = revealed ? trafficSeries : trafficSeries.map(point => ({ ...point, google: 0, meta: 0, email: 0 }));
  useEffect(() => {
    const refreshAtMidnight = () => setTrafficSeries(getBreezeSourceTraffic());
    const timeout = window.setTimeout(refreshAtMidnight, millisecondsUntilNextLocalDay());
    return () => window.clearTimeout(timeout);
  }, []);
  return <><section ref={ref} className="rounded-3xl border border-[#f97316]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#fdba74]">Traffic sources</p>
        <h2 className="mt-1 text-2xl font-black text-white">Daily traffic · rolling 8-day view</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Google Ads, Meta Ads, and Email activity across the current rolling eight-day view.</p>
      </div>
      <Pill tone="orange">Channel monitoring</Pill>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <AnimatedMetric label="Google Ads" target={BREEZE_SOURCE_TOTALS.google} note="Rolling eight-day channel activity." />
      <AnimatedMetric label="Meta Ads" target={BREEZE_SOURCE_TOTALS.meta} note="Rolling eight-day channel activity." />
      <AnimatedMetric label="Email" target={BREEZE_SOURCE_TOTALS.email} note="Rolling eight-day channel activity." />
    </div>
    <div className={`breeze-chart-reveal mt-6 h-72 ${revealed ? "breeze-chart-reveal--active" : ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.12)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
          <Tooltip contentStyle={BreezeTooltip()} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#cbd5e1", paddingTop: 14 }} />
          <Line type="monotone" dataKey="google" name="Google Ads" stroke="#f97316" strokeWidth={3} dot={{ r: 3, fill: "#f97316" }} activeDot={{ r: 5 }} isAnimationActive={revealed && allowMotion} animationDuration={1000} animationBegin={100} />
          <Line type="monotone" dataKey="meta" name="Meta Ads" stroke="#fbbf24" strokeWidth={3} dot={{ r: 3, fill: "#fbbf24" }} activeDot={{ r: 5 }} isAnimationActive={revealed && allowMotion} animationDuration={1000} animationBegin={220} />
          <Line type="monotone" dataKey="email" name="Email" stroke="#14b8a6" strokeWidth={3} dot={{ r: 3, fill: "#14b8a6" }} activeDot={{ r: 5 }} isAnimationActive={revealed && allowMotion} animationDuration={1000} animationBegin={340} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section><VerifiedSourceResults /><BreezeFunnelHierarchy showIndividualRecords={showIndividualRecords} /></>;
}

function VerifiedSourceResults() {
  const result = BREEZE_VERIFIED_SOURCE_RESULTS;
  const { ref, revealed } = useBreezeReveal();
  const total = useBreezeCountUp(result.totalRecords, revealed);
  const google = useBreezeCountUp(result.googleAdsRecords, revealed, 820);
  const meta = useBreezeCountUp(result.metaAdsRecords, revealed, 1060);
  const shares = getBreezeVerifiedSourceShares();
  const rows = [
    { label: "Google Ads", count: google, share: shares.googleAds, accent: "#f97316", tint: "#fdba74" },
    { label: "Meta Ads", count: meta, share: shares.metaAds, accent: "#fbbf24", tint: "#fde68a" },
  ];
  return <section ref={ref} className="mt-7 rounded-3xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#99f6e4]">Google and Meta results</p><h2 className="mt-1 text-2xl font-black text-white">People who responded</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">350 people responded through Google Ads or Meta Ads.</p></div><Pill tone="teal">Current view</Pill></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[.66fr_1.34fr]"><div className="rounded-2xl border border-[#14b8a6]/25 bg-[radial-gradient(circle_at_70%_20%,rgba(20,184,166,.14),transparent_34%),#000] p-5"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#99f6e4]">People who responded</p><p className="mt-3 text-5xl font-black tracking-[-.05em] text-white">{formatCount(total)}</p><p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">This shows responses. It does not show all ad views or website visits.</p><div className="mt-5 border-t border-white/10 pt-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#fdba74]">SiteID</p><p className="mt-1 text-sm font-bold text-white">Not installed yet</p><p className="mt-1 text-xs leading-5 text-slate-400">Website visitor results will appear after setup.</p></div></div><div className="rounded-2xl border border-white/10 bg-black p-5"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-500">Google and Meta split</p><p className="mt-1 text-sm text-slate-300">This shows responses only.</p></div><p className="text-xs font-bold text-[#99f6e4]">{formatCount(result.totalRecords)} total</p></div><div className="mt-6 space-y-5">{rows.map((row, index) => <div key={row.label}><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-black text-white">{row.label}</p><p className="mt-1 text-xs text-slate-400">People who responded</p></div><p className="text-right"><span className="text-2xl font-black" style={{ color: row.tint }}>{formatCount(row.count)}</span><span className="ml-2 text-xs font-bold text-slate-400">{row.share}%</span></p></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-white/5"><div className={`breeze-response-bar h-full origin-left rounded-full ${revealed ? "breeze-response-bar--active" : ""}`} style={{ width: `${row.share}%`, background: `linear-gradient(90deg, ${row.accent}, ${row.tint}, #14b8a6)`, transitionDelay: `${index * 140}ms` }} /></div></div>)}</div></div></div>
  </section>;
}

function LeadJourney({ lead, destination }: { lead: OwnerReviewLead; destination: BreezeDestinationKey }) {
  const signal = buildBreezeEngagementSignal(lead.name);
  const destinationTitle = BREEZE_DESTINATIONS[destination].title;
  return <aside className="rounded-2xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.38)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Pill tone="teal"><UserRound size={12} /> Lead detail</Pill>
        <h3 className="mt-3 text-2xl font-black text-white">{lead.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-300"><MapPin size={14} /> {lead.location}</p>
      </div>
      <Pill tone="orange">Engagement journey</Pill>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <Metric label="Age range" value={lead.ageRange || "—"} note="Profile availability." />
      <Metric label="Income level" value="—" note="Profile availability." />
      <Metric label="Email" value={lead.email || "—"} note={lead.emailProvider || "Contact availability"} />
      <Metric label="Phone" value="—" note="Contact availability." />
    </div>
    <section className="mt-5 rounded-xl border border-[#f97316]/30 bg-black p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fdba74]">Engagement journey</p>
      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: 6 }).map((_, index) => <span key={index} className={`h-3 flex-1 rounded-full ${index < signal.views ? "bg-[#f97316]" : "bg-white/10"}`} />)}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">Engagement signals across {signal.channels.join(", ")} are organized into the current operating sequence. SiteID is intentionally excluded from individual journeys until the pixel is installed.</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric label="Engagement score" value={`${signal.views} / 6`} note="Channel activity." />
        <Metric label="7-day window" value={`${signal.sevenDay}%`} note="Engagement signal." />
        <Metric label="30-day window" value={`${signal.thirtyDay}%`} note="Engagement signal." />
      </div>
    </section>
    <section className="mt-5 rounded-xl border border-[#fbbf24]/25 bg-black p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fde68a]">Customer journey</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#14b8a6]" /><div><strong className="text-white">Exact Audience behavior-based list</strong><p className="text-slate-400">This record begins in the supplied Exact Audience source layer.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f97316]" /><div><strong className="text-white">Google or Meta response</strong><p className="text-slate-400">This source is reviewed as an ad-response record; total platform delivery is not inferred.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#fdba74]" /><div><strong className="text-white">Insurance research context</strong><p className="text-slate-400">A 30-day comparison context kept separate from SiteID visitor events.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#fbbf24]" /><div><strong className="text-white">Breeze affiliate quote link</strong><p className="text-slate-400">Current destination: {destinationTitle}. Affiliate-page conversions are unavailable and are not displayed.</p></div></li>
      </ol>
    </section>
    <section className="mt-5 rounded-xl border border-[#14b8a6]/30 bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#99f6e4]">30-day insurance research context</p>
        <Pill tone="teal">Comparison path</Pill>
      </div>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {signal.researchPath.map((step, index) => {
          const day = 30 - index * 10;
          return <li key={`${step.provider}-${step.topic}`} className="rounded-lg border border-white/10 bg-black p-3">
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#99f6e4]">Day {day}</p>
            <p className="mt-2 text-sm font-bold text-white">{step.provider}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{step.topic}</p>
          </li>;
        })}
      </ol>
      <p className="mt-3 text-xs leading-5 text-slate-400">This comparison context does not create or imply a SiteID visitor event. SiteID remains pending until installation.</p>
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

export default function BreezeLeadPortal({ showIndividualRecords = false }: { showIndividualRecords?: boolean }) {
  return <main className="min-h-screen bg-black text-slate-100"><section className="border-b border-[#fbbf24]/25 bg-[radial-gradient(circle_at_68%_20%,rgba(249,115,22,.24),transparent_34%),radial-gradient(circle_at_82%_4%,rgba(20,184,166,.16),transparent_28%),#000000]"><div className="mx-auto max-w-7xl px-5 py-12 sm:py-16"><div className="breeze-logo-frame"><img src={BREEZE_WORDMARK_DATA_URI} alt="Breeze" className="breeze-logo-wordmark" /></div><p className="mt-5 text-lg font-medium text-[#fde68a] sm:text-xl">Intent prospects based on behavioral activity.</p></div></section><div className="mx-auto max-w-7xl space-y-7 px-5 py-9"><WebsiteTrafficChart /><SourceTrafficChart showIndividualRecords={showIndividualRecords} /></div><footer className="border-t border-[#fbbf24]/20 bg-black px-5 py-6 text-center text-[10px] font-medium tracking-[.08em] text-slate-500 sm:text-[11px]">Copyright 2026 Exact Audience AI, a service of Imagine Agency LLC. All rights reserved.</footer></main>;
}

export function BreezeStaffLeads() {
  return <BreezeLeadPortal showIndividualRecords />;
}
