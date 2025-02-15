from pypdf import PdfReader

def input_pdf_text(filepath):
    reader = PdfReader(filepath)
    text = "".join([page.extract_text() for page in reader.pages])
    return text