from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Exam(Base):
    """
    Exam model to store test results.
    """
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False)  # The subject of the exam
    correct_answers = Column(JSON, nullable=False)  # List of correct answers
    date_taken = Column(DateTime, default=datetime.utcnow)  # When the exam was taken

    # Foreign key to link exam to user
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Relationship to User
    user = relationship("User", back_populates="exams")
