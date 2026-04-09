from pathlib import Path
from pypdf import PdfReader
import re

pdf_path = Path(r"c:\Users\ganku\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm\LocalState\sessions\0B96DE7C5E7755DBA41168714A8CE4A4C91E1D07\transfers\2026-15\Exams_April_2025__ce__set_2_^programming_with_java.pdf")
out_path = Path("exams_pdf_text.txt")

reader = PdfReader(str(pdf_path))
with out_path.open("w", encoding="utf-8") as f:
    f.write(f"Total pages: {len(reader.pages)}\n")
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        text = text.replace("\r", "\n")
        text = re.sub(r"\n{3,}", "\n\n", text)
        f.write(f"\n\n===== PAGE {i} =====\n")
        f.write(text)

print(f"Wrote {out_path.resolve()}")
