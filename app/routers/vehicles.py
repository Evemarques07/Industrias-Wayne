from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import VehicleCreate, VehicleUpdate, VehicleResponse
from app.crud.crud_vehicle import get_vehicles, get_vehicle, create_vehicle, update_vehicle, delete_vehicle
from app.database import get_db
from app.models import User
from app.utils.auth import get_current_user, check_role

router = APIRouter(
    prefix="/vehicles",
    tags=["vehicles"],
)

# Verificação de credenciais para todas as rotas
allowed_roles = ["manager", "security_admin", "ceo", "employee"]

@router.get("/", response_model=list[VehicleResponse])
def list_vehicles(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    return get_vehicles(db)

@router.post("/", response_model=VehicleResponse)
def add_vehicle(
    vehicle: VehicleCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    return create_vehicle(db, vehicle)

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def edit_vehicle(
    vehicle_id: int, 
    vehicle: VehicleUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    db_vehicle = update_vehicle(db, vehicle_id, vehicle)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_vehicle(
    vehicle_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    db_vehicle = delete_vehicle(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return None
