# MediCore: Hospital Management System

**Phase 5 Implementation**
**Student:** Ali Ghaed Rahmat
**Subject:** Database Systems (Hospital Rebranding)

---

## 1. Project Overview
MediCore is a comprehensive **Hospital Management System (HMS)** designed to streamline interactions between **Patients**, **Doctors**, and **Hospital Staff**. The system utilizes a robust relational database to manage wards, rooms, admissions, and appointments in real-time.

## 2. Key Features

### 🏥 Patient Portal
*   **Secure Login**: Access using National ID and Password.
*   **Appointment Booking**: Browse available doctors and schedule consultations.
*   **History**: View past appointments and status updates.

### 👨‍⚕️ Doctor Dashboard
*   **Schedule Management**: View upcoming appointments sorted by time.
*   **Patient Actions**: Accept, Reject, or Complete appointments.
*   **Real-Time Notifications**: Receive alerts when a patient books a slot.

### 🛠 Admin/Staff Panel
*   **Staff Management**: Add new doctors and assign them to wards.
*   **Facility Management**: Overview of Wards and Rooms (Database level).
*   **Data Seeding**: Reset and populate the system with demo data.

## 3. Tech Stack
*   **Database**: PostgreSQL (Relational Schema: `Ward`, `Room`, `Patient`, `Doctor`, `Staff`, `Appointment`, `Admission`)
*   **Backend**: FastAPI (Python) + SQLAlchemy ORM
*   **Frontend**: Next.js 14 (TypeScript) + Tailwind CSS
*   **Real-Time**: WebSockets for appointment status updates.

---

## 4. Entity Relationship Logic
*   **Wards & Rooms**: One-to-Many relationship.
*   **Appointments**: Links `Patient` and `Doctor` entities.
*   **Admissions**: Links `Patient` to a specific `Room`.
