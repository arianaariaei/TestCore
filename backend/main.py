from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from database import get_db, init_db
from models.exam import Exam
from models.user import User
from models.subject import Subject
from models.user_exam import user_exams
from schemas import UserCreate, LoginRequest, SubjectCreate, ExamCreate, ExamUpdate

init_db()
app = FastAPI(title="Test Management System")

# JWT and Auth configurations
SECRET_KEY = "testcore_secret_key_very_mysterious"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Auth Helper Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception @ app.post("/register")


async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, email=user.email, password=hashed_password, is_admin=user.is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}


@app.post("/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not pwd_context.verify(login_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}




# 2. Subject Management APIs
@app.post("/subjects/", response_model=dict)
async def create_subject(
        subject: SubjectCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    db_subject = Subject(title=subject.title)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return {"message": "Subject created successfully", "subject": db_subject}


@app.get("/subjects/")
async def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()


# 3. Exam Management APIs
@app.post("/exams/")
async def create_exam(
        exam: ExamCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_exam = Exam(
        title=exam.title,
        subject_id=exam.subject_id,
        correct_answers=exam.correct_answers,
        wrong_answers=exam.wrong_answers
    )
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)

    # Create user-exam relationship
    stmt = user_exams.insert().values(user_id=current_user.user_id, exam_id=db_exam.exam_id)
    db.execute(stmt)
    db.commit()

    return db_exam


@app.put("/exams/{exam_id}")
async def update_exam_results(
        exam_id: int,
        exam_update: ExamUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    # Verify user has access to this exam
    user_exam = db.query(user_exams).filter_by(user_id=current_user.user_id, exam_id=exam_id).first()
    if not user_exam and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access denied")

    exam.correct_answers = exam_update.correct_answers
    exam.wrong_answers = exam_update.wrong_answers
    db.commit()
    return {"message": "Exam results updated successfully"}


@app.get("/exams/")
async def get_user_exams(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if current_user.is_admin:
        return db.query(Exam).all()
    return db.query(Exam).join(user_exams).filter(user_exams.c.user_id == current_user.user_id).all()


# 4. Admin Panel APIs
@app.get("/admin/users/")
async def get_all_users(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(User).all()


@app.get("/admin/exams/")
async def get_all_exams(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(Exam).all()


# 5. Reporting APIs
@app.get("/reports/user-performance/{user_id}")
async def get_user_performance(
        user_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    exams = db.query(Exam).join(user_exams).filter(user_exams.c.user_id == user_id).all()

    total_exams = len(exams)
    total_correct = sum(exam.correct_answers for exam in exams)
    total_wrong = sum(exam.wrong_answers for exam in exams)

    return {
        "total_exams": total_exams,
        "total_correct_answers": total_correct,
        "total_wrong_answers": total_wrong,
        "average_score": total_correct / (total_correct + total_wrong) if (total_correct + total_wrong) > 0 else 0
    }


@app.get("/reports/subject-performance/{subject_id}")
async def get_subject_performance(
        subject_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    exams = db.query(Exam).filter(Exam.subject_id == subject_id).all()
    return {
        "total_exams": len(exams),
        "average_correct": sum(exam.correct_answers for exam in exams) / len(exams) if exams else 0,
        "average_wrong": sum(exam.wrong_answers for exam in exams) / len(exams) if exams else 0
    }


# Delete User endpoint
@app.delete("/users/{user_id}")
async def delete_user(
        user_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_admin:
        raise HTTPException(status_code=400, detail="Cannot delete admin user")

    try:
        # Delete associated user_exam records first
        db.execute(user_exams.delete().where(user_exams.c.user_id == user_id))
        # Then delete the user
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Delete Exam endpoint
@app.delete("/exams/{exam_id}")
async def delete_exam(
        exam_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    try:
        # Delete associated user_exam records first
        db.execute(user_exams.delete().where(user_exams.c.exam_id == exam_id))
        # Then delete the exam
        db.delete(exam)
        db.commit()
        return {"message": "Exam deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
