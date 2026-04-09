from pathlib import Path
import re
from pypdf import PdfReader

pdf_path = Path(r"c:\Users\ganku\OneDrive\Desktop\Slides ce2 first Sem\Combined_Slides_-_Dr_Nofong_-_2019^programming_with_java.pdf")
out_path = Path("page_titles.txt")

reader = PdfReader(str(pdf_path))

noise = [
    "Course Lecturer: Vincent M. Nofong",
    "Programming with Java",
    "CE 277",
    "University of Mines and Technology",
    "Computer Science and Engineering Department",
]


def clean(line: str) -> str:
    line = line.replace("\r", " ")
    line = re.sub(r"\s+", " ", line).strip()
    return line

with out_path.open("w", encoding="utf-8") as f:
    current_header = None
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        lines = [clean(ln) for ln in text.split("\n")]
        lines = [ln for ln in lines if ln]

        # remove known footer/header noise
        filtered = []
        for ln in lines:
            if any(n in ln for n in noise):
                continue
            if re.fullmatch(r"[0-9]+", ln):
                continue
            if re.fullmatch(r"[.·\-_= ]+", ln):
                continue
            filtered.append(ln)

        title = filtered[0] if filtered else ""
        subtitle = ""
        for ln in filtered[1:10]:
            if ln != title:
                subtitle = ln
                break

        if title:
            if title != current_header:
                f.write(f"\n## {title}\n")
                current_header = title
            f.write(f"p{i}: {subtitle}\n")

print(f"Wrote page titles to {out_path.resolve()}")
