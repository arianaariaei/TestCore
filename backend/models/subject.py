from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Subject(Base):
    __tablename__ = 'subjects'

    subject_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)

    exams = relationship("Exam", back_populates="subject")
