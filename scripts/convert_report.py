from pathlib import Path
import sys

import markdown


def main() -> None:
    default_path = (
        r"C:\Users\DELL\OneDrive\Documents\pokemon\movieappfinal\Major_Project_Report_MovieApp.md"
    )
    md_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(default_path)
    html_path = md_path.with_suffix(".html")

    text = md_path.read_text(encoding="utf-8")
    body = markdown.markdown(text, extensions=["tables", "fenced_code"])

    html = f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Major Project Report - S-Show</title>
  <style>
    body {{
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      margin: 40px auto;
      max-width: 960px;
      padding: 0 20px;
      color: #1f2937;
    }}
    h1, h2, h3 {{
      color: #111827;
      margin-top: 1.2em;
    }}
    table {{
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }}
    th, td {{
      border: 1px solid #d1d5db;
      padding: 8px;
      text-align: left;
    }}
    code {{
      background: #f3f4f6;
      padding: 2px 4px;
      border-radius: 4px;
    }}
    hr {{
      margin: 24px 0;
    }}
    @media print {{
      body {{
        max-width: none;
        margin: 0;
        padding: 0 12mm;
        font-size: 12pt;
      }}
      h1 {{ font-size: 20pt; }}
      h2 {{ font-size: 16pt; }}
      h3 {{ font-size: 14pt; }}
    }}
  </style>
</head>
<body>
{body}
</body>
</html>
"""

    html_path.write_text(html, encoding="utf-8")
    print(f"Created: {html_path}")


if __name__ == "__main__":
    main()

