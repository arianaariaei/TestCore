from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from database import get_db, init_db
from models.exam import Exam
from models.user import User
from models.user_exam import user_exams
from schemas import UserCreate, LoginRequest, ExamCreate, ExamUpdate

init_db()
app = FastAPI(title="Test Management System")

# JWT and Auth configurations
SECRET_KEY = "testcore_secret_key_very_mysterious"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000
auth_scheme = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Auth Helper Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: HTTPAuthorizationCredentials = Depends(auth_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


@app.post("/signup")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, email=user.email, university=user.university, password=hashed_password,
                   is_admin=user.is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not pwd_context.verify(login_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# 2. Exam Management APIs
@app.post("/exams/")
async def create_exam(
        exam: ExamCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_exam = Exam(
        title=exam.title,
        subject=exam.subject,
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

    return {"exam_id": db_exam.exam_id, "title": db_exam.title, "subject": db_exam.subject,
            "correct_answers": db_exam.correct_answers, "wrong_answers": db_exam.wrong_answers}


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

    # Query exams with user information through the join table
    exams_with_users = (
        db.query(
            Exam,
            User.user_id,
            User.name,
            User.email,
            User.university
        )
        .join(user_exams, Exam.exam_id == user_exams.c.exam_id)
        .join(User, user_exams.c.user_id == User.user_id)
        .all()
    )

    return [
        {
            "exam_id": exam.exam_id,
            "title": exam.title,
            "subject": exam.subject,
            "correct_answers": exam.correct_answers,
            "wrong_answers": exam.wrong_answers,
            "score_percentage": (exam.correct_answers / (exam.correct_answers + exam.wrong_answers) * 100)
            if (exam.correct_answers + exam.wrong_answers) > 0 else 0,
            "user": {
                "user_id": user_id,
                "name": name,
                "email": email,
                "university": university
            }
        }
        for exam, user_id, name, email, university in exams_with_users
    ]


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
        db.execute(user_exams.delete().where(user_exams.c.user_id == user_id))
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/exams/{exam_id}")
async def delete_exam(
        exam_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(Exam.exam_id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    user_exam_records = db.execute(
        user_exams.select().where(user_exams.c.exam_id == exam_id)
    ).fetchall()
    print(f"User Exam Records: {user_exam_records}")

    is_user_exam = any(user.user_id == current_user.user_id for user in exam.users)
    if not (is_user_exam or current_user.is_admin):
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to delete this exam"
        )

    try:
        result = db.execute(
            user_exams.delete().where(
                (user_exams.c.exam_id == exam_id) &
                (user_exams.c.user_id == current_user.user_id)
            )
        )
        print(f"Rows deleted from user_exams: {result.rowcount}")

        if current_user.is_admin:
            db.delete(exam)

        db.commit()
        return {"message": "Exam deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error during deletion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/admin/users/{user_id}/exams")
async def get_user_exams_details(
        user_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # Check if the current user is an admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Get user information
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all exams for the user with detailed information
    exams = db.query(Exam).join(user_exams).filter(user_exams.c.user_id == user_id).all()

    # Calculate summary statistics
    total_exams = len(exams)
    total_correct = sum(exam.correct_answers for exam in exams)
    total_wrong = sum(exam.wrong_answers for exam in exams)
    avg_score = total_correct / (total_correct + total_wrong) if (total_correct + total_wrong) > 0 else 0

    return {
        "user": {
            "id": user.user_id,
            "name": user.name,
            "email": user.email,
            "university": user.university
        },
        "exams": [{
            "id": exam.exam_id,
            "title": exam.title,
            "subject": exam.subject,
            "correct_answers": exam.correct_answers,
            "wrong_answers": exam.wrong_answers,
            "total_questions": exam.correct_answers + exam.wrong_answers,
            "score_percentage": (exam.correct_answers / (exam.correct_answers + exam.wrong_answers) * 100)
            if (exam.correct_answers + exam.wrong_answers) > 0 else 0
        } for exam in exams],
        "summary": {
            "total_exams": total_exams,
            "total_correct_answers": total_correct,
            "total_wrong_answers": total_wrong,
            "average_score": avg_score * 100
        }
    }


@app.get("/reports/exams-by-subject")
async def get_exams_by_subject(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # Use SQLAlchemy to group exams by subject and count them
    subject_counts = (
        db.query(
            Exam.subject,
            db.func.count(Exam.exam_id).label('total_exams'),
            db.func.avg((Exam.correct_answers * 100.0) /
                        (Exam.correct_answers + Exam.wrong_answers)).label('average_score')
        )
        .group_by(Exam.subject)
        .all()
    )

    # Format the results
    return [
        {
            "subject": subject,
            "total_exams": total,
            "average_score": round(avg_score, 2) if avg_score is not None else 0
        }
        for subject, total, avg_score in subject_counts
    ]


@app.get("/reports/users-exam-count")
async def get_users_exam_count(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    # Check if the current user is an admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Query to get users and their exam counts
    user_stats = (
        db.query(
            User.user_id,
            User.name,
            User.email,
            User.university,
            db.func.count(user_exams.c.exam_id).label('total_exams')
        )
        .outerjoin(user_exams, User.user_id == user_exams.c.user_id)
        .group_by(User.user_id)
        .all()
    )

    return [
        {
            "user_id": user_id,
            "name": name,
            "email": email,
            "university": university,
            "total_exams": total_exams
        }
        for user_id, name, email, university, total_exams in user_stats
    ]
