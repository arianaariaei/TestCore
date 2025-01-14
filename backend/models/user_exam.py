from sqlalchemy import Column, Integer, ForeignKey, Table
from database import Base

user_exams = Table(
    'user_exams',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.user_id'), primary_key=True),
    Column('exam_id', Integer, ForeignKey('exams.exam_id'), primary_key=True)
)
