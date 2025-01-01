# app/database/models/user.py

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    # Tell SQLAlchemy what table name to use - similar to [Table("users")] in Entity Framework
    __tablename__ = "users"

    # Define columns with their types and constraints
    # This is similar to how you'd define properties with attributes in a C# entity class
    id = Column(
        Integer,
        primary_key=True,
        index=True,  # Creates a database index for faster lookups
        autoincrement=True  # Like IDENTITY in SQL Server
    )

    username = Column(
        String(50),  # Maximum length of 50 characters
        unique=True,  # Creates a unique constraint
        index=True,  # Creates an index
        nullable=False  # NOT NULL in database terms
    )

    email = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String(100),
        nullable=False  # Passwords are required
    )

    is_active = Column(
        Boolean,
        default=True,  # Sets default value in database
        nullable=False
    )

    is_admin = Column(
        Boolean,
        default=False,
        nullable=False
    )

    exams = relationship("Exam", back_populates="user")

    def __repr__(self):
        """
        Provides a string representation of the User object
        This is helpful for debugging - similar to overriding ToString() in C#
        """
        return f"User(id={self.id}, username={self.username}, email={self.email})"
