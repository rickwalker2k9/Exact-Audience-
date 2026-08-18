export type BreezeSupportedRecord = {
  ageRange: string;
  incomeRange: string;
  email: string;
  phone: string;
};

export function getBreezeSupportedDetailFields(record: BreezeSupportedRecord) {
  return [
    { label: "Age range", value: record.ageRange },
    { label: "Income range", value: record.incomeRange },
    { label: "Email", value: record.email },
    { label: "Phone", value: record.phone },
  ].filter(field => Boolean(field.value));
}
