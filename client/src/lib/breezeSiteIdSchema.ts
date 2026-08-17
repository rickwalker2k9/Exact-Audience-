export const BREEZE_SITEID_FIELD_GROUPS = [
  { label: "Visit event", fields: ["Timestamp", "Referrer", "URL", "Events"] },
  { label: "Identity & address", fields: ["First Name", "Last Name", "Address", "City", "ST", "ZIP", "ZIP4"] },
  { label: "Household & wealth", fields: ["Age Range", "Children", "Gender", "Homeowner", "Married", "Net Worth", "Income Range"] },
  { label: "Contact", fields: ["Landlines", "Landline DNC", "Mobile", "Mobile DNC", "Pers Emails", "Pers V Emails"] },
  { label: "Professional", fields: ["Co Name", "Employees", "Domain", "Co Address", "Co City", "Co State", "Co ZIP", "Co Phone", "Rev", "Industry"] },
  { label: "Work profile", fields: ["Bus Email", "Bus V Emails", "Job Title", "Department", "Seniority", "Edu", "Co LinkedIn", "Pers LinkedIn", "Skills", "Interests", "SHA256"] },
] as const;

export const BREEZE_JOURNEY_STAGES = [
  "Exact Audience behavior-based list",
  "Google Ads and Meta Ads served to the list",
  "Google or Meta engagement response",
  "Website visitor event from SiteID pixel",
  "Breeze affiliate quote link — conversion data unavailable",
] as const;
