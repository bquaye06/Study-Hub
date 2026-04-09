from pathlib import Path
import re
from pypdf import PdfReader

pdf_path = Path(r"c:\Users\ganku\OneDrive\Desktop\Slides ce2 first Sem\Combined_Slides_-_Dr_Nofong_-_2019^programming_with_java.pdf")
out_path = Path("pdf_outline.txt")

reader = PdfReader(str(pdf_path))

sample_pages = set([1, 2, 3, 4, 5, 10, 15, 20, 23, 24, 30, 40, 50, 60, 64, 65, 70, 80, 90, 98, 99, 110, 120, 130, 140, 150, 170, 190, 210, 230, 250, 270, len(reader.pages)])

with out_path.open("w", encoding="utf-8") as f:
    f.write(f"Total pages: {len(reader.pages)}\n\n")
    for i, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").replace("\r", "\n")
        lines = [re.sub(r"\s+", " ", ln).strip() for ln in text.split("\n")]
        lines = [ln for ln in lines if ln]

        heading_candidates = []
        for ln in lines[:18]:
            if 3 <= len(ln) <= 90 and not re.fullmatch(r"[.·\-_= ]+", ln):
                heading_candidates.append(ln)

        if i in sample_pages:
            f.write(f"===== PAGE {i} =====\n")
            for ln in heading_candidates[:12]:
                f.write(ln + "\n")
            f.write("\n")

print(f"Wrote outline to {out_path.resolve()}")
