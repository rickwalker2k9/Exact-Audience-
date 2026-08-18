import { BREEZE_SOURCE_SELECTOR, type BreezeSourceSelectorId } from "@/lib/breezeSourceSelector";
import { BREEZE_JOURNEY_STAGES, BREEZE_SITEID_FIELD_GROUPS } from "@/lib/breezeSiteIdSchema";
import { getExactAudienceDemoActivity } from "@/lib/breezeExactAudienceActivity";
import { buildBreezeEngagementSignal } from "@/lib/breezeLeadSignals";
import { BREEZE_OPERATING_TELEMETRY, BREEZE_STAGE_STATUS } from "@/lib/breezeOperatingTelemetry";
import { breezeCounterValue } from "@/lib/breezeMotion";
import { trpc } from "@/lib/trpc";
import { ArrowDown, BarChart3, ChevronRight, Globe2, MapPin, MousePointerClick, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SourceRecord = {
  id: number;
  source: BreezeSourceSelectorId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageRange: string;
  incomeRange: string;
  city: string;
  state: string;
  recordOrdinal: number;
};

type Tone = "orange" | "gold" | "teal";

const AFFILIATE_URL = "https://www.meetbreeze.com/disability-insurance/quotes/?tunetrackingid=102ccdb8593aef1d29660f6b36f8dc";
const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(value);

const toneClasses: Record<Tone, { border: string; text: string; bg: string; fill: string }> = {
  orange: { border: "border-[#f97316]/45", text: "text-[#fdba74]", bg: "bg-[#f97316]/10", fill: "bg-[#f97316]" },
  gold: { border: "border-[#fbbf24]/45", text: "text-[#fde68a]", bg: "bg-[#fbbf24]/10", fill: "bg-[#fbbf24]" },
  teal: { border: "border-[#14b8a6]/45", text: "text-[#99f6e4]", bg: "bg-[#14b8a6]/10", fill: "bg-[#14b8a6]" },
};

function useReveal(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, visible: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(breezeCounterValue(target, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, target, visible]);
  return value;
}

function Pill({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const item = toneClasses[tone];
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] ${item.border} ${item.bg} ${item.text}`}>{children}</span>;
}

function SourceButton({ source, active, onClick }: { source: (typeof BREEZE_SOURCE_SELECTOR)[number]; active: boolean; onClick: () => void }) {
  const item = toneClasses[source.accent];
  const sourceCode = source.id === "google-ads" ? "G" : source.id === "meta-ads" ? "M" : "EA";
  const descriptor = source.id === "exact-audience" ? "Behavior Based Data" : "Engagement records";
  return <button onClick={onClick} className={`group min-h-28 rounded-2xl border bg-black p-4 text-left transition-all duration-200 hover:-translate-y-1 active:scale-[.98] ${active ? `${item.border} shadow-[0_0_0_1px_currentColor] ${item.text}` : "border-white/15 hover:border-white/35 text-slate-200"}`}><div className="flex items-start justify-between gap-3"><span className={`grid h-9 min-w-9 place-items-center rounded-lg border text-xs font-black ${item.border} ${item.bg} ${item.text}`}>{sourceCode}</span><ChevronRight size={17} className={`transition-transform group-hover:translate-x-1 ${item.text}`} /></div><div className="mt-4 flex items-center justify-between gap-3"><span className="text-sm font-black text-white">{source.label}</span><span className={`text-sm font-black ${item.text}`}>{formatCount(source.count)}</span></div><p className="mt-1 text-xs text-slate-400">{descriptor}</p></button>;
}

function SourceRecordCard({ record, tone }: { record: SourceRecord; tone: Tone }) {
  const item = toneClasses[tone];
  const name = `${record.firstName} ${record.lastName}`.trim() || "Contact record";
  const location = [record.city, record.state].filter(Boolean).join(", ") || "Location not supplied";
  const isExactAudience = record.source === "exact-audience";
  return <article className={`relative overflow-hidden rounded-2xl border bg-black p-5 transition-transform duration-200 hover:-translate-y-1 ${item.border}`}><div className={`absolute inset-x-0 top-0 h-1 ${item.fill}`} /><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-black text-white">{name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin size={13} /> {location}</p></div><Pill tone={tone}>{isExactAudience ? "Behavior data" : "Engagement"}</Pill></div><div className={`mt-5 grid gap-3 ${isExactAudience ? "grid-cols-2" : "grid-cols-1"}`}>{isExactAudience && <div className="rounded-xl border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Age range</p><p className="mt-2 font-bold text-white">{record.ageRange || "—"}</p></div>}<div className="rounded-xl border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Income range</p><p className="mt-2 font-bold text-white">{record.incomeRange || "—"}</p></div></div><div className="mt-4 rounded-xl border border-white/10 bg-black p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Contact fields</p><p className="mt-2 truncate text-sm font-semibold text-white">{record.email || "Email not supplied"}</p><p className="mt-1 text-sm text-slate-300">{record.phone || "Phone not supplied"}</p></div></article>;
}

function ActivityStatus({ children, tone }: { children: React.ReactNode; tone: Tone | "neutral" }) {
  const style = tone === "neutral" ? "border-white/15 bg-white/5 text-slate-400" : `${toneClasses[tone].border} ${toneClasses[tone].bg} ${toneClasses[tone].text}`;
  return <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em] ${style}`}>{children}</span>;
}

