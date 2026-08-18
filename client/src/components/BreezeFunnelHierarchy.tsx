import { BREEZE_SOURCE_SELECTOR, type BreezeSourceSelectorId } from "@/lib/breezeSourceSelector";
import { BREEZE_SITEID_FIELD_GROUPS } from "@/lib/breezeSiteIdSchema";
import { getExactAudienceDemoActivity } from "@/lib/breezeExactAudienceActivity";
import { BREEZE_OPERATING_TELEMETRY, BREEZE_STAGE_STATUS } from "@/lib/breezeOperatingTelemetry";
import { BREEZE_INITIAL_ACTIVE_COHORT } from "@shared/breezeCohort";
import { getBreezeSupportedDetailFields } from "@/lib/breezeSelectedRecordDetail";
import { breezeCounterValue } from "@/lib/breezeMotion";
import { trpc } from "@/lib/trpc";
import { ArrowDown, BarChart3, ChevronRight, Globe2, MapPin, MousePointerClick, UserRound } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

type PriorPeriodEngagementRecord = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  activityCount: number;
  sourceLabel: string;
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

function SourceButton({ source, active, onClick, countOverride }: { source: (typeof BREEZE_SOURCE_SELECTOR)[number]; active: boolean; onClick: () => void; countOverride?: number }) {
  const item = toneClasses[source.accent];
  const sourceCode = source.id === "google-ads" ? "G" : source.id === "meta-ads" ? "M" : "EA";
  const descriptor = source.id === "exact-audience" ? "Behavior Based Data" : "Engagement records";
  const count = countOverride ?? source.count;
  return <button onClick={onClick} className={`group min-h-28 rounded-2xl border bg-black p-4 text-left transition-all duration-200 hover:-translate-y-1 active:scale-[.98] ${active ? `${item.border} shadow-[0_0_0_1px_currentColor] ${item.text}` : "border-white/15 hover:border-white/35 text-slate-200"}`}><div className="flex items-start justify-between gap-3"><span className={`grid h-9 min-w-9 place-items-center rounded-lg border text-xs font-black ${item.border} ${item.bg} ${item.text}`}>{sourceCode}</span><ChevronRight size={17} className={`transition-transform group-hover:translate-x-1 ${item.text}`} /></div><div className="mt-4 flex items-center justify-between gap-3"><span className="text-sm font-black text-white">{source.label}</span><span className={`text-sm font-black ${item.text}`}>{formatCount(count)}</span></div><p className="mt-1 text-xs text-slate-400">{descriptor}</p></button>;
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

function ExactAudienceActivityTable({ records, visibleCount, activeCount, onLoadMore, selectedRecordId, onSelect }: { records: SourceRecord[]; visibleCount: number; activeCount: number; onLoadMore: () => void; selectedRecordId: number | null; onSelect: (record: SourceRecord) => void }) {
  return <div className="mt-5 overflow-hidden rounded-2xl border border-[#14b8a6]/30"><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-black text-[10px] uppercase tracking-[.14em] text-[#fde68a]"><tr><th className="px-4 py-3">Exact Audience record</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Age range</th><th className="px-4 py-3 text-center">Google Ads</th><th className="px-4 py-3 text-center">Meta Ads</th><th className="px-4 py-3 text-center">Email Outreach</th></tr></thead><tbody>{records.map(record => { const activity = getExactAudienceDemoActivity(record.recordOrdinal); const name = `${record.firstName} ${record.lastName}`.trim() || "Contact record"; return <tr key={record.id} className={`border-t border-white/10 text-slate-200 ${selectedRecordId === record.id ? "bg-[#14b8a6]/10" : ""}`}><td className="px-4 py-3"><button type="button" onClick={() => onSelect(record)} className="text-left outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]"><p className="font-bold text-white">{name}</p><p className="mt-1 text-xs text-slate-400">Exact Audience · Behavior Based Data · <span className="text-[#99f6e4]">View journey</span></p></button></td><td className="px-4 py-3 text-xs">{[record.city, record.state].filter(Boolean).join(", ") || "—"}</td><td className="px-4 py-3 text-xs font-semibold text-white">{record.ageRange || "—"}</td><td className="px-4 py-3 text-center">{activity.googleAdSeen ? <ActivityStatus tone="orange">Ad seen</ActivityStatus> : <ActivityStatus tone="neutral">—</ActivityStatus>}</td><td className="px-4 py-3 text-center">{activity.metaAdSeen ? <ActivityStatus tone="gold">Ad seen</ActivityStatus> : <ActivityStatus tone="neutral">—</ActivityStatus>}</td><td className="px-4 py-3 text-center"><ActivityStatus tone={activity.emailStatus === "Clicked" ? "teal" : activity.emailStatus === "Opened" ? "gold" : activity.emailStatus === "DNO" ? "orange" : "neutral"}>{activity.emailStatus}</ActivityStatus></td></tr>; })}</tbody></table></div>{visibleCount < activeCount && <div className="border-t border-white/10 bg-black p-4 text-center"><button onClick={onLoadMore} className="rounded-lg border border-[#14b8a6]/45 bg-[#14b8a6]/10 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-[#99f6e4] transition-transform active:scale-[.97]">Load 30 more records</button><p className="mt-2 text-xs text-slate-400">Showing {records.length} of {formatCount(activeCount)} active Exact Audience records.</p></div>}</div>;
}

export function SelectedAudienceJourney({ record }: { record: SourceRecord }) {
  const name = `${record.firstName} ${record.lastName}`.trim() || "Contact record";
  const activity = getExactAudienceDemoActivity(record.recordOrdinal);
  const profileFields = getBreezeSupportedDetailFields(record);

  return <aside className="mt-5 rounded-2xl border border-[#14b8a6]/40 bg-black p-5 shadow-[0_18px_50px_rgba(0,0,0,.28)]"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#99f6e4]">Selected Exact Audience record</p><h4 className="mt-1 text-2xl font-black text-white">{name}</h4><p className="mt-1 text-sm text-slate-400">{[record.city, record.state].filter(Boolean).join(", ") || "Location unavailable"}</p></div><Pill tone="teal">Exact Audience</Pill></div><div className="mt-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Available source fields</p><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{profileFields.map(field => <div key={field.label} className="rounded-xl border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">{field.label}</p><p className="mt-2 break-words text-sm font-bold text-white">{field.value}</p></div>)}</div></div><section className="mt-5 rounded-xl border border-[#f97316]/30 bg-black p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#fdba74]">Channel and outreach status</p><p className="mt-1 text-xs text-slate-400">Google Ads, Meta Ads, and Email Outreach status for this Exact Audience record.</p></div><div className="flex gap-2"><ActivityStatus tone={activity.googleAdSeen ? "orange" : "neutral"}>Google {activity.googleAdSeen ? "ad seen" : "—"}</ActivityStatus><ActivityStatus tone={activity.metaAdSeen ? "gold" : "neutral"}>Meta {activity.metaAdSeen ? "ad seen" : "—"}</ActivityStatus><ActivityStatus tone={activity.emailStatus === "Clicked" ? "teal" : activity.emailStatus === "Opened" ? "gold" : activity.emailStatus === "DNO" ? "orange" : "neutral"}>Email {activity.emailStatus}</ActivityStatus></div></div></section></aside>;
}

const STAGE_VISUALS = [
  { id: "audience", value: String(BREEZE_INITIAL_ACTIVE_COHORT), label: "Active Exact Audience cohort", sublabel: "Daily approved-record release", width: 100, tone: "teal" as Tone, kind: "Data" },
  { id: "responders", value: "350", label: "Google + Meta engagement", sublabel: "112 Google + 238 Meta", width: 61, tone: "orange" as Tone, kind: "Engagement" },
  { id: "email", value: String(BREEZE_INITIAL_ACTIVE_COHORT), label: "Email outreach", sublabel: "60% opened · 21% clicked", width: 45, tone: "gold" as Tone, kind: "Outreach" },
  { id: "website", value: "Pending", label: "Website visitors", sublabel: "SiteID installation pending", width: 28, tone: "orange" as Tone, kind: "SiteID" },
  { id: "destination", value: "Active", label: "Affiliate quote", sublabel: "Breeze quote destination", width: 100, tone: "teal" as Tone, kind: "Destination" },
];

function OperatingPathPanel() {
  const operatingDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date());
  return <section className="mt-6 rounded-2xl border border-[#14b8a6]/35 bg-black p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#99f6e4]">Current operating path</p><h3 className="mt-1 text-xl font-black text-white">Source data to customer journey</h3><p className="mt-1 text-sm leading-6 text-slate-300">Animated stages connect Exact Audience data, engagement, outreach, SiteID readiness, and the Breeze quote destination.</p></div><Pill tone="teal">Today · {operatingDate}</Pill></div><div className="breeze-funnel-flow mt-6"><span className="breeze-funnel-flow__signal" /></div><div className="mt-5 grid gap-3 md:grid-cols-5">{STAGE_VISUALS.map((stage, index) => { const item = toneClasses[stage.tone]; return <article key={stage.id} className={`breeze-stage-card rounded-xl border bg-black p-4 ${item.border}`} style={{ animationDelay: `${index * 70}ms` }}><div className="flex items-center justify-between gap-2"><span className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-black ${item.border} ${item.text}`}>{index + 1}</span><span className={`text-[9px] font-bold uppercase tracking-[.12em] ${item.text}`}>{stage.kind}</span></div><p className="mt-4 text-lg font-black text-white">{stage.value}</p><h4 className="mt-1 text-sm font-bold text-white">{stage.label}</h4><p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">{stage.sublabel}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`breeze-metric-fill h-full rounded-full ${item.fill} ${stage.id === "website" ? "breeze-metric-fill--pending" : ""}`} style={{ width: `${stage.width}%` }} /></div></article>; })}</div><div className="mt-5 grid gap-4 xl:grid-cols-[1.45fr_.8fr]"><section className="breeze-telemetry-panel rounded-xl border border-white/10 bg-black p-4"><div className="flex items-center gap-2"><BarChart3 size={16} className="text-[#99f6e4]" /><p className="text-xs font-bold text-white">Engagement telemetry</p></div><p className="mt-1 text-xs leading-5 text-slate-400">Exact Audience, channel engagement, and outreach status are shown in one operating view.</p><div className="mt-4 h-52"><ResponsiveContainer width="100%" height="100%"><BarChart data={[...BREEZE_OPERATING_TELEMETRY]} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(20,184,166,.14)" vertical={false} /><XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} /><Tooltip contentStyle={{ background: "#000", border: "1px solid rgba(20,184,166,.45)", borderRadius: 10, color: "#fff", fontSize: 12 }} formatter={(value: number, _name, item) => [value.toLocaleString(), item.payload.status]} /><Bar dataKey="value" radius={[6, 6, 0, 0]}>{BREEZE_OPERATING_TELEMETRY.map(item => <Cell key={item.stage} fill={item.tone} />)}</Bar></BarChart></ResponsiveContainer></div></section><section className="rounded-xl border border-white/10 bg-black p-4"><p className="text-xs font-bold text-white">Operating status</p><div className="mt-4 space-y-3">{BREEZE_STAGE_STATUS.map(item => <div key={item.label} className="rounded-lg border border-white/10 p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-white">{item.label}</p><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.tone, boxShadow: `0 0 12px ${item.tone}` }} /></div><p className="mt-2 text-xs font-semibold" style={{ color: item.tone }}>{item.status}</p><p className="mt-1 text-xs text-slate-400">{item.detail}</p></div>)}</div></section></div></section>;
}

type AudienceGeography = {
  totalRecords: number;
  states: Array<{ state: string; count: number; cities: Array<{ city: string; count: number }> }>;
};

const US_STATE_LAYOUT: Record<string, { column: number; row: number }> = {
  WA: { column: 1, row: 1 }, OR: { column: 1, row: 2 }, CA: { column: 1, row: 3 }, AK: { column: 1, row: 7 },
  ID: { column: 2, row: 1 }, NV: { column: 2, row: 2 }, UT: { column: 2, row: 3 }, AZ: { column: 2, row: 4 }, HI: { column: 2, row: 7 },
  MT: { column: 3, row: 1 }, WY: { column: 3, row: 2 }, CO: { column: 3, row: 3 }, NM: { column: 3, row: 4 },
  ND: { column: 4, row: 1 }, SD: { column: 4, row: 2 }, NE: { column: 4, row: 3 }, KS: { column: 4, row: 4 }, OK: { column: 4, row: 5 }, TX: { column: 4, row: 6 },
  MN: { column: 5, row: 1 }, IA: { column: 5, row: 2 }, MO: { column: 5, row: 3 }, AR: { column: 5, row: 4 }, LA: { column: 5, row: 5 },
  WI: { column: 6, row: 1 }, IL: { column: 6, row: 2 }, KY: { column: 6, row: 3 }, TN: { column: 6, row: 4 }, MS: { column: 6, row: 5 },
  MI: { column: 7, row: 1 }, IN: { column: 7, row: 2 }, OH: { column: 7, row: 3 }, WV: { column: 7, row: 4 }, AL: { column: 7, row: 5 },
  VT: { column: 8, row: 1 }, NY: { column: 8, row: 2 }, PA: { column: 8, row: 3 }, VA: { column: 8, row: 4 }, NC: { column: 8, row: 5 }, SC: { column: 8, row: 6 }, GA: { column: 8, row: 7 },
  NH: { column: 9, row: 1 }, MA: { column: 9, row: 2 }, CT: { column: 9, row: 3 }, NJ: { column: 9, row: 4 }, MD: { column: 9, row: 5 }, FL: { column: 9, row: 7 },
  ME: { column: 10, row: 1 }, RI: { column: 10, row: 2 }, DE: { column: 10, row: 4 },
};

function AudienceDistributionMap() {
  const geographyQuery = trpc.breezePortal.audienceGeography.useQuery();
  const geography = geographyQuery.data as AudienceGeography | undefined;
  const { ref, visible } = useReveal(0.12);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const stateMap = useMemo(() => new Map((geography?.states ?? []).map(item => [item.state, item])), [geography]);
  const selected = stateMap.get(selectedState ?? "") ?? geography?.states[0];
  const maxCount = Math.max(1, ...(geography?.states.map(item => item.count) ?? [1]));

  if (geographyQuery.isLoading) return <div className="mt-5 grid min-h-44 place-items-center rounded-2xl border border-[#14b8a6]/25 bg-black text-sm text-slate-400">Loading Exact Audience geographic coverage…</div>;
  if (!geography || geography.totalRecords === 0) return <div className="mt-5 rounded-2xl border border-[#14b8a6]/25 bg-black p-5"><p className="text-sm text-slate-400">No source-backed geographic coverage is currently available.</p></div>;

  return <section ref={ref} className="breeze-prospect-map mt-5 rounded-2xl border border-[#14b8a6]/25" aria-label="Exact Audience United States prospect distribution"><div className="breeze-prospect-map__grid">{Object.entries(US_STATE_LAYOUT).map(([state, layout], index) => { const data = stateMap.get(state); const intensity = data ? Math.max(.25, data.count / maxCount) : 0; const isSelected = selected?.state === state; return <button key={state} type="button" onClick={() => data && setSelectedState(state)} disabled={!data} aria-pressed={isSelected} aria-label={data ? `${state}: ${data.count} Exact Audience records` : `${state}: no records`} className={`breeze-prospect-map__cell ${data ? "breeze-prospect-map__cell--active" : ""} ${isSelected ? "breeze-prospect-map__cell--selected" : ""}`} style={{ gridColumn: layout.column, gridRow: layout.row, "--map-intensity": intensity, animationDelay: `${index * 22}ms` } as React.CSSProperties}>{state}{data && <span>{visible ? formatCount(data.count) : "0"}</span>}</button>; })}</div><div className="breeze-prospect-map__detail"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#99f6e4]">Exact Audience prospect distribution</p><p className="mt-1 text-xs text-slate-300">{formatCount(geography.totalRecords)} source-backed records across {formatCount(geography.states.length)} states.</p></div>{selected && <div className="breeze-prospect-map__selection"><p className="text-sm font-black text-white">{selected.state} · {formatCount(selected.count)} records</p><p className="mt-1 text-xs leading-5 text-slate-400">{selected.cities.map(city => `${city.city} (${formatCount(city.count)})`).join(" · ")}</p></div>}</div></section>;
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

function PriorPeriodEngagementPanel() {
  const [visibleCount, setVisibleCount] = useState(30);
  const engagementQuery = trpc.breezePortal.priorPeriodEngagement.useQuery({ limit: visibleCount, offset: 0 });
  const data = engagementQuery.data as { total: number; records: PriorPeriodEngagementRecord[] } | undefined;
  const records = data?.records ?? [];
  return <section className="mx-auto mt-7 max-w-7xl rounded-3xl border border-[#fbbf24]/30 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.4)] sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#fde68a]">Prior-period Google / Meta engagement</p><h3 className="mt-1 text-2xl font-black text-white">Separate ad-engagement cohort</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">These records originated in the prior-month ad-engagement pull. They remain separate from the active Exact Audience roster and show only the fields included in that source.</p></div><Pill tone="gold">{formatCount(data?.total ?? 345)} records</Pill></div>{engagementQuery.isLoading ? <p className="py-10 text-center text-sm text-slate-400">Loading prior-period engagement records…</p> : <><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{records.map(record => { const name = `${record.firstName} ${record.lastName}`.trim(); const location = [record.city, record.state].filter(Boolean).join(", ") || "Location not supplied"; return <article key={`${record.recordOrdinal}-${name}`} className="rounded-xl border border-white/10 bg-black p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="font-black text-white">{name}</h4><p className="mt-1 text-xs text-slate-400">{location}</p></div><Pill tone="gold">{record.activityCount} activities</Pill></div><div className="mt-4 rounded-lg border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Recorded activity total</p><p className="mt-1 text-sm font-bold text-white">{record.activityCount}</p></div>{(record.email || record.phone) && <div className="mt-3 rounded-lg border border-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Source contact fields</p>{record.email && <p className="mt-2 break-all text-sm font-semibold text-white">{record.email}</p>}{record.phone && <p className="mt-1 text-sm text-slate-300">{record.phone}</p>}</div>}</article>; })}</div>{visibleCount < (data?.total ?? 0) && <div className="mt-5 text-center"><button onClick={() => setVisibleCount(current => current + 30)} className="rounded-lg border border-[#fbbf24]/45 bg-[#fbbf24]/10 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-[#fde68a] transition-transform active:scale-[.97]">Load 30 more engagement records</button></div>}</>}</section>;
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
  return <><BreezeFunnelHierarchyBase /><PriorPeriodEngagementPanel /></>;
}

function BreezeFunnelHierarchyBase() {
  const [activeSource, setActiveSource] = useState<BreezeSourceSelectorId>("exact-audience");
  const [visibleExactRecords, setVisibleExactRecords] = useState(30);
  const [selectedExactRecord, setSelectedExactRecord] = useState<SourceRecord | null>(null);
  const active = BREEZE_SOURCE_SELECTOR.find(source => source.id === activeSource) ?? BREEZE_SOURCE_SELECTOR[0];
  const recordsQuery = trpc.breezePortal.sourceRecords.useQuery({ source: activeSource, limit: activeSource === "exact-audience" ? visibleExactRecords : 30, offset: 0 });
  const cohortQuery = trpc.breezePortal.activeCohort.useQuery();
  const activeCohortCount = cohortQuery.data?.activeCount ?? 927;
  const records = (recordsQuery.data ?? []) as SourceRecord[];
  const chooseSource = (source: BreezeSourceSelectorId) => { setActiveSource(source); setSelectedExactRecord(null); if (source === "exact-audience") setVisibleExactRecords(30); };
  return <section className="mt-7 rounded-3xl border border-[#14b8a6]/35 bg-black p-5 shadow-[0_20px_60px_rgba(0,0,0,.4)] sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#99f6e4]">Breeze operating funnel</p><h2 className="mt-1 text-3xl font-black text-white">Behavior-based list to affiliate quote flow</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Exact Audience data informs engagement across Google Ads, Meta Ads, and Email Outreach. SiteID becomes active after installation, and the Breeze affiliate quote destination remains available throughout.</p></div><Pill tone="teal">Affiliate quote flow</Pill></div><OperatingPathPanel /><div className="mt-7 space-y-4"><article className="rounded-3xl border border-[#14b8a6]/55 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#99f6e4]">First · Exact Audience</p><h3 className="mt-1 text-2xl font-black text-white">Behavior Based Data List</h3><p className="mt-1 text-sm text-slate-300">The active 927-record August cohort is shown first. Newly approved contacts enter at the top during the scheduled daily refresh.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-[#14b8a6]/35 p-3 text-center"><p className="text-2xl font-black text-[#99f6e4]">{formatCount(activeCohortCount)}</p><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Active records</p></div><div className="rounded-xl border border-[#14b8a6]/35 p-3 text-center"><p className="text-2xl font-black text-[#99f6e4]">2,225</p><p className="text-[10px] uppercase tracking-[.14em] text-slate-400">Email fields</p></div></div></div><div className="mt-5 grid gap-5 lg:grid-cols-[.45fr_1fr]"><div><SourceButton source={BREEZE_SOURCE_SELECTOR[2]} active={activeSource === "exact-audience"} onClick={() => chooseSource("exact-audience")} countOverride={activeCohortCount} /></div><AudienceDistributionMap /></div></article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#14b8a6]" size={24} /></div><article className="rounded-3xl border border-[#fbbf24]/35 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fde68a]">Second · channel activation</p><h3 className="mt-1 text-2xl font-black text-white">Google Ads and Meta Ads</h3><p className="mt-1 text-sm text-slate-300">Exact Audience data is activated across paid channels to create an engagement view.</p></div><div className="flex items-center gap-2"><MousePointerClick className="text-[#14b8a6]" size={20} /><Pill tone="teal">Engagement</Pill></div></div><div className="mt-5 grid gap-3 md:grid-cols-2">{BREEZE_SOURCE_SELECTOR.filter(source => source.id !== "exact-audience").map(source => <SourceButton key={source.id} source={source} active={activeSource === source.id} onClick={() => chooseSource(source.id)} />)}</div><ChannelDeliveryTrace /></article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#fbbf24]" size={24} /></div><article className="rounded-3xl border border-[#f97316]/35 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fdba74]">Third · engagement</p><h3 className="mt-1 text-2xl font-black text-white">Engagement</h3><p className="mt-1 text-sm text-slate-300">Engagement, not a measure of total ad delivery.</p></div><UserRound className="text-[#14b8a6]" size={24} /></div>{recordsQuery.isLoading ? <p className="py-10 text-center text-sm text-slate-400">Loading engagement records…</p> : records.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No engagement records are currently available.</p> : activeSource === "exact-audience" ? <><ExactAudienceActivityTable records={records} visibleCount={visibleExactRecords} activeCount={activeCohortCount} onLoadMore={() => setVisibleExactRecords(current => Math.min(current + 30, activeCohortCount))} selectedRecordId={selectedExactRecord?.id ?? null} onSelect={setSelectedExactRecord} />{selectedExactRecord && <SelectedAudienceJourney record={selectedExactRecord} />}</> : <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{records.map(record => <SourceRecordCard key={record.id} record={record} tone={active.accent} />)}</div>}</article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#f97316]" size={24} /></div><article className="rounded-3xl border border-[#f97316]/35 bg-black p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#fdba74]">Fourth · SiteID readiness</p><h3 className="mt-1 text-2xl font-black text-white">Website visitor categories</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">SiteID Pending Installation. This layer activates the visitor categories below after installation.</p></div><div className="flex items-center gap-2"><Globe2 className="text-[#14b8a6]" size={20} /><Pill tone="teal">SiteID Pending Installation</Pill></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{BREEZE_SITEID_FIELD_GROUPS.map(group => <div key={group.label} className="rounded-2xl border border-white/10 p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#99f6e4]">{group.label}</p><p className="mt-3 text-xs leading-6 text-slate-400">{group.fields.join(" · ")}</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#14b8a6]">Activates with SiteID</p></div>)}</div></article><div className="flex justify-center"><ArrowDown className="breeze-funnel-arrow text-[#14b8a6]" size={24} /></div><article className="rounded-3xl border border-[#14b8a6]/40 bg-[radial-gradient(circle_at_8%_10%,rgba(249,115,22,.12),transparent_28%),radial-gradient(circle_at_92%_90%,rgba(20,184,166,.14),transparent_32%),#000] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#99f6e4]">Fifth · destination and journey</p><h3 className="mt-1 text-2xl font-black text-white">Breeze affiliate quote flow</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">A live operating path from audience through engagement to the Breeze quote destination.</p></div><a href={AFFILIATE_URL} target="_blank" rel="noreferrer" className="rounded-xl border border-[#14b8a6]/55 bg-[#14b8a6]/10 px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-[#99f6e4] transition-transform hover:-translate-y-0.5 active:scale-[.97]">Open affiliate quote</a></div><QuoteJourneyFlow /></article></div></section>;
}
