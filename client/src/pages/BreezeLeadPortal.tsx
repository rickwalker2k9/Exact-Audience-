import { trpc } from "@/lib/trpc";
import {
  BREEZE_DESTINATIONS,
  BREEZE_DESTINATION_DAILY_TRAFFIC,
  type BreezeDestinationKey,
} from "@/lib/breezeTrafficDemo";
import { buildBreezeDemoSignal } from "@/lib/breezeLeadSignals";
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

type OwnerReviewLead = {
  name: string;
  location: string;
  ageRange: string;
  emailProvider: string;
  stage: string;
  lastKnownActivity: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function Pill({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "violet" | "amber" | "slate" | "emerald" }) {
  const className = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
    amber: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    slate: "border-slate-300/25 bg-slate-300/10 text-slate-200",
    emerald: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] ${className}`}>{children}</span>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="rounded-xl border border-white/10 bg-[#07131d] p-4">
    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-black text-white">{value}</p>
    <p className="mt-2 text-xs leading-5 text-slate-400">{note}</p>
  </article>;
}

function DailyTrafficChart({ destination }: { destination: BreezeDestinationKey }) {
  const points = BREEZE_DESTINATION_DAILY_TRAFFIC[destination];
  const max = Math.max(...points.map(point => point.hits), 1);
  const accent = destination === "affiliate" ? "from-cyan-500 to-cyan-200" : "from-violet-500 to-violet-200";
  return <section className="rounded-2xl border border-white/10 bg-[#0b1b27] p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.17em] text-cyan-200">Daily traffic · illustrative demo data</p>
        <h3 className="mt-1 text-xl font-black text-white">Traffic going to this link</h3>
      </div>
      <Pill tone="amber">Demo only</Pill>
    </div>
    <div className="mt-6 flex h-48 items-end gap-1.5 border-b border-white/10 pb-5">
      {points.map(point => <div key={point.day} className="group flex min-w-0 flex-1 flex-col justify-end">
        <div className={`relative rounded-t-md bg-gradient-to-t ${accent}`} style={{ height: `${Math.max(2, (point.hits / max) * 100)}%` }}>
          <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#061018] px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block">{formatCount(point.hits)} hits</span>
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
  return <aside className="rounded-2xl border border-cyan-300/25 bg-[#0b1b27] p-5 shadow-[0_20px_60px_rgba(0,0,0,.25)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Pill tone="violet"><UserRound size={12} /> Lead detail</Pill>
        <h3 className="mt-3 text-2xl font-black text-white">{lead.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-300"><MapPin size={14} /> {lead.location}</p>
      </div>
      <Pill tone="amber">Demo journey</Pill>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <Metric label="Age range" value={lead.ageRange || "Not supplied"} note="Approved-sheet field when available." />
      <Metric label="Income level" value="Not supplied" note="No income field has been connected." />
      <Metric label="Email service" value={lead.emailProvider || "Unavailable"} note="Approved-sheet profile field." />
      <Metric label="Phone" value="Not supplied" note="No phone number is connected in this view." />
    </div>

    <section className="mt-5 rounded-xl border border-white/10 bg-[#07131d] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-200">Ad engagement journey · illustrative demo</p>
      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: 6 }).map((_, index) => <span key={index} className={`h-3 flex-1 rounded-full ${index < signal.views ? "bg-cyan-300" : "bg-white/10"}`} />)}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">Seen {signal.views} ad{signal.views === 1 ? "" : "s"} across {signal.channels.join(", ")}. Demo website engagement begins after exposure {signal.engagedAfter}; live ad and website events are not connected yet.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Likely in 7 days" value={`${signal.sevenDay}%`} note="Ad-seen engagement signal." />
        <Metric label="Likely in 30 days" value={`${signal.thirtyDay}%`} note="Ad-seen engagement signal." />
      </div>
    </section>

    <section className="mt-5 rounded-xl border border-white/10 bg-[#07131d] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-200">Customer journey</p>
      <ol className="mt-4 space-y-3 text-sm">
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300" /><div><strong className="text-white">Approved lead record</strong><p className="text-slate-400">Included in the approved spreadsheet review set.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" /><div><strong className="text-white">Ad-exposure sequence</strong><p className="text-slate-400">Illustrative Google, Meta, and YouTube engagement sequence.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-300" /><div><strong className="text-white">Destination: {destinationTitle}</strong><p className="text-slate-400">Destination-specific link routing is shown in this view.</p></div></li>
        <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-500" /><div><strong className="text-white">Form-fill workflow</strong><p className="text-slate-400">Unique email, unique phone, consent questions, and submission are staged pending workflow activation.</p></div></li>
      </ol>
    </section>

    <section className="mt-5 rounded-xl border border-white/10 bg-[#07131d] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-200">Media mix</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">Google Ads, Meta, and YouTube pre-roll are represented in the illustrative journey. Live media allocation and delivery data are not connected.</p>
    </section>
  </aside>;
}

function LeadTable({ leads, destination }: { leads: OwnerReviewLead[]; destination: BreezeDestinationKey }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<OwnerReviewLead | null>(null);
  const filtered = useMemo(() => leads.filter(lead => `${lead.name} ${lead.location}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100), [leads, query]);
  return <section className="mt-6 rounded-2xl border border-white/10 bg-[#0b1b27] p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.17em] text-cyan-200">Leads sent to this link</p>
        <h2 className="mt-1 text-2xl font-black text-white">Approved lead roster</h2>
        <p className="mt-2 text-sm text-slate-400">Select a name to see profile data, ad-seen engagement, likelihood windows, and the staged form-fill workflow.</p>
      </div>
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name or location" className="w-full rounded-lg border border-white/15 bg-[#07131d] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 sm:w-64" />
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.82fr]">
      <div className="overflow-hidden rounded-xl border border-white/10"><div className="max-h-[37rem] overflow-auto"><table className="w-full min-w-[690px] text-left text-sm"><thead className="sticky top-0 bg-[#0d2330] text-[10px] uppercase tracking-[.14em] text-slate-400"><tr><th className="px-4 py-3">Lead</th><th className="px-4 py-3">Age range</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Stage</th></tr></thead><tbody>{filtered.map((lead, index) => <tr key={`${lead.name}-${index}`} onClick={() => setSelected(lead)} className={`cursor-pointer border-t border-white/[.07] text-slate-200 transition-colors hover:bg-cyan-300/5 ${selected?.name === lead.name ? "bg-cyan-300/10" : ""}`}><td className="px-4 py-3 font-semibold">{lead.name}</td><td className="px-4 py-3">{lead.ageRange || "Not supplied"}</td><td className="px-4 py-3">{lead.location}</td><td className="px-4 py-3 capitalize">{lead.stage.replace("-", " ")}</td></tr>)}</tbody></table></div>{filtered.length === 0 && <p className="p-5 text-sm text-slate-400">No approved leads match this search.</p>}</div>
      {selected ? <LeadJourney lead={selected} destination={destination} /> : <div className="grid min-h-72 place-items-center rounded-xl border border-dashed border-white/15 bg-[#07131d] p-6 text-center"><div><Target className="mx-auto text-cyan-300" size={26} /><h3 className="mt-3 font-bold text-white">Select a lead</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">Click a row to open the engagement journey, 7-day and 30-day likelihood, and staged form-fill view.</p></div></div>}</div>
  </section>;
}