function ExactAudienceActivityTable({ records, visibleCount, onLoadMore, selectedRecordId, onSelect }: { records: SourceRecord[]; visibleCount: number; onLoadMore: () => void; selectedRecordId: number | null; onSelect: (record: SourceRecord) => void }) {
  return <div className="mt-5 overflow-hidden rounded-2xl border border-[#14b8a6]/30"><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-black text-[10px] uppercase tracking-[.14em] text-[#fde68a]"><tr><th className="px-4 py-3">Exact Audience record</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Age range</th><th className="px-4 py-3 text-center">Google Ads</th><th className="px-4 py-3 text-center">Meta Ads</th><th className="px-4 py-3 text-center">Email Outreach</th></tr></thead><tbody>{records.map(record => { const activity = getExactAudienceDemoActivity(record.recordOrdinal); const name = `${record.firstName} ${record.lastName}`.trim() || "Contact record"; return <tr key={record.id} className={`border-t border-white/10 text-slate-200 ${selectedRecordId === record.id ? "bg-[#14b8a6]/10" : ""}`}><td className="px-4 py-3"><button type="button" onClick={() => onSelect(record)} className="text-left outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]"><p className="font-bold text-white">{name}</p><p className="mt-1 text-xs text-slate-400">Exact Audience · Behavior Based Data · <span className="text-[#99f6e4]">View journey</span></p></button></td><td className="px-4 py-3 text-xs">{[record.city, record.state].filter(Boolean).join(", ") || "—"}</td><td className="px-4 py-3 text-xs font-semibold text-white">{record.ageRange || "—"}</td><td className="px-4 py-3 text-center">{activity.googleAdSeen ? <ActivityStatus tone="orange">Ad seen</ActivityStatus> : <ActivityStatus tone="neutral">—</ActivityStatus>}</td><td className="px-4 py-3 text-center">{activity.metaAdSeen ? <ActivityStatus tone="gold">Ad seen</ActivityStatus> : <ActivityStatus tone="neutral">—</ActivityStatus>}</td><td className="px-4 py-3 text-center"><ActivityStatus tone={activity.emailStatus === "Clicked" ? "teal" : activity.emailStatus === "Opened" ? "gold" : activity.emailStatus === "DNO" ? "orange" : "neutral"}>{activity.emailStatus}</ActivityStatus></td></tr>; })}</tbody></table></div>{visibleCount < 2_696 && <div className="border-t border-white/10 bg-black p-4 text-center"><button onClick={onLoadMore} className="rounded-lg border border-[#14b8a6]/45 bg-[#14b8a6]/10 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-[#99f6e4] transition-transform active:scale-[.97]">Load 30 more records</button><p className="mt-2 text-xs text-slate-400">Showing {records.length} of 2,696 Exact Audience records.</p></div>}</div>;
}

function SelectedAudienceJourney({ record }: { record: SourceRecord }) {
  const name = `${record.firstName} ${record.lastName}`.trim() || "Contact record";
  const signal = buildBreezeEngagementSignal(name);
  const activity = getExactAudienceDemoActivity(record.recordOrdinal);
  const profileFields = [
    { label: "Age range", value: record.ageRange },
    { label: "Income range", value: record.incomeRange },
    { label: "Email", value: record.email },
    ...(record.phone ? [{ label: "Phone", value: record.phone }] : []),
  ].filter(field => Boolean(field.value));

  return <aside className="mt-5 rounded-2xl border border-[#14b8a6]/40 bg-black p-5 shadow-[0_18px_50px_rgba(0,0,0,.28)]"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#99f6e4]">Selected lead journey</p><h4 className="mt-1 text-2xl font-black text-white">{name}</h4><p className="mt-1 text-sm text-slate-400">{[record.city, record.state].filter(Boolean).join(", ") || "Location unavailable"}</p></div><Pill tone="teal">Exact Audience</Pill></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{profileFields.map(field => <div key={field.label} className="rounded-xl border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">{field.label}</p><p className="mt-2 break-words text-sm font-bold text-white">{field.value}</p></div>)}</div><section className="mt-5 rounded-xl border border-[#f97316]/30 bg-black p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fdba74]">Engagement sequence</p><p className="mt-1 text-xs text-slate-400">Google Ads, Meta Ads, and Email Outreach status for this Exact Audience record.</p></div><div className="flex gap-2"><ActivityStatus tone={activity.googleAdSeen ? "orange" : "neutral"}>Google {activity.googleAdSeen ? "ad seen" : "—"}</ActivityStatus><ActivityStatus tone={activity.metaAdSeen ? "gold" : "neutral"}>Meta {activity.metaAdSeen ? "ad seen" : "—"}</ActivityStatus><ActivityStatus tone={activity.emailStatus === "Clicked" ? "teal" : activity.emailStatus === "Opened" ? "gold" : activity.emailStatus === "DNO" ? "orange" : "neutral"}>Email {activity.emailStatus}</ActivityStatus></div></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-white/10 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Engagement score</p><p className="mt-2 text-xl font-black text-white">{signal.views} / 6</p></div><div className="rounded-lg border border-white/10 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">7-day window</p><p className="mt-2 text-xl font-black text-white">{signal.sevenDay}%</p></div><div className="rounded-lg border border-white/10 p-3"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">30-day window</p><p className="mt-2 text-xl font-black text-white">{signal.thirtyDay}%</p></div></div></section><section className="mt-5 rounded-xl border border-[#14b8a6]/30 bg-black p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#99f6e4]">30-day insurance research context</p><Pill tone="teal">Comparison path</Pill></div><ol className="mt-4 grid gap-3 sm:grid-cols-3">{signal.researchPath.map((step, index) => <li key={`${step.provider}-${step.topic}`} className="rounded-lg border border-white/10 p-3"><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#99f6e4]">Day {30 - index * 10}</p><p className="mt-2 text-sm font-bold text-white">{step.provider}</p><p className="mt-1 text-xs leading-5 text-slate-400">{step.topic}</p></li>)}</ol><p className="mt-3 text-xs leading-5 text-slate-400">This comparison context is separate from SiteID. No SiteID visitor event appears in individual journeys until SiteID is installed.</p></section></aside>;
}

const STAGE_VISUALS = [
  { id: "audience", value: "2,696", label: "Exact Audience list", sublabel: "Behavior Based Data", width: 100, tone: "teal" as Tone, kind: "Data" },
  { id: "responders", value: "350", label: "Google + Meta engagement", sublabel: "112 Google + 238 Meta", width: 61, tone: "orange" as Tone, kind: "Engagement" },
  { id: "email", value: "248", label: "Email outreach", sublabel: "Open, click, and response status", width: 45, tone: "gold" as Tone, kind: "Outreach" },
  { id: "website", value: "Pending", label: "Website visitors", sublabel: "SiteID installation pending", width: 28, tone: "orange" as Tone, kind: "SiteID" },
  { id: "destination", value: "Active", label: "Affiliate quote", sublabel: "Breeze quote destination", width: 100, tone: "teal" as Tone, kind: "Destination" },
];

function OperatingPathPanel() {
  const operatingDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date());
  return <section className="mt-6 rounded-2xl border border-[#14b8a6]/35 bg-black p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#99f6e4]">Current operating path</p><h3 className="mt-1 text-xl font-black text-white">Source data to customer journey</h3><p className="mt-1 text-sm leading-6 text-slate-300">Animated stages connect Exact Audience data, engagement, outreach, SiteID readiness, and the Breeze quote destination.</p></div><Pill tone="teal">Today · {operatingDate}</Pill></div><div className="breeze-funnel-flow mt-6"><span className="breeze-funnel-flow__signal" /></div><div className="mt-5 grid gap-3 md:grid-cols-5">{STAGE_VISUALS.map((stage, index) => { const item = toneClasses[stage.tone]; return <article key={stage.id} className={`breeze-stage-card rounded-xl border bg-black p-4 ${item.border}`} style={{ animationDelay: `${index * 70}ms` }}><div className="flex items-center justify-between gap-2"><span className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-black ${item.border} ${item.text}`}>{index + 1}</span><span className={`text-[9px] font-bold uppercase tracking-[.12em] ${item.text}`}>{stage.kind}</span></div><p className="mt-4 text-lg font-black text-white">{stage.value}</p><h4 className="mt-1 text-sm font-bold text-white">{stage.label}</h4><p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">{stage.sublabel}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`breeze-metric-fill h-full rounded-full ${item.fill} ${stage.id === "website" ? "breeze-metric-fill--pending" : ""}`} style={{ width: `${stage.width}%` }} /></div></article>; })}</div><div className="mt-5 grid gap-4 xl:grid-cols-[1.45fr_.8fr]"><section className="breeze-telemetry-panel rounded-xl border border-white/10 bg-black p-4"><div className="flex items-center gap-2"><BarChart3 size={16} className="text-[#99f6e4]" /><p className="text-xs font-bold text-white">Engagement telemetry</p></div><p className="mt-1 text-xs leading-5 text-slate-400">Exact Audience, channel engagement, and outreach status are shown in one operating view.</p><div className="mt-4 h-52"><ResponsiveContainer width="100%" height="100%"><BarChart data={[...BREEZE_OPERATING_TELEMETRY]} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,.14)" vertical={false} /><XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} /><Tooltip contentStyle={{ background: "#000", border: "1px solid rgba(20,184,166,.45)", borderRadius: 10, color: "#fff", fontSize: 12 }} formatter={(value: number, _name, item) => [value.toLocaleString(), item.payload.status]} /><Bar dataKey="value" radius={[6, 6, 0, 0]}>{BREEZE_OPERATING_TELEMETRY.map(item => <Cell key={item.stage} fill={item.tone} />)}</Bar></BarChart></ResponsiveContainer></div></section><section className="rounded-xl border border-white/10 bg-black p-4"><p className="text-xs font-bold text-white">Operating status</p><div className="mt-4 space-y-3">{BREEZE_STAGE_STATUS.map(item => <div key={item.label} className="rounded-lg border border-white/10 p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-white">{item.label}</p><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.tone, boxShadow: `0 0 12px ${item.tone}` }} /></div><p className="mt-2 text-xs font-semibold" style={{ color: item.tone }}>{item.status}</p><p className="mt-1 text-xs text-slate-400">{item.detail}</p></div>)}</div></section></div></section>;
}

const AUDIENCE_SIGNAL_NODES = [
  { left: "10%", top: "24%", tone: "teal", delay: "0ms" }, { left: "18%", top: "66%", tone: "gold", delay: "460ms" },
  { left: "27%", top: "34%", tone: "orange", delay: "920ms" }, { left: "39%", top: "73%", tone: "teal", delay: "250ms" },
  { left: "49%", top: "19%", tone: "gold", delay: "1300ms" }, { left: "58%", top: "54%", tone: "teal", delay: "700ms" },
  { left: "67%", top: "28%", tone: "orange", delay: "1120ms" }, { left: "76%", top: "72%", tone: "gold", delay: "360ms" },
  { left: "86%", top: "41%", tone: "teal", delay: "1560ms" }, { left: "91%", top: "16%", tone: "orange", delay: "620ms" },
] as const;

function AudienceSignalMap() {
  return <div className="breeze-audience-map mt-5 rounded-2xl border border-[#14b8a6]/25" aria-label="Exact Audience field coverage map"><div className="breeze-audience-map__grid" /><div className="breeze-audience-map__orbit breeze-audience-map__orbit--one" /><div className="breeze-audience-map__orbit breeze-audience-map__orbit--two" />{AUDIENCE_SIGNAL_NODES.map((node, index) => <span key={index} className={`breeze-audience-map__node breeze-audience-map__node--${node.tone}`} style={{ left: node.left, top: node.top, animationDelay: node.delay }} />)}<div className="absolute inset-x-5 bottom-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#99f6e4]">Audience field coverage</p><p className="mt-1 text-xs text-slate-300">Identity · location · email · mobile · age range · income range</p></div><span className="rounded-full border border-[#14b8a6]/35 bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#99f6e4]">Exact Audience</span></div></div>;
}

function ChannelDeliveryTrace() {
  const { ref, visible } = useReveal();
  const google = useCountUp(112, visible, 850);
  const meta = useCountUp(238, visible, 1080);
  const cards = [
    { label: "Google Ads", value: google, target: 112, width: "47%", tone: "orange" as Tone },
    { label: "Meta Ads", value: meta, target: 238, width: "100%", tone: "gold" as Tone },
  ];
  return <div ref={ref} className="breeze-delivery-trace mt-5 rounded-2xl border border-[#14b8a6]/30 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#99f6e4]">Channel response trace</p><p className="mt-1 text-xs text-slate-400">Engagement, not a measure of total ad delivery.</p></div><Pill tone="teal">Engagement</Pill></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{cards.map((card, index) => { const item = toneClasses[card.tone]; return <div key={card.label} className={`relative overflow-hidden rounded-xl border bg-black p-4 ${item.border}`}><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-white">{card.label}</p><p className="mt-1 text-xs text-slate-400">Engagement records</p></div><p className={`text-2xl font-black ${item.text}`}>{formatCount(card.value)}</p></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className={`breeze-response-bar h-full origin-left rounded-full ${item.fill} ${visible ? "breeze-response-bar--active" : ""}`} style={{ width: card.width, transitionDelay: `${index * 110}ms` }}><span className="breeze-response-bar__pulse" /></div></div><p className="mt-2 text-[10px] uppercase tracking-[.12em] text-slate-500">{formatCount(card.target)} tracked engagement records</p></div>; })}</div></div>;
}

function QuoteJourneyFlow() {
  const flow = [
    { label: "Audience", detail: "Exact Audience", tone: "teal" as Tone },
    { label: "Ads", detail: "Google + Meta", tone: "orange" as Tone },
    { label: "Engagement", detail: "Response signals", tone: "gold" as Tone },
    { label: "SiteID", detail: "Pending install", tone: "orange" as Tone },
    { label: "Quote", detail: "Breeze affiliate", tone: "teal" as Tone },
  ];
  return <div className="breeze-quote-flow mt-6"><div className="breeze-quote-flow__track"><span className="breeze-quote-flow__signal" /></div><ol className="grid gap-3 md:grid-cols-5">{flow.map((stage, index) => { const item = toneClasses[stage.tone]; return <li key={stage.label} className={`breeze-quote-flow__node relative rounded-2xl border bg-black p-4 ${item.border}`} style={{ animationDelay: `${index * 80}ms` }}><span className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-black ${item.border} ${item.bg} ${item.text}`}>{index + 1}</span><p className="mt-5 text-sm font-black text-white">{stage.label}</p><p className={`mt-2 text-xs font-semibold ${item.text}`}>{stage.detail}</p></li>; })}</ol></div>;
}

