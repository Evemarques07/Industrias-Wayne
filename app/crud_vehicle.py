from sqlalchemy.orm import Session
from app.models import Vehicle
from app.schemas import VehicleCreate, VehicleUpdate

def get_vehicles(db: Session):
    return db.query(Vehicle).all()

def get_vehicle(db: Session, vehicle_id: int):
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

def create_vehicle(db: Session, vehicle: VehicleCreate):
    db_vehicle = Vehicle(
        name=vehicle.name,
        description=vehicle.description,
        image_url=vehicle.image_url,
    )
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def update_vehicle(db: Session, vehicle_id: int, vehicle: VehicleUpdate):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if db_vehicle:
        db_vehicle.name = vehicle.name
        db_vehicle.description = vehicle.description
        db_vehicle.image_url = vehicle.image_url
        db.commit()
        db.refresh(db_vehicle)
    return db_vehicle

def delete_vehicle(db: Session, vehicle_id: int):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if db_vehicle:
        db.delete(db_vehicle)
        db.commit()
    return db_vehicle
