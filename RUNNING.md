# How to Run MediCore (HMS)

## 1. Database Setup
1.  Ensure **PostgreSQL** is running.
2.  Create the database:
    ```sql
    CREATE DATABASE hospital_db;
    ```
3.  Verify the connection string in `backend/database.py` matches your credentials.

## 2. Backend (FastAPI)
1.  Navigate to `backend/`.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the API server:
    ```bash
    uvicorn main:app --reload
    ```
    *Server running at: `http://127.0.0.1:8000`*

## 3. Frontend (Next.js)
1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the UI:
    ```bash
    npm run dev
    ```
    *UI running at: `http://localhost:3000`*

## 4. Initial Setup (Seeding)
To populate the database with dummy Wards, Doctors, and Staff:
1.  Go to the **Frontend** (`http://localhost:3000`).
2.  Click the **"Login"** button to reach the login page (or use the Admin Panel if accessible).
3.  Alternatively, use an API tool (like Postman) to POST to:
    `http://127.0.0.1:8000/seed`

## 5. Demo Credentials

### **Patient**
*   *Register a new patient via the Signup page first.*

### **Doctor**
*   **Username**: `house`
*   **Password**: `pain`
*   *(Dr. Gregory House - Diagnostic)*

### **Admin / Staff**
*   **Username**: `admin`
*   **Password**: `admin`
