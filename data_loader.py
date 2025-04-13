import os
import fitz  # PyMuPDF

def extract_text_from_pdfs(pdf_folder: str):
    all_text = []
    for filename in os.listdir(pdf_folder):
        if filename.endswith(".pdf"):
            filepath = os.path.join(pdf_folder, filename)
            doc = fitz.open(filepath)
            text = ""
            for page in doc:
                text += page.get_text()
            all_text.append(text)
            print(f"Extracted text from {filename} is {all_text}")
    return all_text
