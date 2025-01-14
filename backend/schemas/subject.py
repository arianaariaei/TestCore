from pydantic import BaseModel, validator


class SubjectCreate(BaseModel):
    title: str

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
