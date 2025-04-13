from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import google.generativeai as genai
from dotenv import load_dotenv
from data_loader import extract_text_from_pdfs
from vector_store import RAGVectorStore

app = FastAPI()

# Allow requests from React (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load env variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Build Vector Store
store = RAGVectorStore()

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    # Ensure pdfs directory exists
    print(f"Received file: {file.filename}")  # Log file name for debugging

    os.makedirs("pdfs", exist_ok=True)

    file_location = f"pdfs/{file.filename}"
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Extract text and build index
    docs = extract_text_from_pdfs("pdfs/")
    store.build_index(docs)
    return {"message": f"Uploaded and indexed {file.filename}"}

@app.post("/generateQuiz/")
async def generate_quiz(query: str = Form(...)):
    relevant_chunks = store.retrieve(query)
    context = "\n\n".join(relevant_chunks)

    prompt = f"""You're a quiz generator. Based on the following context, generate a quiz with questions and four options each. Also include the correct answer.

    Context:
    {context}

    Topic:
    {query}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return {"answer": response.text.strip()}


@app.post("/prepareReport/")
async def prepare_report(query: str = Form(...)):
    relevant_chunks = store.retrieve(query)
    context = "\n\n".join(relevant_chunks)

    prompt = f"""Create a structured academic-style report based on the following information.

    Context:
    {context}

    Report Topic:
    {query}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return {"answer": response.text.strip()}


@app.post("/think/")
async def think_deep(query: str = Form(...)):
    relevant_chunks = store.retrieve(query)
    context = "\n\n".join(relevant_chunks)

    prompt = f"""Think deeply and reflectively about the topic below, based on the provided context. Provide insights and deeper understanding.

    Context:
    {context}

    Topic:
    {query}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return {"answer": response.text.strip()}


@app.post("/image-gen/")
async def image_gen(query: str = Form(...)):
    prompt = f"""Generate a descriptive prompt that can be used to create an AI-generated image for the topic below:

    Topic:
    {query}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return {"answer": response.text.strip()}


@app.post("/ask/")
async def ask_question(query: str = Form(...)):
    # Retrieve chunks
    relevant_chunks = store.retrieve(query)
    context = "\n\n".join(relevant_chunks)

    # Generate answer
    prompt = f"""You are a helpful assistant. Use the context below to answer the question.

    Context:
    {context}

    Question:
    {query}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return {"answer": response.text.strip()}
