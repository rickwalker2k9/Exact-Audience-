export type Tn5County = {
  name: string;
  mapPosition: { left: string; top: string; width: string; height: string };
  region: string;
  publicContext: string;
  planningLens: string;
};

export const TN5_COUNTIES: Tn5County[] = [
  { name: "Lake", mapPosition: { left: "5.5%", top: "16%", width: "5%", height: "15%" }, region: "Northwest rural", publicContext: "Part of the northwest agricultural and Reelfoot Lake region described in public district reporting.", planningLens: "Validate local farm, resilience, and community-service messengers before assigning creative." },
  { name: "Obion", mapPosition: { left: "11%", top: "16%", width: "6%", height: "16%" }, region: "Northwest rural", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Build an address-validated county audience and confirm local issue priorities with campaign field research." },
  { name: "Weakley", mapPosition: { left: "17%", top: "16%", width: "7%", height: "17%" }, region: "Northwest rural", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Use verified local validators and county-specific reporting before choosing message emphasis." },
  { name: "Henry", mapPosition: { left: "24%", top: "16%", width: "6%", height: "17%" }, region: "Northwest rural", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Test local biography and agriculture proof points against current field intelligence." },
  { name: "Dyer", mapPosition: { left: "8%", top: "34%", width: "6%", height: "17%" }, region: "Mississippi corridor", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Coordinate paid delivery with local events, earned media, and address-level district validation." },
  { name: "Lauderdale", mapPosition: { left: "3%", top: "52%", width: "6%", height: "17%" }, region: "Mississippi corridor", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Use a current voter universe and community research; do not generalize from another county’s response." },
  { name: "Tipton", mapPosition: { left: "3%", top: "71%", width: "6%", height: "17%" }, region: "Mississippi corridor", publicContext: "Partially included under the 2026 district map; address-level validation is essential.", planningLens: "Confirm the eligible geography before audience matching, then pair media with local field signals." },
  { name: "Shelby", mapPosition: { left: "2%", top: "84%", width: "7%", height: "13%" }, region: "Memphis area", publicContext: "The new district includes a portion of Shelby County and downtown Memphis according to local reporting.", planningLens: "Treat this as a distinct planning area; validate boundaries, local context, and compliant targeting before activation." },
  { name: "Houston", mapPosition: { left: "29%", top: "29%", width: "5%", height: "15%" }, region: "Rural Middle Tennessee", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Use localized research and a field-feedback loop before assigning delivery weight." },
  { name: "Benton", mapPosition: { left: "28%", top: "46%", width: "5%", height: "16%" }, region: "Rural Middle Tennessee", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Confirm current issue priorities and trusted messengers through campaign research." },
  { name: "Humphreys", mapPosition: { left: "33%", top: "36%", width: "6%", height: "17%" }, region: "Rural Middle Tennessee", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Sequence verified local proof points with field and event coordination." },
  { name: "Stewart", mapPosition: { left: "29%", top: "3%", width: "6%", height: "15%" }, region: "Northern gateway", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Confirm county coverage and local context before using any modeled audience segment." },
  { name: "Montgomery", mapPosition: { left: "35%", top: "4%", width: "7%", height: "15%" }, region: "Northern gateway", publicContext: "Only a portion is included under the new map; public reporting notes a sliver of north Montgomery County.", planningLens: "Address-level eligibility and Fort Campbell-area local context should be validated before media activation." },
  { name: "Williamson", mapPosition: { left: "39%", top: "43%", width: "6%", height: "16%" }, region: "Southern Middle Tennessee", publicContext: "Only western Williamson is in the new district according to local reporting.", planningLens: "Use boundary validation and growth/infrastructure research before defining the county plan." },
  { name: "Hickman", mapPosition: { left: "34%", top: "52%", width: "6%", height: "17%" }, region: "Southern Middle Tennessee", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Align county delivery with current local research, field plan, and approved creative." },
  { name: "Lewis", mapPosition: { left: "35%", top: "69%", width: "6%", height: "17%" }, region: "Southern Middle Tennessee", publicContext: "Included in the official 2026 TN-5 county list.", planningLens: "Use field-confirmed local validators and a current voter universe rather than primary-only assumptions." },
  { name: "Maury", mapPosition: { left: "40%", top: "61%", width: "6%", height: "17%" }, region: "Southern Middle Tennessee", publicContext: "Only part of Maury is included under the 2026 district map; Columbia is outside the district under the new boundaries.", planningLens: "Validate the eligible geography and distinguish campaign biography from a countywide targeting assumption." },
];

export const TN5_MAP_SOURCE_URL = "https://comptroller.tn.gov/maps/u-s--congress-districts.html";
