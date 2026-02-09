CREATE TABLE IF NOT EXISTS Ward (
 ward_id SERIAL PRIMARY KEY,
 ward_name VARCHAR(50) NOT NULL,
 floor_number INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Room (
 room_id SERIAL PRIMARY KEY,
 room_number VARCHAR(10) NOT NULL,
 room_type VARCHAR(20) CHECK (room_type IN ('ICU','normal','emergency')),
 capacity INTEGER CHECK (capacity > 0),
 current_patient_count INTEGER DEFAULT 0,
 ward_id INTEGER REFERENCES Ward(ward_id)
);

CREATE TABLE IF NOT EXISTS Patient (
 patient_id SERIAL PRIMARY KEY,
 first_name VARCHAR(50),
 last_name VARCHAR(50),
 national_id VARCHAR(20) UNIQUE,
 date_of_birth DATE,
 gender VARCHAR(10),
 blood_type VARCHAR(5),
 allergies TEXT,
 chronic_diseases TEXT,
 notes TEXT,
 password VARCHAR(100) -- Added for Auth requirements
);

CREATE TABLE IF NOT EXISTS Doctor (
 doctor_id SERIAL PRIMARY KEY,
 first_name VARCHAR(50),
 last_name VARCHAR(50),
 specialty VARCHAR(50),
 national_id VARCHAR(20) UNIQUE,
 date_of_birth DATE,
 username VARCHAR(50) UNIQUE,
 password VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Staff (
 staff_id SERIAL PRIMARY KEY,
 first_name VARCHAR(50),
 last_name VARCHAR(50),
 position VARCHAR(50),
 national_id VARCHAR(20) UNIQUE,
 username VARCHAR(50) UNIQUE,
 password VARCHAR(100),
 ward_id INTEGER REFERENCES Ward(ward_id)
);

CREATE TABLE IF NOT EXISTS Appointment (
 appointment_id SERIAL PRIMARY KEY,
 appointment_datetime TIMESTAMP,
 status VARCHAR(20) DEFAULT 'Pending', -- Pending, Confirmed, Completed, Cancelled
 notes TEXT,
 patient_id INTEGER REFERENCES Patient(patient_id),
 doctor_id INTEGER REFERENCES Doctor(doctor_id)
);

CREATE TABLE IF NOT EXISTS Admission (
 admission_id SERIAL PRIMARY KEY,
 admission_date TIMESTAMP,
 discharge_date TIMESTAMP,
 reason_for_admission TEXT,
 status VARCHAR(20) DEFAULT 'Active', -- Active, Discharged
 patient_id INTEGER REFERENCES Patient(patient_id),
 room_id INTEGER REFERENCES Room(room_id)
);
