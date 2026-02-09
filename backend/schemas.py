from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

# --- Auth & Users ---
class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    name: str
    role: str
    details: Optional[dict] = None

# --- Patient ---
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    national_id: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    chronic_diseases: Optional[str] = None

class PatientCreate(PatientBase):
    password: str
    notes: Optional[str] = None

class PatientResponse(PatientBase):
    patient_id: int
    class Config: from_attributes = True

# --- Doctor ---
class DoctorBase(BaseModel):
    first_name: str
    last_name: str
    specialty: str
    username: str

class DoctorCreate(DoctorBase):
    password: str
    national_id: str

class DoctorResponse(DoctorBase):
    doctor_id: int
    class Config: from_attributes = True

# --- Appointment ---
class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_datetime: datetime
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    appointment_id: int
    appointment_datetime: datetime
    status: str
    notes: Optional[str] = None
    doctor: Optional[DoctorResponse] = None
    patient: Optional[PatientResponse] = None
    class Config: from_attributes = True

class AppointmentUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

# --- Ward/Room/Staff ---
class WardBase(BaseModel):
    ward_name: str
    floor_number: int

class RoomBase(BaseModel):
    room_number: str
    room_type: str
    capacity: int
    ward_id: int

class StaffCreate(BaseModel):
    first_name: str
    last_name: str
    position: str
    username: str
    password: str
    ward_id: Optional[int] = None
