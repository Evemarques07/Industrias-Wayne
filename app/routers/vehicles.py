from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import VehicleCreate, VehicleUpdate, VehicleResponse
from app.crud_vehicle import get_vehicles, get_vehicle, create_vehicle, update_vehicle, delete_vehicle
from app.database import get_db

router = APIRouter(
    prefix="/vehicles",
    tags=["vehicles"],
)

@router.get("/", response_model=list[VehicleResponse])
def list_vehicles(db: Session = Depends(get_db)):
    return get_vehicles(db)

@router.post("/", response_model=VehicleResponse)
def add_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    return create_vehicle(db, vehicle)

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def edit_vehicle(vehicle_id: int, vehicle: VehicleUpdate, db: Session = Depends(get_db)):
    db_vehicle = update_vehicle(db, vehicle_id, vehicle)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = delete_vehicle(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return None
