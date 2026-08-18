import csv
import io
import json
import urllib.parse
import urllib.request

SHEET_ID = "1nLtk8hlQSEycemcEsg1yY8q5nZ9-tfEH9TauGX2Bi_M"
SHEET_NAME = "LTDI_UNDER65_100KPLUS 0826"
PROFILE_FIELDS = [
    "FIRST NAME", "LAST NAME", "PERS V EMAILS", "MOBILE", "AGE RANGE",
    "INCOME RANGE", "PERSONAL CITY", "PERSONAL STATE", "CITY", "ST",
    "SKIPTRACE WIRELESS NUMBERS", "PERSONAL VERIFIED EMAILS",
]


def normalize(value: str) -> str:
    return " ".join((value or "").strip().upper().split())


def main() -> None:
    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={urllib.parse.quote(SHEET_NAME)}"
    with urllib.request.urlopen(url, timeout=60) as response:
        rows = list(csv.DictReader(io.TextIOWrapper(response, encoding="utf-8-sig")))

    headers = list(rows[0].keys()) if rows else []
    normalized_headers = {normalize(header): header for header in headers}
    available_profile_fields = {field: normalized_headers[field] for field in PROFILE_FIELDS if field in normalized_headers}
    populated_counts = {
        field: sum(1 for row in rows if (row.get(actual_header) or "").strip())
        for field, actual_header in available_profile_fields.items()
    }
    print(json.dumps({
        "sheet_name": SHEET_NAME,
        "record_count": len(rows),
        "header_count": len(headers),
        "headers": headers,
        "available_profile_fields": available_profile_fields,
        "populated_profile_counts": populated_counts,
    }, indent=2))


if __name__ == "__main__":
    main()
