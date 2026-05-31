// Real voters from Tulsa County GOP 45+ registered voter list
// Source: TulsaCoVoters-TulsaCountyGOPSlimmedTop111,000.csv
// Used for People Segment tab in McCarty dashboard

export interface VoterRecord {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  zip: string;
  age: number;
  gender: "M" | "F";
  hasMobile: boolean;
  // Simulated campaign signals
  adsSeen: number;
  completionRate: number;
  persuasionScore: number;
  mood: string;
  status: "moved" | "engaged" | "reached" | "pending";
}

const MOODS = ["Accountability", "DV Reform", "Public Safety", "Undecided", "Glossip/Integrity"];
const STATUSES: VoterRecord["status"][] = ["moved", "engaged", "reached", "pending"];

function simSignals(id: number, age: number): Pick<VoterRecord, "adsSeen" | "completionRate" | "persuasionScore" | "mood" | "status"> {
  const seed = (id * 7 + age * 3) % 100;
  const adsSeen = 1 + (seed % 8);
  const completionRate = 72 + (seed % 25);
  const persuasionScore = Math.min(98, 40 + (seed % 55) + (adsSeen * 4));
  const mood = MOODS[seed % MOODS.length];
  const status = persuasionScore >= 80 ? "moved" : persuasionScore >= 65 ? "engaged" : persuasionScore >= 50 ? "reached" : "pending";
  return { adsSeen, completionRate, persuasionScore, mood, status };
}

const RAW: Array<[string, string, string, string, number, "M" | "F", boolean]> = [
  ["Bruce",     "Ritchie",         "Broken Arrow", "74012", 66, "M", false],
  ["Jo",        "Admire",          "Tulsa",        "74114", 80, "F", true],
  ["Sheree",    "Jordan",          "Broken Arrow", "74012", 70, "F", true],
  ["Sharon",    "Flick",           "Tulsa",        "74133", 76, "F", true],
  ["Laurie",    "Mcdonald",        "Bixby",        "74008", 72, "F", true],
  ["Lacinda",   "Keilbarth",       "Tulsa",        "74133", 68, "F", true],
  ["Gloria",    "Peterson",        "Tulsa",        "74107", 59, "F", true],
  ["Kay",       "Gerety",          "Broken Arrow", "74011", 71, "F", true],
  ["Stanley",   "Mason",           "Broken Arrow", "74011", 60, "M", true],
  ["Larry",     "Worley",          "Owasso",       "74055", 82, "M", true],
  ["Kimberly",  "Heiling-Friess",  "Tulsa",        "74105", 58, "F", true],
  ["Bruce",     "Bingham",         "Jenks",        "74037", 64, "M", true],
  ["Carolyn",   "Ensley",          "Tulsa",        "74137", 68, "F", true],
  ["Christie",  "Cannon",          "Tulsa",        "74107", 49, "F", true],
  ["Mitsy",     "Willett",         "Broken Arrow", "74011", 56, "F", true],
  ["Lori",      "Rodriguez",       "Broken Arrow", "74012", 60, "F", true],
  ["Leedy",     "Smith",           "Jenks",        "74037", 53, "F", true],
  ["Judith",    "Woolley",         "Tulsa",        "74112", 80, "F", false],
  ["Christine", "Zenthoefer",      "Bixby",        "74008", 49, "F", false],
  ["Annette",   "Davidson",        "Tulsa",        "74107", 63, "F", true],
  ["Shannon",   "Allison",         "Bixby",        "74008", 57, "F", true],
  ["William",   "Volkmer",         "Tulsa",        "74136", 64, "M", true],
  ["Michelle",  "Snyder",          "Bixby",        "74008", 57, "F", true],
  ["Robin",     "Thompson",        "Tulsa",        "74145", 68, "F", true],
  ["Natalie",   "Burnette",        "Jenks",        "74037", 61, "F", true],
  ["Carey",     "Haynie",          "Tulsa",        "74137", 62, "F", true],
  ["Roseann",   "Walker",          "Tulsa",        "74133", 68, "F", true],
  ["Debra",     "Cutter",          "Tulsa",        "74137", 63, "F", true],
  ["James",     "Field",           "Sand Springs", "74063", 50, "M", true],
  ["Naomi",     "Patton",          "Broken Arrow", "74012", 80, "F", true],
  ["Larry",     "Brown",           "Broken Arrow", "74011", 84, "M", true],
  ["Donald",    "Avey",            "Sand Springs", "74063", 70, "M", true],
  ["Ronald",    "Royal",           "Tulsa",        "74135", 65, "M", true],
  ["Charles",   "Welch",           "Broken Arrow", "74012", 58, "M", true],
  ["Paul",      "Moore",           "Tulsa",        "74133", 73, "M", true],
  ["Ernestine", "Newton",          "Tulsa",        "74126", 68, "F", true],
  ["Tina",      "Young",           "Tulsa",        "74133", 50, "F", true],
  ["Joseph",    "Nozak",           "Bixby",        "74008", 46, "M", true],
  ["David",     "Vines",           "Owasso",       "74055", 68, "M", true],
  ["Dustin",    "Hynes",           "Broken Arrow", "74012", 50, "M", true],
  ["Katrina",   "Johnson",         "Broken Arrow", "74011", 50, "F", true],
  ["James",     "Morton",          "Tulsa",        "74145", 61, "M", true],
  ["Michael",   "Smart",           "Tulsa",        "74105", 71, "M", true],
  ["Suzan",     "Hatcher",         "Sand Springs", "74063", 70, "F", true],
  ["Izora",     "Moore",           "Tulsa",        "74132", 81, "F", true],
  ["Patricia",  "Eck",             "Tulsa",        "74105", 72, "F", true],
  ["Kathy",     "Graves",          "Sand Springs", "74063", 56, "F", true],
  ["Mark",      "Hoss",            "Broken Arrow", "74011", 47, "M", true],
  ["Tammy",     "Chaudlry",        "Tulsa",        "74110", 65, "F", true],
  ["Steven",    "Thomas",          "Tulsa",        "74135", 66, "M", true],
  ["Daniel",    "Eisman",          "Owasso",       "74055", 45, "M", true],
  ["Vicki",     "Barnes",          "Tulsa",        "74107", 69, "F", true],
  ["Janice",    "Herrington",      "Tulsa",        "74137", 71, "F", true],
  ["Amy",       "Moore",           "Tulsa",        "74137", 56, "F", true],
  ["Ronald",    "Woodward",        "Broken Arrow", "74012", 61, "M", true],
  ["Jill",      "Wagnon",          "Bixby",        "74008", 60, "F", true],
  ["Patrick",   "Struck",          "Jenks",        "74037", 73, "M", true],
  ["Deborah",   "Mcclellan",       "Broken Arrow", "74011", 60, "F", false],
  ["Janice",    "Ham",             "Bixby",        "74008", 79, "F", true],
  ["Susan",     "Day",             "Tulsa",        "74135", 74, "F", false],
];

export const MCCARTY_PEOPLE_SEGMENT: VoterRecord[] = RAW.map(([firstName, lastName, city, zip, age, gender, hasMobile], idx) => ({
  id: idx + 1,
  firstName,
  lastName,
  city,
  zip,
  age,
  gender,
  hasMobile,
  ...simSignals(idx + 1, age),
}));

export const SEGMENT_STATS = {
  totalVoters: 111000,
  targetUniverse: 83076,  // 45+ Tulsa County GOP
  reached: 68420,
  movedToMcCarty: 1120,
  femalePercent: 62,
  malePercent: 38,
  avgAge: 64,
  mobileReach: 87,
};
