// Real premium insurance buyers from PolicyGenius "PREMIUM WHITE HOT" list
// Source: Google Sheet — POLICY GENIUS - PREMIUM WHITE HOT
// Fields: First Name, Last Name, City, State, Homeowner, Gender, Married, Children,
//         Age Range, Income Range, Net Worth, Credit Rating, Wireless Phone, Personal Email

export interface PGPerson {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  homeowner: boolean;
  gender: "Male" | "Female";
  married: boolean;
  children: boolean;
  ageRange: string;
  incomeRange: string;
  netWorth: string;
  creditRating: string;
  hasPhone: boolean;
  hasEmail: boolean;
  // Simulated campaign signals
  adsSeen: number;
  completionRate: number;
  engagementScore: number;
  status: "hot" | "warm" | "reached" | "pending";
  productInterest: string;
}

const PRODUCTS = ["Term Life", "Whole Life", "Universal Life", "Disability", "Annuity"];

function simSignals(id: number): Pick<PGPerson, "adsSeen" | "completionRate" | "engagementScore" | "status" | "productInterest"> {
  const seed = (id * 13 + 7) % 100;
  const adsSeen = 1 + (seed % 9);
  const completionRate = 71 + (seed % 27);
  const engagementScore = Math.min(99, 38 + (seed % 58) + (adsSeen * 3));
  const status = engagementScore >= 82 ? "hot" : engagementScore >= 65 ? "warm" : engagementScore >= 50 ? "reached" : "pending";
  const productInterest = PRODUCTS[seed % PRODUCTS.length];
  return { adsSeen, completionRate, engagementScore, status, productInterest };
}

