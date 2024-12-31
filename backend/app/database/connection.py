# app/database/connection.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Notice how we're specifically using TestCore_db here
# This is similar to your connection string in .NET, but formatted for PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:admin@localhost:5432/TestCore_db"
)

# Create the SQLAlchemy engine, which is like your database context in Entity Framework
engine = create_engine(
    DATABASE_URL,
    # echo=True means we'll see the SQL commands in our console - helpful for learning
    echo=True
)

# This is similar to your DbContext configuration in Entity Framework
SessionLocal = sessionmaker(
    autocommit=False,  # We want explicit transaction management
    autoflush=False,   # We'll flush manually for better control
    bind=engine        # Connect to our configured database
)

# This Base class will be the foundation for all our models
# Similar to how you might have a BaseEntity class in .NET
Base = declarative_base()

def get_db():
    # This is like using a "using" block in C#
    db = SessionLocal()
    try:
        yield db
    finally:
        # Ensures we always close our database connection
        db.close()