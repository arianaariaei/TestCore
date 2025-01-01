from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel
from passlib.context import CryptContext

# Import database-related modules
from database import get_db
from models.exam import Exam
from models.user import User

# Create the FastAPI application instance
app = FastAPI(title="Test Management System")

# JWT Configuration
SECRET_KEY = "testcore_secret_key_very_mysterious"  # Replace with a secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Pydantic models
class ExamCreate(BaseModel):
    subject: str
    correct_answers: List[str]


# Helper function to create JWT tokens
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Helper function to verify JWT tokens
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Test Management System"}


# User registration endpoint
@app.post("/users/")
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user in the system.
    """
    # Check if username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )

    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create new user object
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=pwd_context.hash(user_data.password)
    )

    try:
        # Add and commit to database
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Return the created user (without the password)
        return {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "is_active": db_user.is_active,
            "is_admin": db_user.is_admin
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Login endpoint
@app.post("/token")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return a JWT token.
    """
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not pwd_context.verify(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Create exam endpoint
@app.post("/exams/")
async def create_exam(
    exam_data: ExamCreate,
    db: Session = Depends(get_db),
    token: str = Depends(verify_token)
):
    """
    Create a new exam record (requires authentication).
    """
    # Verify token and get the user
    user = db.query(User).filter(User.username == token["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create exam
    new_exam = Exam(
        subject=exam_data.subject,
        correct_answers=exam_data.correct_answers,  # Store list of correct answers
        user_id=user.id  # Link exam to the authenticated user
    )

    try:
        db.add(new_exam)
        db.commit()
        db.refresh(new_exam)
        return new_exam
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Get exams endpoint
@app.get("/exams/")
async def get_exams(
        db: Session = Depends(get_db),
        token: str = Depends(oauth2_scheme)
):
    """
    Get all exams for the authenticated user (requires authentication).
    """
    # Verify token and get the user
    payload = verify_token(token)
    user = db.query(User).filter(User.username == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return only the exams for the authenticated user
    exams = db.query(Exam).filter(Exam.user_id == user.id).all()
    return exams
