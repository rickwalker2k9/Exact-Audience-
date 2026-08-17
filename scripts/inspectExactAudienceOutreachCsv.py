import csv
from pathlib import Path

CSV_PATH = Path("/home/ubuntu/upload/LTDI_UNDER65_100KPLUS_PART_03.csv")


def main() -> None:
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        headers = reader.fieldnames or []
        rows = list(reader)

    nonempty_email_fields = [
        header for header in headers if "email" in header.lower()
    ]
    rows_with_email = sum(
        any((row.get(header) or "").strip() for header in nonempty_email_fields)
        for row in rows
    )

    print(f"rows={len(rows)}")
    print(f"headers={headers}")
    print(f"email_columns={nonempty_email_fields}")
    print(f"rows_with_email={rows_with_email}")


if __name__ == "__main__":
    main()
