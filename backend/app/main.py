# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
# Fix the imports to be relative to the app package
from .database.connection import get_db
from .database.models.exam import Exam
from pydantic import BaseModel

# Create the FastAPI application instance
app = FastAPI(title="Test Management System")


class ExamCreate(BaseModel):
    subject: str
    correct_answers: int
    incorrect_answers: int


@app.post("/exams/")
async def create_exam(
        exam_data: ExamCreate,
        db: Session = Depends(get_db)
):
    new_exam = Exam(
        subject=exam_data.subject,
        correct_answers=exam_data.correct_answers,
        incorrect_answers=exam_data.incorrect_answers,
        user_id=1  # We'll update this with real user authentication later
    )

    try:
        db.add(new_exam)
        db.commit()
        db.refresh(new_exam)
        return new_exam
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/exams/")
async def get_exams(db: Session = Depends(get_db)):
    exams = db.query(Exam).all()
    return exams


@app.get("/")
async def root():
    return {"message": "Welcome to Test Management System"}