from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import models, schemas, database
from contextlib import asynccontextmanager
import asyncio
import json

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections[:]:
            try:
                await connection.send_json(message)
            except:
                self.disconnect(connection)

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db_from_sql()
    yield

app = FastAPI(title="Hospital Management API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],allow_credentials=True,
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True: await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Auth Routes ---
@app.post("/auth/login", response_model=schemas.UserResponse)
def login(creds: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    if creds.role == "patient":
        user = db.query(models.Patient).filter(models.Patient.national_id == creds.username).first()
        if user and user.password == creds.password:
            return {"id": user.patient_id, "name": f"{user.first_name} {user.last_name}", "role": "patient", "details": {"blood_type": user.blood_type}}
    
    elif creds.role == "doctor":
        user = db.query(models.Doctor).filter(models.Doctor.username == creds.username).first()
        if user and user.password == creds.password:
            return {"id": user.doctor_id, "name": f"Dr. {user.last_name}", "role": "doctor", "details": {"specialty": user.specialty}}
            
    elif creds.role == "staff":
        user = db.query(models.Staff).filter(models.Staff.username == creds.username).first()
        if user and user.password == creds.password:
            return {"id": user.staff_id, "name": f"{user.first_name}", "role": "admin", "details": {"position": user.position}}
            
    raise HTTPException(400, "Invalid credentials or role mismatch")

# --- Patient Routes ---
@app.post("/patients", response_model=schemas.PatientResponse)
def register_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db)):
    if db.query(models.Patient).filter(models.Patient.national_id == patient.national_id).first():
        raise HTTPException(400, "National ID already registered")
    new_p = models.Patient(**patient.dict())
    db.add(new_p); db.commit(); db.refresh(new_p)
    return new_p

@app.get("/patients/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Patient).filter(models.Patient.patient_id == patient_id).first()

# --- Doctor Routes ---
@app.get("/doctors", response_model=list[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(database.get_db)):
    return db.query(models.Doctor).all()

@app.post("/doctors")
def add_doctor(doc: schemas.DoctorCreate, db: Session = Depends(database.get_db)):
    d = models.Doctor(**doc.dict())
    db.add(d); db.commit();
    return {"message": "Doctor Added"}

# --- Appointment Routes ---
@app.post("/appointments")
async def book_appointment(appt: schemas.AppointmentCreate, db: Session = Depends(database.get_db)):
    a = models.Appointment(**appt.dict())
    db.add(a); db.commit(); db.refresh(a)
    # Notify doctors
    await manager.broadcast({"type": "NEW_APPOINTMENT", "data": {"id": a.appointment_id, "status": "Pending"}})
    return {"message": "Appointment Request Sent"}

@app.get("/appointments/my/{role}/{id}", response_model=list[schemas.AppointmentResponse])
def my_appointments(role: str, id: int, db: Session = Depends(database.get_db)):
    q = db.query(models.Appointment)
    if role == "patient":
        return q.filter(models.Appointment.patient_id == id).order_by(models.Appointment.appointment_datetime.desc()).all()
    if role == "doctor":
        return q.filter(models.Appointment.doctor_id == id).order_by(models.Appointment.appointment_datetime.asc()).all()
    return []

@app.put("/appointments/{appt_id}")
async def update_appointment(appt_id: int, update: schemas.AppointmentUpdate, db: Session = Depends(database.get_db)):
    a = db.query(models.Appointment).filter(models.Appointment.appointment_id == appt_id).first()
    if not a: raise HTTPException(404, "Not found")
    a.status = update.status
    if update.notes: a.notes = update.notes
    db.commit()
    await manager.broadcast({"type": "APPOINTMENT_UPDATE", "data": {"id": a.appointment_id, "status": a.status}})
    return {"message": "Updated"}

# --- Seed ---
@app.post("/seed")
def seed_data(db: Session = Depends(database.get_db)):
    database.hard_reset_db()
    # Wards
    w1 = models.Ward(ward_name="Cardiology", floor_number=1)
    w2 = models.Ward(ward_name="Emergency", floor_number=0)
    db.add_all([w1, w2]); db.commit();
    # Doctors
    db.add_all([
        models.Doctor(first_name="Gregory", last_name="House", specialty="Diagnostic", username="house", password="pain", national_id="D1", date_of_birth=datetime(1970,1,1)),
        models.Doctor(first_name="Meredith", last_name="Grey", specialty="Surgery", username="grey", password="mcdreamy", national_id="D2", date_of_birth=datetime(1980,1,1))
    ])
    # Staff
    db.add(models.Staff(first_name="Admin", last_name="User", position="Manager", username="admin", password="admin", national_id="S1", ward_id=w1.ward_id))
    db.commit()
    return {"message": "Hospital Data Seeded"}