function DestinationPage({ destination, leads, onBack }: { destination: BreezeDestinationKey; leads: OwnerReviewLead[]; onBack: () => void }) {
  const config = BREEZE_DESTINATIONS[destination];
  const currentLeadCount = destination === "affiliate" ? leads.length : 0;
  return <main className="min-h-screen bg-[#061018] text-slate-100">
    <header className="border-b border-cyan-300/15 bg-[#07131d]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 hover:text-white"><ArrowLeft size={17} /> All destinations</button><span className="text-lg font-black text-white">Breeze</span><Pill tone={destination === "affiliate" ? "cyan" : "violet"}>Destination detail</Pill></div></header>
    <div className="mx-auto max-w-7xl px-5 py-9">
      <div className="flex flex-wrap items-start justify-between gap-5"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-200">{config.eyebrow}</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-white">{config.title}</h1><p className="mt-3 text-base leading-7 text-slate-300">{config.description}</p></div>{config.destinationUrl ? <a href={config.destinationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#061018]">Open affiliate link <ExternalLink size={16} /></a> : <Pill tone="slate">No July–August routing</Pill>}</div>
      <div className="mt-7 grid gap-4 md:grid-cols-3"><Metric label="Traffic period" value={config.activePeriod} note="Illustrative traffic review." /><Metric label="Leads routed" value={formatCount(currentLeadCount)} note={destination === "affiliate" ? "Current approved roster shown below." : "No historical lead attribution connected."} /><Metric label="Opt-ins" value="Not connected" note="Connect form events to report actual opt-ins." /></div>
      <div className="mt-6"><DailyTrafficChart destination={destination} /></div>
      {destination === "calculator" ? <section className="mt-6 rounded-2xl border border-violet-300/20 bg-violet-300/5 p-6 text-sm leading-7 text-violet-50"><strong>Income Protection Tool historical view.</strong> This route has illustrative May–June traffic and zero July–August traffic. Individual calculator-lead attribution and opt-ins have not been connected from the current sheet.</section> : <LeadTable leads={leads} destination={destination} />}
    </div>
  </main>;
}

export default function BreezeLeadPortal() {
  const summary = trpc.breezePortal.summary.useQuery(undefined, { refetchInterval: 5 * 60 * 1000 });
  const rosterQuery = trpc.breezePortal.ownerReview.useQuery({ limit: 500 }, { refetchInterval: 5 * 60 * 1000 });
  const [destination, setDestination] = useState<BreezeDestinationKey | null>(null);
  const leads = (rosterQuery.data ?? []) as OwnerReviewLead[];
  if (destination) return <DestinationPage destination={destination} leads={leads} onBack={() => setDestination(null)} />;
  const approvedCount = (summary.data?.valid.count ?? 0) + (summary.data?.validGold.count ?? 0);
  return <main className="min-h-screen bg-[#061018] text-slate-100">
    <section className="border-b border-cyan-300/10 bg-[radial-gradient(circle_at_75%_0%,rgba(34,211,238,.17),transparent_34%),linear-gradient(110deg,#071722_0%,#092334_55%,#07131d_100%)]"><div className="mx-auto max-w-7xl px-5 py-14 sm:py-18"><h1 className="text-5xl font-black tracking-[-.06em] text-white sm:text-7xl">BREEZE</h1><p className="mt-4 text-lg font-medium text-cyan-100 sm:text-xl">Intent prospects based on behavioral activity.</p></div></section>
    <div className="mx-auto max-w-7xl px-5 py-9"><div className="grid gap-5 lg:grid-cols-2">{(Object.keys(BREEZE_DESTINATIONS) as BreezeDestinationKey[]).map(key => { const item = BREEZE_DESTINATIONS[key]; const affiliate = key === "affiliate"; return <button key={key} onClick={() => setDestination(key)} className={`group rounded-3xl border p-7 text-left transition-all hover:-translate-y-1 hover:shadow-2xl ${affiliate ? "border-cyan-300/35 bg-[linear-gradient(135deg,rgba(8,43,61,.92),rgba(7,19,29,.98))]" : "border-violet-300/30 bg-[linear-gradient(135deg,rgba(36,25,68,.86),rgba(7,19,29,.98))]"}`}><div className="flex items-start justify-between gap-4"><Pill tone={affiliate ? "cyan" : "violet"}>{item.eyebrow}</Pill><ChevronRight className="text-slate-400 transition-transform group-hover:translate-x-1" /></div><h3 className="mt-8 text-3xl font-black text-white">{item.title}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-slate-300">{item.description}</p><div className="mt-7 grid grid-cols-3 gap-3"><Metric label="Traffic" value={item.activePeriod} note="Review range" /><Metric label="Leads" value={affiliate ? (rosterQuery.isLoading ? "—" : formatCount(leads.length)) : "0"} note={affiliate ? "Approved roster" : "No linked roster"} /><Metric label="Opt-ins" value="—" note="Not connected" /></div><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-cyan-100">Open destination details <ArrowRight size={16} /></span></button>; })}</div>
      <section className="mt-7 rounded-2xl border border-white/10 bg-[#0b1b27] p-5"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 shrink-0 text-amber-300" size={18} /><p className="text-sm leading-6 text-slate-300"><strong className="text-white">Data status:</strong> {summary.isLoading ? "Refreshing approved source…" : `${formatCount(approvedCount)} approved spreadsheet records are available for review.`} Traffic and engagement sequences are clearly labeled illustrative demo data. Actual opt-ins, form events, phone numbers, income, and live media delivery will appear when their data sources are connected.</p></div></section>
    </div>
  </main>;
}

export function BreezeStaffLeads() {
  return <BreezeLeadPortal />;
}
