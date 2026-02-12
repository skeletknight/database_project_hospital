from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Updated Database URL for Hospital System
# Ensure you have created this database in PostgreSQL or rename 'hospital_db' to your existing DB name
DATABASE_URL = os.getenv("postgresql://postgres:S@gharelm1396@db.wmlbkpftrfvbwssqfljt.supabase.co:5432/postgres")  # This pulls from Railway env
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def run_sql_file(filename):
    """Executes a SQL file from the sql/ directory."""
    path = os.path.join(os.path.dirname(__file__), "sql", filename)
    try:
        with open(path, "r") as f:
            sql_script = f.read()
        with engine.connect() as connection:
            connection.execute(text(sql_script))
            connection.commit()
        print(f"Executed {filename}")
    except Exception as e:
        print(f"Error executing {filename}: {e}")

def init_db_from_sql():
    # Ensure tables exist without wiping data
    run_sql_file("schema.sql")

def hard_reset_db():
    # Wipes data and recreates tables
    run_sql_file("reset.sql")
    run_sql_file("schema.sql")
