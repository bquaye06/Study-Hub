from pathlib import Path
from pypdf import PdfReader

pdf_path = Path(r"c:\Users\ganku\OneDrive\Desktop\Slides ce2 first Sem\Combined_Slides_-_Dr_Nofong_-_2019^programming_with_java.pdf")
out_path = Path("pdf_extracted.txt")

if not pdf_path.exists():
    raise FileNotFoundError(f"PDF not found: {pdf_path}")

reader = PdfReader(str(pdf_path))

with out_path.open("w", encoding="utf-8") as f:
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        f.write(f"\n\n===== PAGE {i} =====\n")
        f.write(text)

print(f"Extracted {len(reader.pages)} pages to {out_path.resolve()}")
