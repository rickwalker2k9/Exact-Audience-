import { useMemo, useState } from "react";
import { TN5_COUNTIES, TN5_MAP_SOURCE_URL } from "@/lib/tn5Map";

const DISTRICT_LAYOUT: Record<string, { x: number; y: number }> = {
  Lake: { x: 36, y: 74 }, Obion: { x: 148, y: 74 }, Weakley: { x: 260, y: 74 }, Henry: { x: 372, y: 74 },
  Stewart: { x: 484, y: 24 }, Montgomery: { x: 596, y: 24 }, Houston: { x: 484, y: 124 }, Humphreys: { x: 372, y: 174 },
  Benton: { x: 260, y: 174 }, Dyer: { x: 148, y: 174 }, Lauderdale: { x: 36, y: 274 }, Tipton: { x: 80, y: 374 },
  Shelby: { x: 192, y: 424 }, Williamson: { x: 596, y: 174 }, Hickman: { x: 484, y: 274 }, Lewis: { x: 528, y: 374 }, Maury: { x: 640, y: 324 },
};

const REGION_COLORS: Record<string, string> = {
  "Northwest rural": "#2563eb",
  "Mississippi corridor": "#0891b2",
  "Rural Middle Tennessee": "#7c3aed",
  "Northern gateway": "#ea580c",
  "Southern Middle Tennessee": "#059669",
  "Memphis area": "#db2777",
};

export function Tn5InteractiveMap({ card, ink, muted, border, isDark }: { card: string; ink: string; muted: string; border: string; isDark: boolean }) {
  const [selectedCountyName, setSelectedCountyName] = useState("Williamson");
  const selectedCounty = useMemo(() => TN5_COUNTIES.find(county => county.name === selectedCountyName) ?? TN5_COUNTIES[0], [selectedCountyName]);
  const pathway = ["Lake", "Obion", "Weakley", "Henry", "Benton", "Humphreys", "Houston", "Stewart", "Montgomery", "Williamson", "Hickman", "Lewis", "Maury", "Dyer", "Lauderdale", "Tipton", "Shelby"];

  return (
    <section id="district-map" style={{ scrollMarginTop: 90, marginTop: 34, background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "#0ea5e9", fontSize: 10, letterSpacing: ".14em", fontWeight: 800, textTransform: "uppercase" }}>TN-5 district intelligence</div>
          <h2 style={{ margin: "7px 0 0", color: ink, fontSize: 25, letterSpacing: "-.025em" }}>Only the counties in this race.</h2>
        </div>
        <div style={{ color: muted, fontSize: 11, maxWidth: 430, lineHeight: 1.6 }}>A focused, clickable planning map for the 17 counties in TN-5. It intentionally removes the rest of Tennessee so the conversation stays on the general-election district.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(270px,.55fr)", gap: 16, marginTop: 18 }}>
        <div style={{ overflow: "hidden", borderRadius: 12, border: `1px solid ${border}`, background: isDark ? "linear-gradient(145deg,#071324,#0b1930)" : "linear-gradient(145deg,#edf6ff,#f8fbff)" }}>
          <svg viewBox="0 0 760 510" role="img" aria-label="Interactive schematic map of the 17 counties in Tennessee congressional district 5" style={{ display: "block", width: "100%", height: "auto" }}>
            <defs>
              <filter id="mapShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity=".22" /></filter>
            </defs>
            <path d={pathway.map((county, index) => `${index === 0 ? "M" : "L"} ${DISTRICT_LAYOUT[county].x + 42} ${DISTRICT_LAYOUT[county].y + 26}`).join(" ")} fill="none" stroke={isDark ? "rgba(148,163,184,.27)" : "rgba(71,85,105,.22)"} strokeWidth="3" strokeDasharray="6 8" />
            {TN5_COUNTIES.map(county => {
              const layout = DISTRICT_LAYOUT[county.name];
              const isSelected = county.name === selectedCounty.name;
              const color = REGION_COLORS[county.region] ?? "#0ea5e9";
              return <g key={county.name} transform={`translate(${layout.x},${layout.y})`} onClick={() => setSelectedCountyName(county.name)} style={{ cursor: "pointer" }}>
                <title>{`${county.name} County — ${county.region}`}</title>
                <path d="M10 0 H74 L84 12 V40 L74 52 H10 L0 40 V12 Z" fill={isSelected ? color : isDark ? "#17243a" : "#ffffff"} stroke={isSelected ? "#e0f2fe" : color} strokeWidth={isSelected ? 3 : 1.5} filter="url(#mapShadow)" />
                <text x="42" y="30" textAnchor="middle" fill={isSelected ? "#ffffff" : isDark ? "#dbeafe" : "#1e3a5f"} fontSize="10" fontWeight="800" style={{ pointerEvents: "none" }}>{county.name}</text>
              </g>;
            })}
            <text x="28" y="486" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="10">District-only schematic · county inclusion can be partial — verify by address before activation</text>
          </svg>
        </div>
        <aside style={{ borderRadius: 12, padding: 16, background: isDark ? "#0a1020" : "#f6f9fd", border: `1px solid ${border}` }}>
          <div style={{ color: REGION_COLORS[selectedCounty.region] ?? "#38bdf8", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedCounty.region}</div>
          <div style={{ color: ink, fontSize: 23, fontWeight: 900, marginTop: 5 }}>{selectedCounty.name} County</div>
          <div style={{ marginTop: 14, borderTop: `1px solid ${border}`, paddingTop: 12 }}><div style={{ color: muted, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em" }}>Public district context</div><div style={{ color: ink, fontSize: 11, lineHeight: 1.6, marginTop: 5 }}>{selectedCounty.publicContext}</div></div>
          <div style={{ marginTop: 14, borderTop: `1px solid ${border}`, paddingTop: 12 }}><div style={{ color: muted, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em" }}>Planning lens</div><div style={{ color: ink, fontSize: 11, lineHeight: 1.6, marginTop: 5 }}>{selectedCounty.planningLens}</div></div>
          <div style={{ marginTop: 15, padding: "10px 12px", borderRadius: 8, background: "rgba(250,204,21,.10)", border: "1px solid rgba(250,204,21,.28)", color: muted, fontSize: 10, lineHeight: 1.55 }}>County status: <strong style={{ color: ink }}>research and boundary validation required</strong>. This is a planning view, not a voter or outcome prediction.</div>
        </aside>
      </div>
      <div style={{ marginTop: 12, color: muted, fontSize: 10, lineHeight: 1.55 }}>County list verified against 2026 public district reporting. <a href={TN5_MAP_SOURCE_URL} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>Official Tennessee Comptroller district maps ↗</a></div>
    </section>
  );
}
