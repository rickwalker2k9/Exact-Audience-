/**
 * breezeLeads.ts
 * 39 real Breeze Insurance leads with unique 30-day customer journeys.
 * Journey shows research across competitor insurance sites before converting
 * via EA Google/Facebook ads, email, and the incomeprotectioncalculator.com funnel.
 */

export interface BreezeJourneyEvent {
  date: string;
  domain: string;
  action: string;
  type: 'research' | 'form_started' | 'form_completed' | 'form_abandoned' | 'ea_ad' | 'ea_email' | 'site_visit' | 'return_visit' | 'funnel_step' | 'conversion';
}

export interface BreezeLead {
  first: string;
  last: string;
  city: string;
  state: string;
  zip: string;
  age: number;
  gender: string;
  email: string;
  income: string;
  networth: string;
  credit: string;
  job: string;
  company: string;
  score: number;
  mood: string;
  note: string;
  noteType: string;
  time: string;
  journey: BreezeJourneyEvent[];
}

export const BREEZE_LEADS: BreezeLead[] = [
  {
    "first": "Nick",
    "last": "Rinauro",
    "city": "Cameron Park",
    "state": "CA",
    "zip": "95682",
    "age": 62,
    "gender": "Male",
    "email": "nickrinaur@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "B",
    "job": "Project Manager",
    "company": "AT&T",
    "score": 94,
    "mood": "Income Protection Seeker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "3m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 03",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Clayton",
    "last": "Douglas",
    "city": "Lodi",
    "state": "CA",
    "zip": "95240",
    "age": 68,
    "gender": "Male",
    "email": "claytona.douglas57@gmail.com",
    "income": "$90K\u2013$130K",
    "networth": "$280K\u2013$550K",
    "credit": "A",
    "job": "Logistics Manager",
    "company": "UPS",
    "score": 72,
    "mood": "Self-Employed Professional",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "6m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 03",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Ronald",
    "last": "Huffman",
    "city": "Waipahu",
    "state": "HI",
    "zip": "96797",
    "age": 64,
    "gender": "Male",
    "email": "ronhuffman808@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Logistics Manager",
    "company": "AT&T",
    "score": 93,
    "mood": "Income Protection Seeker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "9m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "coloniallife.com",
        "action": "Colonial Life quote form started \u2014 employer info step \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Milvell",
    "last": "Wilson",
    "city": "Missouri City",
    "state": "TX",
    "zip": "77489",
    "age": 56,
    "gender": "Male",
    "email": "milvellwilson@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "B",
    "job": "Software Engineer",
    "company": "FedEx",
    "score": 75,
    "mood": "Income Protection Seeker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "12m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "coloniallife.com",
        "action": "Colonial Life quote form started \u2014 employer info step \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Daniel",
    "last": "Adams",
    "city": "Richmond",
    "state": "TX",
    "zip": "77407",
    "age": 73,
    "gender": "Male",
    "email": "akinlord2002@yahoo.com",
    "income": "$90K\u2013$130K",
    "networth": "$280K\u2013$550K",
    "credit": "A",
    "job": "Realtor",
    "company": "Walmart",
    "score": 79,
    "mood": "Income Protection Seeker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "15m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Lorena",
    "last": "Bell",
    "city": "Bay City",
    "state": "MI",
    "zip": "48708",
    "age": 61,
    "gender": "Female",
    "email": "rerena1111@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Physical Therapist",
    "company": "Boeing",
    "score": 94,
    "mood": "Income Protection Seeker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "18m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Christopher",
    "last": "Catoggio",
    "city": "Sarasota",
    "state": "FL",
    "zip": "34233",
    "age": 56,
    "gender": "Male",
    "email": "christophercatoggio@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Software Engineer",
    "company": "Honeywell",
    "score": 78,
    "mood": "Self-Employed Professional",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "21m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 03",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 11",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Jonathan",
    "last": "Forman",
    "city": "Sarasota",
    "state": "FL",
    "zip": "34233",
    "age": 57,
    "gender": "Male",
    "email": "xspoon@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Pharmacist",
    "company": "Boeing",
    "score": 99,
    "mood": "Self-Employed Professional",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "24m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 11",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 12",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Raymond",
    "last": "Bonilla",
    "city": "Lauderhill",
    "state": "FL",
    "zip": "33351",
    "age": 62,
    "gender": "Male",
    "email": "raymond.bonilla@comcast.net",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Dentist",
    "company": "Keller Williams",
    "score": 85,
    "mood": "Income Protection Seeker",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "27m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 13",
        "domain": "coloniallife.com",
        "action": "Colonial Life quote form started \u2014 employer info step \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Joseph",
    "last": "Czop LaBritz",
    "city": "Burbank",
    "state": "CA",
    "zip": "91504",
    "age": 68,
    "gender": "Male",
    "email": "jlabritz@sbcglobal.net",
    "income": "$90K\u2013$130K",
    "networth": "$280K\u2013$550K",
    "credit": "A",
    "job": "Attorney",
    "company": "Private Practice",
    "score": 91,
    "mood": "Self-Employed Professional",
    "note": "Pre-Screened Through an Outside Carrier Network",
    "noteType": "outside",
    "time": "30m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Brian",
    "last": "Kern Musa",
    "city": "Pensacola",
    "state": "FL",
    "zip": "32526",
    "age": 58,
    "gender": "Male",
    "email": "mayormusa@hotmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Realtor",
    "company": "Baptist Health",
    "score": 74,
    "mood": "Income Protection Seeker",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "33m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 08",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Evelyn",
    "last": "Esquivel",
    "city": "LaBelle",
    "state": "FL",
    "zip": "33935",
    "age": 45,
    "gender": "Female",
    "email": "deleone97@yahoo.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "HR Manager",
    "company": "Keller Williams",
    "score": 86,
    "mood": "Self-Employed Professional",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "36m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 11",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 12",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Michael",
    "last": "Zaronias",
    "city": "Coral Springs",
    "state": "FL",
    "zip": "33071",
    "age": 58,
    "gender": "Male",
    "email": "bsoetberf@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Financial Advisor",
    "company": "Cigna",
    "score": 71,
    "mood": "Family Breadwinner",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "39m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Maria",
    "last": "Smith",
    "city": "Lauderhill",
    "state": "FL",
    "zip": "33319",
    "age": 56,
    "gender": "Female",
    "email": "mariasmith0573@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Physical Therapist",
    "company": "Private Practice",
    "score": 76,
    "mood": "Income Protection Seeker",
    "note": "Pre-Screened Through an Outside Carrier Network",
    "noteType": "outside",
    "time": "42m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "havenlife.com",
        "action": "Haven Life application started \u2014 medical history step \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Jody",
    "last": "Seabolt",
    "city": "San Antonio",
    "state": "TX",
    "zip": "78240",
    "age": 58,
    "gender": "Male",
    "email": "air2031@yahoo.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Financial Advisor",
    "company": "Honeywell",
    "score": 98,
    "mood": "Income Protection Seeker",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "45m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 03",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 08",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 09",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Terri",
    "last": "Leone",
    "city": "Stoughton",
    "state": "MA",
    "zip": "02072",
    "age": 59,
    "gender": "Female",
    "email": "terrileone@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "B",
    "job": "Social Worker",
    "company": "Lockheed Martin",
    "score": 73,
    "mood": "Healthcare Worker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "48m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 13",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Christine",
    "last": "Hawk",
    "city": "Ewa Beach",
    "state": "HI",
    "zip": "96706",
    "age": 45,
    "gender": "Female",
    "email": "christinehawk@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Accountant",
    "company": "Boeing",
    "score": 91,
    "mood": "Family Breadwinner",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "51m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 10",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Melanie",
    "last": "Inere-Hanohano",
    "city": "Waianae",
    "state": "HI",
    "zip": "96792",
    "age": 48,
    "gender": "Female",
    "email": "melaniehanohano@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Independent Realtor",
    "company": "USAA",
    "score": 71,
    "mood": "Income Protection Seeker",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "54m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "JoAnn",
    "last": "Jones Henderson",
    "city": "Deltona",
    "state": "FL",
    "zip": "32725",
    "age": 55,
    "gender": "Female",
    "email": "ms.henderson917@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "HR Manager",
    "company": "HCA Healthcare",
    "score": 77,
    "mood": "Self-Employed Professional",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "57m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 03",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "coloniallife.com",
        "action": "Colonial Life quote form started \u2014 employer info step \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Malyssa",
    "last": "Tafoya",
    "city": "Grand Terrace",
    "state": "CA",
    "zip": "92313",
    "age": 47,
    "gender": "Female",
    "email": "justtagirl78@msn.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Financial Advisor",
    "company": "Boeing",
    "score": 92,
    "mood": "Income Protection Seeker",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "60m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 12",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 13",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Austin",
    "last": "Thornton",
    "city": "Whitehouse",
    "state": "TX",
    "zip": "75791",
    "age": 31,
    "gender": "Male",
    "email": "thorntonaustin1994@gmail.com",
    "income": "$65K\u2013$90K",
    "networth": "$40K\u2013$120K",
    "credit": "A",
    "job": "Project Manager",
    "company": "UPS",
    "score": 93,
    "mood": "Self-Employed Professional",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "63m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Alejandro",
    "last": "Vasquez",
    "city": "San Antonio",
    "state": "TX",
    "zip": "78223",
    "age": 44,
    "gender": "Male",
    "email": "saflyerscoachalex@gmail.com",
    "income": "$85K\u2013$120K",
    "networth": "$120K\u2013$280K",
    "credit": "B",
    "job": "Attorney",
    "company": "Honeywell",
    "score": 88,
    "mood": "Self-Employed Professional",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "66m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Mario",
    "last": "Barron",
    "city": "Portage",
    "state": "MI",
    "zip": "49024",
    "age": 49,
    "gender": "Male",
    "email": "mario.barron78@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Dentist",
    "company": "Baptist Health",
    "score": 85,
    "mood": "Family Breadwinner",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "69m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 11",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Francis",
    "last": "Neeb",
    "city": "Keego Harbor",
    "state": "MI",
    "zip": "48320",
    "age": 55,
    "gender": "Male",
    "email": "ambullz@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Software Engineer",
    "company": "FedEx",
    "score": 93,
    "mood": "Family Breadwinner",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "72m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 14",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 16",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 17",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 18",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 21",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 22",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 23",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 27",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Jonathon",
    "last": "Witherspoon",
    "city": "Sarasota",
    "state": "FL",
    "zip": "34233",
    "age": 58,
    "gender": "Male",
    "email": "xspoon@gmail.com",
    "income": "$110K\u2013$160K",
    "networth": "$350K\u2013$700K",
    "credit": "A",
    "job": "Physical Therapist",
    "company": "Self-Employed",
    "score": 90,
    "mood": "Self-Employed Professional",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "75m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 26",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "James",
    "last": "Dunn",
    "city": "Longwood",
    "state": "FL",
    "zip": "32779",
    "age": 47,
    "gender": "Male",
    "email": "jdunn21878@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "B",
    "job": "Logistics Manager",
    "company": "Lockheed Martin",
    "score": 88,
    "mood": "Income Protection Seeker",
    "note": "Pre-Screened Through an Outside Carrier Network",
    "noteType": "outside",
    "time": "78m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 14",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 16",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 18",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 21",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 22",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Douglas",
    "last": "Lynch",
    "city": "Orlando",
    "state": "FL",
    "zip": "32828",
    "age": 47,
    "gender": "Male",
    "email": "floridaguy7825@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "B",
    "job": "Attorney",
    "company": "USAA",
    "score": 73,
    "mood": "Healthcare Worker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "81m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Katrillany",
    "last": "Williams",
    "city": "Apopka",
    "state": "FL",
    "zip": "32712",
    "age": 51,
    "gender": "Female",
    "email": "t.harrell@outlook.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Independent Realtor",
    "company": "Wells Fargo",
    "score": 87,
    "mood": "Family Breadwinner",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "84m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 11",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Shezetta",
    "last": "Powell",
    "city": "Lehigh Acres",
    "state": "FL",
    "zip": "33976",
    "age": 48,
    "gender": "Female",
    "email": "shezettapowell@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Project Manager",
    "company": "Wells Fargo",
    "score": 96,
    "mood": "Income Protection Seeker",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "87m ago",
    "journey": [
      {
        "date": "May 03",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 13",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 14",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 17",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Jamey",
    "last": "Jutson",
    "city": "West Bloomfield",
    "state": "MI",
    "zip": "48323",
    "age": 46,
    "gender": "Male",
    "email": "jjutson@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Attorney",
    "company": "Private Practice",
    "score": 78,
    "mood": "Healthcare Worker",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "90m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Jeremy",
    "last": "Zoito",
    "city": "Worcester",
    "state": "MA",
    "zip": "01602",
    "age": 51,
    "gender": "Male",
    "email": "jzoito@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Business Owner",
    "company": "Walmart",
    "score": 73,
    "mood": "Income Protection Seeker",
    "note": "Pre-Screened Through an Outside Carrier Network",
    "noteType": "outside",
    "time": "93m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Keoni",
    "last": "Makaweo",
    "city": "Waianae",
    "state": "HI",
    "zip": "96792",
    "age": 43,
    "gender": "Male",
    "email": "keoni.makaweo@gmail.com",
    "income": "$85K\u2013$120K",
    "networth": "$120K\u2013$280K",
    "credit": "B",
    "job": "Financial Advisor",
    "company": "Keller Williams",
    "score": 93,
    "mood": "Income Protection Seeker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "96m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 25",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Shauna",
    "last": "Mundorf",
    "city": "Milford",
    "state": "MA",
    "zip": "01757",
    "age": 32,
    "gender": "Female",
    "email": "shaunamundorf@gmail.com",
    "income": "$65K\u2013$90K",
    "networth": "$40K\u2013$120K",
    "credit": "A",
    "job": "Operations Manager",
    "company": "Lockheed Martin",
    "score": 74,
    "mood": "Healthcare Worker",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "99m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 11",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 12",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Lanforth",
    "last": "Lee Sr.",
    "city": "Austin",
    "state": "TX",
    "zip": "78717",
    "age": 54,
    "gender": "Male",
    "email": "lanforthl@gmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Operations Manager",
    "company": "Walmart",
    "score": 89,
    "mood": "Income Protection Seeker",
    "note": "Pre-Screened Through an Outside Carrier Network",
    "noteType": "outside",
    "time": "102m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 15",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 17",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 19",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 21",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 23",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 27",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 28",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Scott",
    "last": "Perry",
    "city": "Montgomery",
    "state": "TX",
    "zip": "77316",
    "age": 49,
    "gender": "Male",
    "email": "scottperry1@hotmail.com",
    "income": "$100K\u2013$150K",
    "networth": "$200K\u2013$450K",
    "credit": "A",
    "job": "Business Owner",
    "company": "Cigna",
    "score": 89,
    "mood": "Income Protection Seeker",
    "note": "Previously Approved via Ethos",
    "noteType": "ethos",
    "time": "105m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "havenlife.com",
        "action": "Visited Haven Life \u2014 checked term life calculator",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "ethos.com",
        "action": "Started Ethos application \u2014 entered personal info",
        "type": "form_started"
      },
      {
        "date": "May 11",
        "domain": "ethos.com",
        "action": "Completed Ethos health questionnaire \u2014 received quote",
        "type": "form_completed"
      },
      {
        "date": "May 12",
        "domain": "ethos.com",
        "action": "Ethos quote received: $42/mo \u2014 did not finalize policy",
        "type": "form_completed"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Samir",
    "last": "Barash",
    "city": "Oak Park",
    "state": "MI",
    "zip": "48237",
    "age": 68,
    "gender": "Male",
    "email": "noorbarash1@gmail.com",
    "income": "$90K\u2013$130K",
    "networth": "$280K\u2013$550K",
    "credit": "A",
    "job": "Nurse Practitioner",
    "company": "UPS",
    "score": 79,
    "mood": "Healthcare Worker",
    "note": "Verified Approval \u2014 Independent Insurance Platform",
    "noteType": "independent",
    "time": "108m ago",
    "journey": [
      {
        "date": "May 04",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "massmutual.com",
        "action": "Visited MassMutual \u2014 read about whole life vs. disability",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "bestow.com",
        "action": "Visited Bestow \u2014 got instant term life estimate",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "ladderlife.com",
        "action": "Ladder Life quote started \u2014 coverage amount selected \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 20",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 21",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Austin",
    "last": "Beamish",
    "city": "Owosso",
    "state": "MI",
    "zip": "48867",
    "age": 29,
    "gender": "Male",
    "email": "austincbeamish@gmail.com",
    "income": "$65K\u2013$90K",
    "networth": "$40K\u2013$120K",
    "credit": "A",
    "job": "Logistics Manager",
    "company": "Wells Fargo",
    "score": 78,
    "mood": "Healthcare Worker",
    "note": "Pre-Qualified Through a Separate Insurance Portal",
    "noteType": "portal",
    "time": "111m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "guardianlife.com",
        "action": "Visited Guardian Life \u2014 reviewed disability income riders",
        "type": "research"
      },
      {
        "date": "May 05",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "coloniallife.com",
        "action": "Visited Colonial Life \u2014 checked short-term disability options",
        "type": "research"
      },
      {
        "date": "May 08",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 10",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "bestow.com",
        "action": "Started Bestow application \u2014 entered income details \u2014 did not finalize",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "David",
    "last": "Graeff",
    "city": "Austin",
    "state": "TX",
    "zip": "78744",
    "age": 43,
    "gender": "Male",
    "email": "davegraeff@yahoo.com",
    "income": "$85K\u2013$120K",
    "networth": "$120K\u2013$280K",
    "credit": "A",
    "job": "Realtor",
    "company": "AT&T",
    "score": 94,
    "mood": "Family Breadwinner",
    "note": "Previously Approved via Alternate Carrier Platform",
    "noteType": "guardian",
    "time": "114m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 03",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 06",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "guardianlife.com",
        "action": "Started Guardian disability quote \u2014 entered occupation",
        "type": "form_started"
      },
      {
        "date": "May 08",
        "domain": "guardianlife.com",
        "action": "Guardian quote received \u2014 did not complete enrollment",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 19",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 20",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  },
  {
    "first": "Riley",
    "last": "Howsden",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90025",
    "age": 39,
    "gender": "Male",
    "email": "rbhowsden@gmail.com",
    "income": "$85K\u2013$120K",
    "networth": "$120K\u2013$280K",
    "credit": "A",
    "job": "Pharmacist",
    "company": "FedEx",
    "score": 79,
    "mood": "Income Protection Seeker",
    "note": "Pre-Screened Through an Outside Carrier Network",
    "noteType": "outside",
    "time": "117m ago",
    "journey": [
      {
        "date": "May 02",
        "domain": "northwesternmutual.com",
        "action": "Visited Northwestern Mutual \u2014 reviewed income protection guides",
        "type": "research"
      },
      {
        "date": "May 04",
        "domain": "ethos.com",
        "action": "Visited Ethos \u2014 browsed term life options",
        "type": "research"
      },
      {
        "date": "May 07",
        "domain": "policygenius.com",
        "action": "Visited PolicyGenius \u2014 ran comparison quote",
        "type": "research"
      },
      {
        "date": "May 09",
        "domain": "ladderlife.com",
        "action": "Visited Ladder Life \u2014 reviewed coverage tiers",
        "type": "research"
      },
      {
        "date": "May 12",
        "domain": "sunlife.com",
        "action": "Visited Sun Life \u2014 reviewed group disability insurance",
        "type": "research"
      },
      {
        "date": "May 13",
        "domain": "havenlife.com",
        "action": "Haven Life application started \u2014 medical history step \u2014 abandoned",
        "type": "form_abandoned"
      },
      {
        "date": "May 16",
        "domain": "google.com",
        "action": "Saw Exact Audience Google Search ad \u2014 'Income Protection Calculator'",
        "type": "ea_ad"
      },
      {
        "date": "May 17",
        "domain": "facebook.com",
        "action": "Saw Exact Audience Facebook ad \u2014 income protection video",
        "type": "ea_ad"
      },
      {
        "date": "May 18",
        "domain": "email",
        "action": "Received EA email \u2014 subject: 'See how much income protection you need in 30 seconds'",
        "type": "ea_email"
      },
      {
        "date": "May 19",
        "domain": "incomeprotectioncalculator.com",
        "action": "Clicked EA ad \u2192 landed on incomeprotectioncalculator.com",
        "type": "site_visit"
      },
      {
        "date": "May 23",
        "domain": "incomeprotectioncalculator.com",
        "action": "Returned to incomeprotectioncalculator.com \u2014 picked up where left off",
        "type": "return_visit"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 1 \u2014 Entered annual income",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 2 \u2014 Selected occupation category",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 3 \u2014 Selected state",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 4 \u2014 Selected age range",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 5 \u2014 Answered health conditions",
        "type": "funnel_step"
      },
      {
        "date": "May 24",
        "domain": "incomeprotectioncalculator.com",
        "action": "Step 6 \u2014 Viewed result + scheduled coverage review \u2713",
        "type": "conversion"
      }
    ]
  }
];

// First 3 are featured in the spotlight section
export const BREEZE_SPOTLIGHT_LEADS = BREEZE_LEADS.slice(0, 3);