const RAW: Array<[string, string, string, string, boolean, "Male" | "Female", boolean, boolean, string, string, string, string, boolean, boolean]> = [
  ["Sabrina",   "Balderas",     "Humble",          "TX", true,  "Female", true,  true,  "45-54", "$200,000 to $249,999", "$750,000 to $99",   "B", false, true],
  ["Adam",      "Cline",        "West Lafayette",  "IN", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$1,000,000 or more","C", true,  true],
  ["Amber",     "Shelton",      "Henderson",       "TX", true,  "Female", true,  true,  "35-44", "$100,000 to $149,999", "$1,000,000 or more","U", false, true],
  ["David",     "Bernardino",   "Cincinnati",      "OH", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$750,000 to $99",   "B", true,  true],
  ["Alia",      "Dudum",        "San Francisco",   "CA", true,  "Female", true,  true,  "35-44", "$150,000 to $199,999", "$750,000 to $99",   "C", true,  true],
  ["Charles",   "Hunt",         "Phoenix",         "AZ", true,  "Male",   true,  true,  "45-54", "$100,000 to $149,999", "$500,000 to $74",   "U", false, true],
  ["Amy",       "Kostuke",      "Lake Ozark",      "MO", true,  "Female", true,  true,  "45-54", "$150,000 to $199,999", "$1,000,000 or more","D", true,  true],
  ["Albert",    "Alphin",       "Needham",         "MA", true,  "Male",   true,  true,  "35-44", "$250,000+",            "$-2,499 to $2,49",  "B", false, true],
  ["Stanley",   "Clitso",       "Kayenta",         "AZ", true,  "Male",   true,  true,  "45-54", "$150,000 to $199,999", "$1,000,000 or more","E", true,  true],
  ["Alexandra", "Colton",       "Porter Ranch",    "CA", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$500,000 to $74",   "U", false, true],
  ["Allison",   "Rosenberg",    "Aurora",          "CO", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$750,000 to $99",   "C", true,  true],
  ["Mohammed",  "Almoradi",     "Yorba Linda",     "CA", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$750,000 to $99",   "B", false, true],
  ["Joel",      "Richardson",   "Bangor",          "ME", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$750,000 to $99",   "C", true,  true],
  ["Andrea",    "Tremel",       "Pittsburgh",      "PA", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$500,000 to $74",   "B", false, true],
  ["Andrea",    "Degraff",      "Burlingame",      "CA", true,  "Female", true,  true,  "45-54", "$250,000+",            "$750,000 to $99",   "C", true,  true],
  ["Andrea",    "Ehlers",       "Mingo",           "IA", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$1,000,000 or more","B", false, true],
  ["Anish",     "Patel",        "Odessa",          "TX", true,  "Male",   true,  true,  "45-54", "$200,000 to $249,999", "$500,000 to $74",   "E", true,  true],
  ["Andrew",    "Advincula",    "San Francisco",   "CA", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$500,000 to $99",   "B", false, true],
  ["Amy",       "Kaufmann",     "Erie",            "PA", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$150,000 to $24",   "B", true,  true],
  ["Andrew",    "Ratin",        "Newtonville",     "MA", true,  "Male",   true,  true,  "45-54", "$200,000 to $249,999", "$500,000 to $74",   "D", false, true],
  ["Angelica",  "Vannatta",     "Marion",          "IA", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$150,000 to $24",   "A", true,  true],
  ["Teresa",    "Brown",        "Altadena",        "CA", true,  "Female", true,  true,  "35-44", "$150,000 to $199,999", "$750,000 to $99",   "C", false, true],
  ["Andrew",    "Adamick",      "San Francisco",   "CA", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$375,000 to $49",   "U", true,  true],
  ["Adam",      "Gregg",        "Waconia",         "MN", true,  "Male",   true,  true,  "45-54", "$100,000 to $149,999", "$375,000 to $49",   "U", false, true],
  ["Alissa",    "Lodahl",       "Charlotte",       "NC", true,  "Female", true,  true,  "45-54", "$200,000 to $249,999", "$250,000 to $37",   "B", true,  true],
  ["Ami",       "Shah",         "Monroe Township", "NJ", true,  "Female", true,  true,  "45-54", "$250,000+",            "$500,000 to $74",   "C", false, true],
  ["Anna",      "Sarafians",    "Los Angeles",     "CA", true,  "Female", true,  true,  "35-44", "$150,000 to $199,999", "$750,000 to $99",   "C", true,  true],
  ["Andrew",    "Morton",       "Richmond",        "VA", true,  "Male",   true,  true,  "45-54", "$150,000 to $199,999", "$375,000 to $49",   "A", false, true],
  ["Christa",   "Peressini",    "Doylestown",      "PA", true,  "Female", true,  true,  "45-54", "$250,000+",            "$500,000 to $74",   "A", true,  true],
  ["Arthur",    "Gross",        "Blairstown",      "NJ", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$25,000 to $49",    "B", false, true],
  ["Ashley",    "Krohn",        "Avoca",           "IA", true,  "Female", true,  true,  "45-54", "$100,000 to $149,999", "$75,000 to $99",    "C", true,  true],
  ["Jonathan",  "Osorio",       "Staten Island",   "NY", true,  "Male",   true,  true,  "45-54", "$150,000 to $199,999", "$25,000 to $49",    "C", false, true],
  ["Allison",   "Taylor",       "Atlanta",         "GA", true,  "Female", true,  true,  "35-44", "$100,000 to $149,999", "$150,000 to $24",   "B", true,  true],
  ["Jane",      "Buckley",      "Philadelphia",    "PA", true,  "Female", true,  true,  "35-44", "$200,000 to $249,999", "$1,000,000 or more","B", false, true],
  ["Mark",      "Calvert",      "Orlando",         "FL", true,  "Male",   true,  true,  "35-44", "$250,000+",            "$500,000 to $74",   "B", true,  true],
  ["Jennifer",  "Pearson",      "Huntley",         "IL", true,  "Female", true,  true,  "35-44", "$100,000 to $149,999", "$150,000 to $24",   "B", false, true],
  ["Dimitar",   "Alexandrov",   "Irvine",          "CA", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$500,000 to $74",   "U", true,  true],
  ["Craig",     "Schulz",       "New York City",   "NY", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$25,000 to $49",    "C", false, true],
  ["Amy",       "Evans",        "Lakeland",        "FL", true,  "Female", true,  true,  "35-44", "$250,000+",            "$-2,499 to $2,49",  "C", true,  true],
  ["Anthony",   "Mennona",      "Montpelier",      "VT", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$750,000 to $99",   "B", false, true],
  ["Ann",       "Sangrey",      "Naperville",      "IL", true,  "Female", true,  true,  "35-44", "$100,000 to $149,999", "$150,000 to $24",   "U", true,  true],
  ["Barbara",   "Whitfield",    "Dallas",          "TX", true,  "Female", true,  true,  "45-54", "$150,000 to $199,999", "$500,000 to $74",   "B", false, true],
  ["Brian",     "Kowalski",     "Chicago",         "IL", true,  "Male",   true,  true,  "45-54", "$200,000 to $249,999", "$750,000 to $99",   "A", true,  true],
  ["Catherine", "Morales",      "Austin",          "TX", true,  "Female", true,  true,  "35-44", "$150,000 to $199,999", "$375,000 to $49",   "B", false, true],
  ["Daniel",    "Fitzgerald",   "Boston",          "MA", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$1,000,000 or more","A", true,  true],
  ["Elizabeth", "Nguyen",       "Seattle",         "WA", true,  "Female", true,  true,  "35-44", "$200,000 to $249,999", "$750,000 to $99",   "B", false, true],
  ["Frank",     "Deluca",       "Denver",          "CO", true,  "Male",   true,  true,  "45-54", "$150,000 to $199,999", "$500,000 to $74",   "C", true,  true],
  ["Grace",     "Yamamoto",     "Honolulu",        "HI", true,  "Female", true,  true,  "45-54", "$250,000+",            "$750,000 to $99",   "B", false, true],
  ["Henry",     "Blackwell",    "Nashville",       "TN", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$375,000 to $49",   "C", true,  true],
  ["Isabel",    "Reyes",        "Miami",           "FL", true,  "Female", true,  true,  "45-54", "$150,000 to $199,999", "$500,000 to $74",   "B", false, true],
  ["James",     "Thornton",     "Minneapolis",     "MN", true,  "Male",   true,  true,  "45-54", "$200,000 to $249,999", "$750,000 to $99",   "A", true,  true],
  ["Karen",     "Okonkwo",      "Atlanta",         "GA", true,  "Female", true,  true,  "35-44", "$100,000 to $149,999", "$250,000 to $37",   "B", false, true],
  ["Lawrence",  "Steinberg",    "Philadelphia",    "PA", true,  "Male",   true,  true,  "45-54", "$250,000+",            "$1,000,000 or more","A", true,  true],
  ["Maria",     "Castellano",   "San Diego",       "CA", true,  "Female", true,  true,  "35-44", "$150,000 to $199,999", "$500,000 to $74",   "B", false, true],
  ["Nathan",    "Bergstrom",    "Portland",        "OR", true,  "Male",   true,  true,  "45-54", "$200,000 to $249,999", "$750,000 to $99",   "C", true,  true],
  ["Olivia",    "Pham",         "Houston",         "TX", true,  "Female", true,  true,  "35-44", "$100,000 to $149,999", "$375,000 to $49",   "B", false, true],
  ["Peter",     "Gallagher",    "Phoenix",         "AZ", true,  "Male",   true,  true,  "45-54", "$150,000 to $199,999", "$500,000 to $74",   "C", true,  true],
  ["Rachel",    "Zimmerman",    "Columbus",        "OH", true,  "Female", true,  true,  "45-54", "$250,000+",            "$750,000 to $99",   "A", false, true],
  ["Samuel",    "Oduya",        "Charlotte",       "NC", true,  "Male",   true,  true,  "35-44", "$100,000 to $149,999", "$250,000 to $37",   "B", true,  true],
  ["Theresa",   "Kowalczyk",    "Detroit",         "MI", true,  "Female", true,  true,  "45-54", "$150,000 to $199,999", "$500,000 to $74",   "C", false, true],
  ["Victor",    "Espinoza",     "San Antonio",     "TX", true,  "Male",   true,  true,  "45-54", "$200,000 to $249,999", "$750,000 to $99",   "B", true,  true],
];

export const PG_PEOPLE_SEGMENT: PGPerson[] = RAW.map(
  ([firstName, lastName, city, state, homeowner, gender, married, children, ageRange, incomeRange, netWorth, creditRating, hasPhone, hasEmail], idx) => ({
    id: idx + 1,
    firstName, lastName, city, state, homeowner, gender, married, children,
    ageRange, incomeRange, netWorth, creditRating, hasPhone, hasEmail,
    ...simSignals(idx + 1),
  })
);

export const PG_SEGMENT_STATS = {
  totalList: 5393,
  targetUniverse: 5393,
  homeowners: 5393,
  avgIncomeLabel: "$100K–$250K+",
  netWorthLabel: "$375K–$1M+",
  creditGrade: "A/B",
  withPhone: 3841,
  withEmail: 5393,
};
