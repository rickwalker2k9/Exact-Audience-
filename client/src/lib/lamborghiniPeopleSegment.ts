// Refreshed Lamborghini of Scottsdale audience roster — Aug 15, 2026

export interface LamboPerson {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  ageRange: string;
  gender: string;
  children: boolean;
  homeowner: boolean;
  adsSeen: number;
  completionRate: number;
  productInterest: string;
  status: "hot" | "warm" | "reached" | "pending";
  incomeRange: string;
  netWorth: string;
  creditRating: string;
}

export const LAMBO_SEGMENT_STATS = {
  totalList: 8420,
  homeowners: 8420,
  avgIncomeLabel: "$500K+",
  netWorthLabel: "$2M+",
  creditGrade: "A",
  withPhone: 7180,
  withEmail: 6940,
  targetUniverse: 8420,
};

const LAMBO_ROSTER_SEEDS = [
  ["Marisol", "Vega", "Paradise Valley", "Female", "Urus SE", "hot"],
  ["Trent", "Nakamura", "Scottsdale", "Male", "Urus S", "hot"],
  ["Imani", "Brooks", "Phoenix", "Female", "Urus S", "warm"],
  ["Owen", "Calder", "Fountain Hills", "Male", "Revuelto", "hot"],
  ["Leila", "Sethi", "Paradise Valley", "Female", "Urus SE", "warm"],
  ["Julian", "Verma", "Scottsdale", "Male", "Urus S", "reached"],
  ["Arden", "Morales", "Tempe", "Male", "Urus Performante", "warm"],
  ["Caleb", "Roth", "Carefree", "Male", "Urus S", "hot"],
  ["Talia", "Okeke", "Scottsdale", "Female", "Urus S", "warm"],
  ["Sasha", "Feldman", "Paradise Valley", "Female", "Urus SE", "pending"],
  ["Jae", "Kim", "Chandler", "Male", "Urus S", "warm"],
  ["Noor", "Alvarez", "Arcadia", "Female", "Huracán Tecnica", "hot"],
  ["Dominic", "Price", "Phoenix", "Male", "Revuelto", "hot"],
  ["Amina", "Lawson", "Scottsdale", "Female", "Urus Performante", "warm"],
  ["Elliot", "Mercer", "Paradise Valley", "Male", "Urus S", "reached"],
  ["Priya", "Desai", "Gilbert", "Female", "Urus SE", "warm"],
  ["Marcus", "Bell", "Fountain Hills", "Male", "Huracán Sterrato", "hot"],
  ["Claudia", "Reese", "Scottsdale", "Female", "Urus S", "warm"],
  ["Darius", "Holt", "Carefree", "Male", "Revuelto", "pending"],
  ["Elena", "Vargas", "Phoenix", "Female", "Urus Performante", "warm"],
  ["Nolan", "Hayes", "Scottsdale", "Male", "Urus S", "hot"],
  ["Zara", "Bennett", "Paradise Valley", "Female", "Huracán Tecnica", "warm"],
  ["Gideon", "Cole", "Chandler", "Male", "Urus SE", "reached"],
  ["Simone", "Avery", "Scottsdale", "Female", "Urus S", "hot"],
  ["Rafael", "Mills", "Tempe", "Male", "Huracán Sterrato", "warm"],
  ["Genevieve", "Park", "Fountain Hills", "Female", "Urus Performante", "pending"],
  ["Milan", "Abbott", "Paradise Valley", "Male", "Revuelto", "hot"],
  ["Nia", "Ramirez", "Scottsdale", "Female", "Urus SE", "warm"],
  ["Theodore", "Wynn", "Carefree", "Male", "Urus S", "reached"],
  ["Carina", "Shaw", "Phoenix", "Female", "Huracán Tecnica", "warm"],
  ["Andre", "Cortez", "Scottsdale", "Male", "Urus Performante", "hot"],
  ["Maeve", "Liu", "Paradise Valley", "Female", "Urus S", "warm"],
  ["Harrison", "Blake", "Fountain Hills", "Male", "Revuelto", "pending"],
  ["Yasmin", "Caldwell", "Scottsdale", "Female", "Urus SE", "hot"],
  ["Sterling", "Davis", "Chandler", "Male", "Urus S", "warm"],
  ["Maya", "Kline", "Tempe", "Female", "Huracán Sterrato", "reached"],
  ["Quincy", "Archer", "Carefree", "Male", "Urus Performante", "warm"],
  ["Hana", "Wright", "Phoenix", "Female", "Urus S", "hot"],
  ["Ronin", "Foster", "Scottsdale", "Male", "Revuelto", "hot"],
  ["Celina", "Morrow", "Paradise Valley", "Female", "Urus SE", "warm"],
  ["Bennett", "Sloan", "Fountain Hills", "Male", "Urus S", "reached"],
  ["Farah", "Nielsen", "Scottsdale", "Female", "Urus Performante", "pending"],
  ["Isaac", "Wells", "Chandler", "Male", "Huracán Tecnica", "hot"],
  ["Vera", "Manning", "Phoenix", "Female", "Urus S", "warm"],
  ["Soren", "Dawson", "Carefree", "Male", "Urus SE", "warm"],
  ["Anika", "Pierce", "Scottsdale", "Female", "Huracán Sterrato", "hot"],
  ["Blaine", "Morgan", "Paradise Valley", "Male", "Urus Performante", "reached"],
  ["Jocelyn", "Tate", "Fountain Hills", "Female", "Urus S", "warm"],
  ["Elias", "Grant", "Scottsdale", "Male", "Revuelto", "hot"],
  ["Kendra", "Solis", "Chandler", "Female", "Urus SE", "pending"],
  ["Wesley", "Hart", "Tempe", "Male", "Urus S", "warm"],
  ["Liana", "Voss", "Phoenix", "Female", "Huracán Tecnica", "hot"],
  ["Maddox", "Reed", "Carefree", "Male", "Urus Performante", "warm"],
  ["Daphne", "Ellis", "Scottsdale", "Female", "Urus S", "reached"],
  ["Alistair", "Rowe", "Paradise Valley", "Male", "Revuelto", "hot"],
  ["Rina", "Patel", "Fountain Hills", "Female", "Urus SE", "warm"],
  ["Cyrus", "Madden", "Scottsdale", "Male", "Urus S", "pending"],
  ["Maren", "Doyle", "Chandler", "Female", "Huracán Sterrato", "warm"],
  ["Kellan", "Fox", "Phoenix", "Male", "Urus Performante", "hot"],
  ["Selene", "Bishop", "Scottsdale", "Female", "Urus S", "warm"],
] as const;

