from pydantic import BaseModel, validator


class ExamCreate(BaseModel):
    title: str
    subject: str
    correct_answers: int = 0
    wrong_answers: int = 0

    @validator('correct_answers', 'wrong_answers')
    def answers_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError('Answer counts cannot be negative')
        return v

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()


class ExamUpdate(BaseModel):
    correct_answers: int
    wrong_answers: int

    @validator('correct_answers', 'wrong_answers')
    def answers_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError('Answer counts cannot be negative')
        return v
