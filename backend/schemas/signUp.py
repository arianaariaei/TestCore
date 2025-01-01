from pydantic import BaseModel, EmailStr


class signUp(BaseModel):
    username: str
    email: EmailStr
    password: str
