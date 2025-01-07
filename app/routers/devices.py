from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import DeviceCreate, DeviceUpdate, DeviceResponse
from app.crud.crud_device import get_devices, get_device, create_device, update_device, delete_device
from app.database import get_db
from app.models import User
from app.utils.auth import get_current_user, check_role

router = APIRouter(
    prefix="/devices",
    tags=["devices"],
)

# Definir os papéis permitidos
allowed_roles = ["ceo", "security_admin"]

@router.get("/", response_model=list[DeviceResponse])
def list_devices(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    return get_devices(db)

@router.post("/", response_model=DeviceResponse)
def add_device(
    device: DeviceCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    return create_device(db, device)

@router.put("/{device_id}", response_model=DeviceResponse)
def edit_device(
    device_id: int, 
    device: DeviceUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    db_device = update_device(db, device_id, device)
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_device(
    device_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_role(current_user, allowed_roles)
    db_device = delete_device(db, device_id)
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return None