export function BreezeFunnelHierarchy() {
  const [activeSource, setActiveSource] = useState<BreezeSourceSelectorId>("exact-audience");
  const [visibleExactRecords, setVisibleExactRecords] = useState(30);
  const [selectedExactRecord, setSelectedExactRecord] = useState<SourceRecord | null>(null);
  const active = BREEZE_SOURCE_SELECTOR.find(source => source.id === activeSource) ?? BREEZE_SOURCE_SELECTOR[0];
  const recordsQuery = trpc.breezePortal.sourceRecords.useQuery({ source: activeSource, limit: activeSource === "exact-audience" ? visibleExactRecords : 30, offset: 0 });
  const records = (recordsQuery.data ?? []) as SourceRecord[];
  const chooseSource = (source: BreezeSourceSelectorId) => { setActiveSource(source); setSelectedExactRecord(null); if (source === "exact-audience") setVisibleExactRecords(30); };
  return <section className="mt-7 rounded-3xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.4)] sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#99f6e4]">Breeze operating funnel</p><h2 className="mt-1 text-3xl font-black text-white">Behavior-based list to affiliate quote flow</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Exact Audience data informs engagement across Google Ads, Meta Ads, and Email Outreach. SiteID becomes active after installation, and the Breeze affiliate quote destination remains available throughout.</p></div><Pill tone="teal">Affiliate quote flow</Pill></div><OperatingPathPanel /><div className="mt-7 space-y-4"><article className="rounded-3xl border border-[#14b8a6]/55 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#99f6e4]">First · Exact Audience</p><h3 className="mt-1 text-2xl font-black text-white">Behavior Based Data List</h3><p className="mt-1 text-sm text-slate-300">Exact Audience data is the starting point for Email Outreach and paid-channel engagement.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-[#14b8a6]/35 p-3 text-center"><p className="text-2xl font-black text-[#99f6e4]">2,696</p><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Records</p></div><div className="rounded-xl border border-[#14b8a6]/35 p-3 text-center"><p className="text-2xl font-black text-[#99f6e4]">2,225</p><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Email fields</p></div></div></div><div className="mt-5 grid gap-5 lg:grid-cols-[.45fr_1fr]"><div><SourceButton source={BREEZE_SOURCE_SELECTOR[2]} active={activeSource === "exact-audience"} onClick={() => chooseSource("exact-audience")} /></div><AudienceSignalMap /></div></article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#14b8a6]" size={24} /></div><article className="rounded-3xl border border-[#fbbf24]/35 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fde68a]">Second · channel activation</p><h3 className="mt-1 text-2xl font-black text-white">Google Ads and Meta Ads</h3><p className="mt-1 text-sm text-slate-300">Exact Audience data is activated across paid channels to create an engagement view.</p></div><div className="flex items-center gap-2"><MousePointerClick className="text-[#14b8a6]" size={20} /><Pill tone="teal">Engagement</Pill></div></div><div className="mt-5 grid gap-3 md:grid-cols-2">{BREEZE_SOURCE_SELECTOR.filter(source => source.id !== "exact-audience").map(source => <SourceButton key={source.id} source={source} active={activeSource === source.id} onClick={() => chooseSource(source.id)} />)}</div><ChannelDeliveryTrace /></article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#fbbf24]" size={24} /></div><article className="rounded-3xl border border-[#f97316]/35 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fdba74]">Third · engagement</p><h3 className="mt-1 text-2xl font-black text-white">Engagement</h3><p className="mt-1 text-sm text-slate-300">Engagement, not a measure of total ad delivery.</p></div><UserRound className="text-[#14b8a6]" size={24} /></div>{recordsQuery.isLoading ? <p className="py-10 text-center text-sm text-slate-400">Loading engagement records…</p> : records.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No engagement records are currently available.</p> : activeSource === "exact-audience" ? <><ExactAudienceActivityTable records={records} visibleCount={visibleExactRecords} onLoadMore={() => setVisibleExactRecords(current => Math.min(current + 30, 2_696))} selectedRecordId={selectedExactRecord?.id ?? null} onSelect={setSelectedExactRecord} />{selectedExactRecord && <SelectedAudienceJourney record={selectedExactRecord} />}</> : <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{records.map(record => <SourceRecordCard key={record.id} record={record} tone={active.accent} />)}</div>}</article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#f97316]" size={24} /></div><article className="rounded-3xl border border-[#f97316]/35 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fdba74]">Fourth · SiteID readiness</p><h3 className="mt-1 text-2xl font-black text-white">Website visitor categories</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">SiteID Pending Installation. This layer activates the visitor categories below after installation.</p></div><div className="flex items-center gap-2"><Globe2 className="text-[#14b8a6]" size={20} /><Pill tone="teal">SiteID Pending Installation</Pill></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{BREEZE_SITEID_FIELD_GROUPS.map(group => <div key={group.label} className="rounded-2xl border border-white/10 p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#99f6e4]">{group.label}</p><p className="mt-3 text-xs leading-6 text-slate-400">{group.fields.join(" · ")}</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#14b8a6]">Activates with SiteID</p></div>)}</div></article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#14b8a6]" size={24} /></div><article className="rounded-3xl border border-[#14b8a6]/40 bg-[radial-gradient(circle_at_8%_10%,rgba(249,115,22,.12),transparent_28%),radial-gradient(circle_at_92%_90%,rgba(20,184,166,.14),transparent_32%),#000] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#99f6e4]">Fifth · destination and journey</p><h3 className="mt-1 text-2xl font-black text-white">Breeze affiliate quote flow</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">A live operating path from audience through engagement to the Breeze quote destination.</p></div><a href={AFFILIATE_URL} target="_blank" rel="noreferrer" className="rounded-xl border border-[#14b8a6]/55 bg-[#14b8a6]/10 px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-[#99f6e4] transition-transform hover:-translate-y-0.5 active:scale-[.97]">Open affiliate quote</a></div><QuoteJourneyFlow /><ol className="sr-only">{BREEZE_JOURNEY_STAGES.map(stage => <li key={stage}>{stage}</li>)}</ol></article></div></section>;
}
