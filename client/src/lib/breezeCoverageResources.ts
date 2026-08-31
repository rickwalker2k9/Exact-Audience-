export type BreezeCoverageResource = {
  provider: string;
  description: string;
  href: string;
  citySpecific?: boolean;
};

const NATIONAL_RESOURCES: BreezeCoverageResource[] = [
  {
    provider: "Guardian Life",
    description: "Income-protection overview for short- and long-term disability coverage.",
    href: "https://www.guardianlife.com/disability-insurance/income-protection",
  },
  {
    provider: "MassMutual",
    description: "Individual disability-income coverage information and professional support.",
    href: "https://www.massmutual.com/insurance/disability-income-insurance",
  },
  {
    provider: "The Standard",
    description: "Individual disability-income protection and coverage-gap planning.",
    href: "https://www.standard.com/individuals-families/personal-insurance-investments/individual-disability-insurance",
  },
  {
    provider: "Policygenius",
    description: "Disability-insurance comparison education and quote exploration.",
    href: "https://www.policygenius.com/disability-insurance/",
  },
  {
    provider: "Assurity",
    description: "Disability-income product education and policy-feature review.",
    href: "https://www.assurity.com/products/disability",
  },
];

const CITY_RESOURCES: Record<string, BreezeCoverageResource[]> = {
  austin: [
    {
      provider: "The Texas Insurance Broker",
      description: "Austin independent-agency option listing life and disability coverage.",
      href: "https://www.thetexasinsurancebroker.com/",
      citySpecific: true,
    },
    {
      provider: "Austin Area Insurance Agency",
      description: "Austin-area individual disability-insurance education and quote resource.",
      href: "https://www.austinareainsurance.com/disability-insurance.html",
      citySpecific: true,
    },
  ],
};

function hashLocation(city: string, recordOrdinal: number) {
  return Array.from(city.toLowerCase()).reduce((total, letter) => total + letter.charCodeAt(0), recordOrdinal);
}

export function getBreezeCoverageResources(city: string, recordOrdinal: number): BreezeCoverageResource[] {
  const local = CITY_RESOURCES[city.trim().toLowerCase()] ?? [];
  const start = hashLocation(city, recordOrdinal) % NATIONAL_RESOURCES.length;
  const rotated = [...NATIONAL_RESOURCES.slice(start), ...NATIONAL_RESOURCES.slice(0, start)];
  return [...local, ...rotated].slice(0, 4);
}
