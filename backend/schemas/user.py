from pydantic import BaseModel, EmailStr, validator, constr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=6)
    is_admin: bool = False

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('password')
    def password_validation(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one number')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