const AGE_RANGES = ["35–44", "45–54", "45–54", "55–64", "35–44", "45–54"];
const INCOME_RANGES = ["$420K–$650K", "$520K–$850K", "$650K–$1.1M", "$800K–$1.6M", "$360K–$560K", "$500K–$780K"];
const NET_WORTH_RANGES = ["$2.2M–$3.8M", "$3.4M–$5.5M", "$4.5M–$7.5M", "$6M–$12M", "$1.8M–$3M", "$2.8M–$4.8M"];

export const LAMBO_PEOPLE: LamboPerson[] = LAMBO_ROSTER_SEEDS.map(([firstName, lastName, city, gender, productInterest, status], index) => ({
  id: `l-${String(index + 1).padStart(2, "0")}`,
  firstName,
  lastName,
  city,
  state: "AZ",
  ageRange: AGE_RANGES[index % AGE_RANGES.length],
  gender,
  children: index % 3 !== 1,
  homeowner: true,
  adsSeen: 4 + (index % 6),
  completionRate: 80 + ((index * 3) % 19),
  productInterest,
  status,
  incomeRange: INCOME_RANGES[index % INCOME_RANGES.length],
  netWorth: NET_WORTH_RANGES[index % NET_WORTH_RANGES.length],
  creditRating: index % 11 === 0 ? "B" : "A",
}));
