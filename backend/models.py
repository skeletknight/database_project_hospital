from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base

class Ward(Base):
    __tablename__ = "ward"
    ward_id = Column(Integer, primary_key=True, index=True)
    ward_name = Column(String(50), nullable=False)
    floor_number = Column(Integer, nullable=False)
    
    rooms = relationship("Room", back_populates="ward")
    staff = relationship("Staff", back_populates="ward")

class Room(Base):
    __tablename__ = "room"
    room_id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), nullable=False)
    room_type = Column(String(20))
    capacity = Column(Integer)
    current_patient_count = Column(Integer, default=0)
    ward_id = Column(Integer, ForeignKey("ward.ward_id"))

    ward = relationship("Ward", back_populates="rooms")
    admissions = relationship("Admission", back_populates="room")

class Patient(Base):
    __tablename__ = "patient"
    patient_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    national_id = Column(String(20), unique=True)
    date_of_birth = Column(Date)
    gender = Column(String(10))
    blood_type = Column(String(5))
    allergies = Column(Text)
    chronic_diseases = Column(Text)
    notes = Column(Text)
    #password = Column(String(100))

    appointments = relationship("Appointment", back_populates="patient")
    admissions = relationship("Admission", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctor"
    doctor_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    specialty = Column(String(50))
    national_id = Column(String(20), unique=True)
    date_of_birth = Column(Date)
    username = Column(String(50), unique=True)
    password = Column(String(100))

    appointments = relationship("Appointment", back_populates="doctor")

class Staff(Base):
    __tablename__ = "staff"
    staff_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    position = Column(String(50))
    national_id = Column(String(20), unique=True)
    username = Column(String(50), unique=True)
    password = Column(String(100))
    ward_id = Column(Integer, ForeignKey("ward.ward_id"))

    ward = relationship("Ward", back_populates="staff")

class Appointment(Base):
    __tablename__ = "appointment"
    appointment_id = Column(Integer, primary_key=True, index=True)
    appointment_datetime = Column(DateTime)
    status = Column(String(20), default="Pending")
    notes = Column(Text)
    patient_id = Column(Integer, ForeignKey("patient.patient_id"))
    doctor_id = Column(Integer, ForeignKey("doctor.doctor_id"))

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class Admission(Base):
    __tablename__ = "admission"
    admission_id = Column(Integer, primary_key=True, index=True)
    admission_date = Column(DateTime)
    discharge_date = Column(DateTime, nullable=True)
    reason_for_admission = Column(Text)
    status = Column(String(20), default="Active")
    patient_id = Column(Integer, ForeignKey("patient.patient_id"))
    room_id = Column(Integer, ForeignKey("room.room_id"))

    patient = relationship("Patient", back_populates="admissions")
    room = relationship("Room", back_populates="admissions")
