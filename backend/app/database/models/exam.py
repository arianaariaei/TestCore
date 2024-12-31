# app/database/models/exam.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..connection import Base


class Exam(Base):
    """
    Exam model to store test results
    Similar to an Exam entity in Entity Framework
    """
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False)  # The subject of the exam
    correct_answers = Column(Integer, default=0)  # Number of correct answers
    incorrect_answers = Column(Integer, default=0)  # Number of incorrect answers
    date_taken = Column(DateTime, default=datetime.utcnow)  # When the exam was taken

    # Foreign key to link exam to user - similar to how you'd set up relationships in EF
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # This creates the other side of the relationship - like navigation properties in EF
    user = relationship("User", back_populates="exams")
