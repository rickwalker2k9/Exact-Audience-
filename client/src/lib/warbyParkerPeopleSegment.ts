// Warby Parker People Segment — based on Warby Parker target demographics
// Urban/suburban professionals 25–45, style-conscious, college-educated, $60K–$150K income

export interface WarbyPerson {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  ageRange: string;
  gender: string;
  incomeRange: string;
  netWorth: string;
  creditRating: string;
  adsSeen: number;
  completionRate: number;
  productInterest: string;
  status: "hot" | "warm" | "reached" | "pending";
}

export const WARBY_SEGMENT_STATS = {
  totalList: 12840,
  homeowners: 7704,
  avgIncomeLabel: "$75K–$120K",
  netWorthLabel: "$150K–$400K",
  creditGrade: "B+",
  withPhone: 11560,
  withEmail: 12210,
  targetUniverse: 12840,
};

export const WARBY_PEOPLE: WarbyPerson[] = [
  { id: "w1", firstName: "Megan", lastName: "Hollister", city: "Brooklyn", state: "NY", ageRange: "28–34", gender: "Female", incomeRange: "$75K–$100K", netWorth: "$120K–$250K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Prescription Frames", status: "hot" },
  { id: "w2", firstName: "Tyler", lastName: "Okonkwo", city: "Chicago", state: "IL", ageRange: "25–34", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$180K", creditRating: "B", adsSeen: 5, completionRate: 84, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w3", firstName: "Sophia", lastName: "Reinholt", city: "Austin", state: "TX", ageRange: "30–39", gender: "Female", incomeRange: "$85K–$120K", netWorth: "$150K–$300K", creditRating: "A", adsSeen: 7, completionRate: 92, productInterest: "Sunglasses", status: "hot" },
  { id: "w4", firstName: "Marcus", lastName: "Delacroix", city: "Portland", state: "OR", ageRange: "25–34", gender: "Male", incomeRange: "$60K–$85K", netWorth: "$70K–$150K", creditRating: "B", adsSeen: 4, completionRate: 79, productInterest: "Prescription Frames", status: "warm" },
  { id: "w5", firstName: "Aisha", lastName: "Thornton", city: "Atlanta", state: "GA", ageRange: "28–37", gender: "Female", incomeRange: "$70K–$100K", netWorth: "$100K–$220K", creditRating: "B", adsSeen: 5, completionRate: 85, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w6", firstName: "Jake", lastName: "Fernandez", city: "Denver", state: "CO", ageRange: "25–34", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 6, completionRate: 87, productInterest: "Sunglasses", status: "hot" },
  { id: "w7", firstName: "Priya", lastName: "Mehta", city: "San Francisco", state: "CA", ageRange: "30–39", gender: "Female", incomeRange: "$110K–$150K", netWorth: "$200K–$400K", creditRating: "A", adsSeen: 8, completionRate: 94, productInterest: "Prescription Frames", status: "hot" },
  { id: "w8", firstName: "Connor", lastName: "Walsh", city: "Boston", state: "MA", ageRange: "25–34", gender: "Male", incomeRange: "$75K–$110K", netWorth: "$120K–$250K", creditRating: "B", adsSeen: 4, completionRate: 81, productInterest: "Blue Light Glasses", status: "reached" },
  { id: "w9", firstName: "Natalie", lastName: "Bergman", city: "Seattle", state: "WA", ageRange: "28–37", gender: "Female", incomeRange: "$90K–$130K", netWorth: "$160K–$320K", creditRating: "A", adsSeen: 7, completionRate: 91, productInterest: "Sunglasses", status: "hot" },
  { id: "w10", firstName: "Devon", lastName: "Patel", city: "Houston", state: "TX", ageRange: "25–34", gender: "Male", incomeRange: "$70K–$100K", netWorth: "$90K–$200K", creditRating: "B", adsSeen: 5, completionRate: 83, productInterest: "Prescription Frames", status: "warm" },
  { id: "w11", firstName: "Zoe", lastName: "Kessler", city: "Minneapolis", state: "MN", ageRange: "30–39", gender: "Female", incomeRange: "$75K–$105K", netWorth: "$130K–$260K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w12", firstName: "Ethan", lastName: "Nakamura", city: "Los Angeles", state: "CA", ageRange: "28–37", gender: "Male", incomeRange: "$85K–$120K", netWorth: "$140K–$280K", creditRating: "A", adsSeen: 7, completionRate: 90, productInterest: "Sunglasses", status: "hot" },
  { id: "w13", firstName: "Isabel", lastName: "Morales", city: "Miami", state: "FL", ageRange: "25–34", gender: "Female", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 4, completionRate: 80, productInterest: "Prescription Frames", status: "warm" },
  { id: "w14", firstName: "Ryan", lastName: "Blackwood", city: "Nashville", state: "TN", ageRange: "30–39", gender: "Male", incomeRange: "$80K–$115K", netWorth: "$140K–$280K", creditRating: "B", adsSeen: 5, completionRate: 85, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w15", firstName: "Camille", lastName: "Dubois", city: "New Orleans", state: "LA", ageRange: "28–37", gender: "Female", incomeRange: "$70K–$100K", netWorth: "$110K–$230K", creditRating: "B", adsSeen: 6, completionRate: 87, productInterest: "Sunglasses", status: "hot" },
  { id: "w16", firstName: "Jordan", lastName: "Ashworth", city: "Philadelphia", state: "PA", ageRange: "25–34", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$160K", creditRating: "B", adsSeen: 3, completionRate: 75, productInterest: "Prescription Frames", status: "reached" },
  { id: "w17", firstName: "Leila", lastName: "Hassan", city: "Washington", state: "DC", ageRange: "30–39", gender: "Female", incomeRange: "$95K–$135K", netWorth: "$170K–$340K", creditRating: "A", adsSeen: 7, completionRate: 92, productInterest: "Blue Light Glasses", status: "hot" },
  { id: "w18", firstName: "Brendan", lastName: "O'Sullivan", city: "San Diego", state: "CA", ageRange: "28–37", gender: "Male", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "B", adsSeen: 5, completionRate: 84, productInterest: "Sunglasses", status: "warm" },
  { id: "w19", firstName: "Yuki", lastName: "Tanaka", city: "San Jose", state: "CA", ageRange: "25–34", gender: "Female", incomeRange: "$100K–$140K", netWorth: "$180K–$360K", creditRating: "A", adsSeen: 8, completionRate: 93, productInterest: "Prescription Frames", status: "hot" },
  { id: "w20", firstName: "Miles", lastName: "Carpenter", city: "Charlotte", state: "NC", ageRange: "30–39", gender: "Male", incomeRange: "$75K–$110K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 5, completionRate: 86, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w21", firstName: "Alexis", lastName: "Fontaine", city: "Columbus", state: "OH", ageRange: "25–34", gender: "Female", incomeRange: "$60K–$85K", netWorth: "$70K–$150K", creditRating: "B", adsSeen: 4, completionRate: 78, productInterest: "Sunglasses", status: "reached" },
  { id: "w22", firstName: "Trevor", lastName: "Nguyen", city: "Phoenix", state: "AZ", ageRange: "28–37", gender: "Male", incomeRange: "$70K–$100K", netWorth: "$100K–$210K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Prescription Frames", status: "warm" },
  { id: "w23", firstName: "Simone", lastName: "Beaumont", city: "Baltimore", state: "MD", ageRange: "30–39", gender: "Female", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "A", adsSeen: 7, completionRate: 91, productInterest: "Blue Light Glasses", status: "hot" },
  { id: "w24", firstName: "Caleb", lastName: "Whitman", city: "Indianapolis", state: "IN", ageRange: "25–34", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$160K", creditRating: "B", adsSeen: 4, completionRate: 80, productInterest: "Sunglasses", status: "warm" },
  { id: "w25", firstName: "Fatima", lastName: "Al-Rashid", city: "Dearborn", state: "MI", ageRange: "28–37", gender: "Female", incomeRange: "$70K–$100K", netWorth: "$100K–$210K", creditRating: "B", adsSeen: 5, completionRate: 84, productInterest: "Prescription Frames", status: "warm" },
  { id: "w26", firstName: "Owen", lastName: "Gallagher", city: "Kansas City", state: "MO", ageRange: "30–39", gender: "Male", incomeRange: "$75K–$105K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 6, completionRate: 87, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w27", firstName: "Vivienne", lastName: "Larsson", city: "Salt Lake City", state: "UT", ageRange: "25–34", gender: "Female", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 5, completionRate: 85, productInterest: "Sunglasses", status: "warm" },
  { id: "w28", firstName: "Darius", lastName: "Coleman", city: "Detroit", state: "MI", ageRange: "28–37", gender: "Male", incomeRange: "$60K–$85K", netWorth: "$70K–$150K", creditRating: "B", adsSeen: 3, completionRate: 74, productInterest: "Prescription Frames", status: "reached" },
  { id: "w29", firstName: "Haley", lastName: "Zimmerman", city: "Madison", state: "WI", ageRange: "25–34", gender: "Female", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w30", firstName: "Nolan", lastName: "Fitzgerald", city: "Pittsburgh", state: "PA", ageRange: "30–39", gender: "Male", incomeRange: "$75K–$110K", netWorth: "$120K–$240K", creditRating: "A", adsSeen: 7, completionRate: 91, productInterest: "Sunglasses", status: "hot" },
  { id: "w31", firstName: "Amara", lastName: "Osei", city: "Raleigh", state: "NC", ageRange: "28–37", gender: "Female", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "A", adsSeen: 7, completionRate: 92, productInterest: "Prescription Frames", status: "hot" },
  { id: "w32", firstName: "Liam", lastName: "Donovan", city: "Providence", state: "RI", ageRange: "25–34", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$160K", creditRating: "B", adsSeen: 4, completionRate: 79, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w33", firstName: "Chloe", lastName: "Vance", city: "Richmond", state: "VA", ageRange: "30–39", gender: "Female", incomeRange: "$75K–$105K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 5, completionRate: 85, productInterest: "Sunglasses", status: "warm" },
  { id: "w34", firstName: "Xavier", lastName: "Baptiste", city: "New Haven", state: "CT", ageRange: "28–37", gender: "Male", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "A", adsSeen: 6, completionRate: 89, productInterest: "Prescription Frames", status: "warm" },
  { id: "w35", firstName: "Ingrid", lastName: "Sorensen", city: "Milwaukee", state: "WI", ageRange: "25–34", gender: "Female", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 5, completionRate: 83, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w36", firstName: "Elijah", lastName: "Monroe", city: "Memphis", state: "TN", ageRange: "28–37", gender: "Male", incomeRange: "$60K–$85K", netWorth: "$70K–$150K", creditRating: "B", adsSeen: 3, completionRate: 76, productInterest: "Sunglasses", status: "reached" },
  { id: "w37", firstName: "Tara", lastName: "Krishnamurthy", city: "San Jose", state: "CA", ageRange: "30–39", gender: "Female", incomeRange: "$110K–$150K", netWorth: "$200K–$400K", creditRating: "A", adsSeen: 8, completionRate: 94, productInterest: "Prescription Frames", status: "hot" },
  { id: "w38", firstName: "Finn", lastName: "Callahan", city: "Burlington", state: "VT", ageRange: "25–34", gender: "Male", incomeRange: "$60K–$85K", netWorth: "$70K–$150K", creditRating: "B", adsSeen: 4, completionRate: 80, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w39", firstName: "Jasmine", lastName: "Watkins", city: "Oakland", state: "CA", ageRange: "28–37", gender: "Female", incomeRange: "$85K–$120K", netWorth: "$140K–$280K", creditRating: "A", adsSeen: 7, completionRate: 91, productInterest: "Sunglasses", status: "hot" },
  { id: "w40", firstName: "Sebastien", lastName: "Morin", city: "Portland", state: "ME", ageRange: "30–39", gender: "Male", incomeRange: "$70K–$100K", netWorth: "$110K–$220K", creditRating: "B", adsSeen: 5, completionRate: 84, productInterest: "Prescription Frames", status: "warm" },
  { id: "w41", firstName: "Nadia", lastName: "Petrov", city: "Tampa", state: "FL", ageRange: "28–37", gender: "Female", incomeRange: "$75K–$105K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 6, completionRate: 87, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w42", firstName: "Tobias", lastName: "Schreiber", city: "Omaha", state: "NE", ageRange: "25–34", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$160K", creditRating: "B", adsSeen: 4, completionRate: 78, productInterest: "Sunglasses", status: "reached" },
  { id: "w43", firstName: "Keiko", lastName: "Yamamoto", city: "Honolulu", state: "HI", ageRange: "30–39", gender: "Female", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "A", adsSeen: 7, completionRate: 92, productInterest: "Prescription Frames", status: "hot" },
  { id: "w44", firstName: "Garrett", lastName: "Hines", city: "Albuquerque", state: "NM", ageRange: "28–37", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 5, completionRate: 83, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w45", firstName: "Valentina", lastName: "Cruz", city: "San Antonio", state: "TX", ageRange: "25–34", gender: "Female", incomeRange: "$65K–$90K", netWorth: "$80K–$170K", creditRating: "B", adsSeen: 5, completionRate: 85, productInterest: "Sunglasses", status: "warm" },
  { id: "w46", firstName: "Isaiah", lastName: "Brooks", city: "Louisville", state: "KY", ageRange: "28–37", gender: "Male", incomeRange: "$65K–$90K", netWorth: "$80K–$160K", creditRating: "B", adsSeen: 4, completionRate: 80, productInterest: "Prescription Frames", status: "warm" },
  { id: "w47", firstName: "Elise", lastName: "Marchand", city: "New York", state: "NY", ageRange: "30–39", gender: "Female", incomeRange: "$95K–$135K", netWorth: "$160K–$320K", creditRating: "A", adsSeen: 8, completionRate: 93, productInterest: "Blue Light Glasses", status: "hot" },
  { id: "w48", firstName: "Theo", lastName: "Johansson", city: "Minneapolis", state: "MN", ageRange: "25–34", gender: "Male", incomeRange: "$70K–$100K", netWorth: "$100K–$210K", creditRating: "B", adsSeen: 5, completionRate: 84, productInterest: "Sunglasses", status: "warm" },
  { id: "w49", firstName: "Monique", lastName: "Leblanc", city: "New Orleans", state: "LA", ageRange: "28–37", gender: "Female", incomeRange: "$70K–$100K", netWorth: "$110K–$220K", creditRating: "B", adsSeen: 6, completionRate: 87, productInterest: "Prescription Frames", status: "warm" },
  { id: "w50", firstName: "Adrian", lastName: "Kowalczyk", city: "Chicago", state: "IL", ageRange: "30–39", gender: "Male", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "A", adsSeen: 7, completionRate: 90, productInterest: "Blue Light Glasses", status: "hot" },
  { id: "w51", firstName: "Bianca", lastName: "Ferreira", city: "Miami", state: "FL", ageRange: "25–34", gender: "Female", incomeRange: "$70K–$100K", netWorth: "$100K–$210K", creditRating: "B", adsSeen: 5, completionRate: 85, productInterest: "Sunglasses", status: "warm" },
  { id: "w52", firstName: "Marcus", lastName: "Hendricks", city: "Atlanta", state: "GA", ageRange: "28–37", gender: "Male", incomeRange: "$75K–$110K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Prescription Frames", status: "warm" },
  { id: "w53", firstName: "Stella", lastName: "Novak", city: "Cleveland", state: "OH", ageRange: "30–39", gender: "Female", incomeRange: "$70K–$100K", netWorth: "$110K–$220K", creditRating: "B", adsSeen: 5, completionRate: 84, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w54", firstName: "Jonah", lastName: "Rubin", city: "Brooklyn", state: "NY", ageRange: "25–34", gender: "Male", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "A", adsSeen: 7, completionRate: 91, productInterest: "Sunglasses", status: "hot" },
  { id: "w55", firstName: "Marisol", lastName: "Espinoza", city: "Los Angeles", state: "CA", ageRange: "28–37", gender: "Female", incomeRange: "$75K–$105K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Prescription Frames", status: "warm" },
  { id: "w56", firstName: "Declan", lastName: "Murphy", city: "Boston", state: "MA", ageRange: "25–34", gender: "Male", incomeRange: "$75K–$110K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 5, completionRate: 83, productInterest: "Blue Light Glasses", status: "warm" },
  { id: "w57", firstName: "Nia", lastName: "Adeyemi", city: "Washington", state: "DC", ageRange: "30–39", gender: "Female", incomeRange: "$90K–$130K", netWorth: "$150K–$300K", creditRating: "A", adsSeen: 8, completionRate: 93, productInterest: "Sunglasses", status: "hot" },
  { id: "w58", firstName: "Colton", lastName: "Strickland", city: "Denver", state: "CO", ageRange: "28–37", gender: "Male", incomeRange: "$75K–$105K", netWorth: "$120K–$240K", creditRating: "B", adsSeen: 6, completionRate: 87, productInterest: "Prescription Frames", status: "warm" },
  { id: "w59", firstName: "Penelope", lastName: "Stafford", city: "Seattle", state: "WA", ageRange: "25–34", gender: "Female", incomeRange: "$85K–$120K", netWorth: "$140K–$280K", creditRating: "A", adsSeen: 7, completionRate: 91, productInterest: "Blue Light Glasses", status: "hot" },
  { id: "w60", firstName: "Micah", lastName: "Thornburg", city: "Austin", state: "TX", ageRange: "30–39", gender: "Male", incomeRange: "$80K–$115K", netWorth: "$130K–$260K", creditRating: "B", adsSeen: 6, completionRate: 88, productInterest: "Sunglasses", status: "warm" },
];
