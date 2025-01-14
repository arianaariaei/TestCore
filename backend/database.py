from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "TestCore_db")

# Create initial connection to postgres database to create our app database
default_engine = create_engine(f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/postgres')


# Create the database if it doesn't exist
def create_database():
    try:
        with default_engine.connect() as conn:
            conn.execute(text("commit"))  # Close any existing transactions
            conn.execute(text(f"CREATE DATABASE {DB_NAME}"))
    except Exception as e:
        print(f"Database {DB_NAME} already exists or error occurred:", e)
    finally:
        default_engine.dispose()


# Create the database
create_database()

# Now connect to our app database
DATABASE_URL = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create all tables
def init_db():
    import models.user
    import models.subject
    import models.exam
    import models.user_exam
    Base.metadata.create_all(bind=engine)

