from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Exam(Base):
    __tablename__ = 'exams'

    exam_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    correct_answers = Column(Integer, nullable=False)
    wrong_answers = Column(Integer, nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.subject_id'), nullable=False)

    subject = relationship("Subject", back_populates="exams")
    users = relationship("User", secondary="user_exams", back_populates="exams")
