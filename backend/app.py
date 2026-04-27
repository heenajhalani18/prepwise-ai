from fastapi import FastAPI, File, UploadFile
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware
from services.resume_parser import extract_text_from_pdf
from services.skill_extractor import extract_skills
from services.question_generator import generate_questions
from services.project_extractor import extract_projects
from services.answer_evaluator import evaluate_answer
from models import AnswerRequest
from database import interviews_collection
from datetime import datetime
import uuid

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_FOLDER = "uploads"

@app.get("/")
def home():
    return {"message": "PrepWise AI backend running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)

    skills = extract_skills(extracted_text)

    projects = extract_projects(extracted_text)

    questions = generate_questions(skills, projects)
    session_id = str(uuid.uuid4())
    return {
    "filename": file.filename,
    "skills": skills,
    "projects": projects,
    "questions": questions,
    "session_id": session_id
}
@app.post("/evaluate-answer")
def evaluate_user_answer(request: AnswerRequest):
    result = evaluate_answer(request.answer)

    interview_data = {
    "email": request.email,
    "answer": request.answer,
    "score": result["score"],
    "feedback": result["feedback"],
    "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M")
}

    interviews_collection.insert_one(interview_data)

    return {
        "user_answer": request.answer,
        "evaluation": result
    }
@app.get("/history")
def get_interview_history(email: str):
    interviews_collection.find({"email": email})
    history = []

    for item in interviews_collection.find():
        history.append({
    "answer": item["answer"],
    "score": item["score"],
    "feedback": item["feedback"],
    "timestamp": item["timestamp"]
})

    return {
        "history": history
    }