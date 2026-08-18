import csv
import io
import json
import urllib.parse
import urllib.request
from pathlib import Path

SHEET_ID = "14E8eR5vIKd-_rYc1XBtAfkGosz2SKXau5qOTrOjZI4I"
TABS = ["✅ VALID (Send These)", "⭐ VALID GOLD (Best)"]
EXACT_AUDIENCE_CSV = Path("/home/ubuntu/upload/LTDI_UNDER65_100KPLUS_PART_03.csv")


def normalize_email(value: str) -> str:
    return (value or "").strip().lower()


def normalize_text(value: str) -> str:
    return " ".join((value or "").strip().lower().split())


def approved_contacts() -> list[dict[str, str]]:
    contacts: list[dict[str, str]] = []
    for tab in TABS:
        url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={urllib.parse.quote(tab)}"
        with urllib.request.urlopen(url, timeout=30) as response:
            rows = list(csv.DictReader(io.TextIOWrapper(response, encoding="utf-8-sig")))
        for row in rows:
            if (row.get("ZB Status") or "").strip().lower() == "valid":
                email = normalize_email(row.get("PERS V EMAILS") or "")
                if email:
                    contacts.append({
                        "email": email,
                        "name": normalize_text(f"{row.get('FIRST NAME') or ''} {row.get('LAST NAME') or ''}"),
                        "location": normalize_text(f"{row.get('CITY') or ''} {row.get('ST') or ''}"),
                    })
    return contacts


def main() -> None:
    approved_contacts_list = approved_contacts()
    approved = {contact["email"] for contact in approved_contacts_list}
    approved_name_locations = {(contact["name"], contact["location"]) for contact in approved_contacts_list if contact["name"] and contact["location"]}
    approved_names = {contact["name"] for contact in approved_contacts_list if contact["name"]}
    exact_emails: set[str] = set()
    exact_with_phone: set[str] = set()
    exact_with_income: set[str] = set()
    exact_with_age: set[str] = set()
    exact_name_locations: set[tuple[str, str]] = set()
    exact_names: set[str] = set()

    with EXACT_AUDIENCE_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            email = normalize_email(row.get("Personal Verified Emails") or "")
            if not email:
                email = ""
            if email:
                exact_emails.add(email)
                if (row.get("Skiptrace Wireless Numbers") or "").strip():
                    exact_with_phone.add(email)
                if (row.get("Income Range") or "").strip():
                    exact_with_income.add(email)
                if (row.get("Age Range") or "").strip():
                    exact_with_age.add(email)
            name = normalize_text(f"{row.get('First Name') or ''} {row.get('Last Name') or ''}")
            location = normalize_text(f"{row.get('Personal City') or ''} {row.get('Personal State') or ''}")
            if name:
                exact_names.add(name)
            if name and location:
                exact_name_locations.add((name, location))

    matched = approved & exact_emails
    print(json.dumps({
        "approved_email_count": len(approved),
        "exact_audience_email_count": len(exact_emails),
        "exact_email_match_count": len(matched),
        "matched_with_phone_count": len(matched & exact_with_phone),
        "matched_with_income_count": len(matched & exact_with_income),
        "matched_with_age_count": len(matched & exact_with_age),
        "exact_name_and_location_match_count": len(approved_name_locations & exact_name_locations),
        "exact_name_match_count": len(approved_names & exact_names),
    }, indent=2))


if __name__ == "__main__":
    main()
