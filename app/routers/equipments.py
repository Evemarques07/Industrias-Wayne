from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import EquipmentCreate, EquipmentUpdate, EquipmentResponse
from app.crud import get_equipments, get_equipment, create_equipment, update_equipment, delete_equipment
from app.database import get_db

router = APIRouter(
    prefix="/equipments",
    tags=["equipments"],
)

@router.get("/", response_model=list[EquipmentResponse])
def list_equipments(db: Session = Depends(get_db)):
    return get_equipments(db)

@router.post("/", response_model=EquipmentResponse)
def add_equipment(equipment: EquipmentCreate, db: Session = Depends(get_db)):
    return create_equipment(db, equipment)

@router.put("/{equipment_id}", response_model=EquipmentResponse)
def edit_equipment(equipment_id: int, equipment: EquipmentUpdate, db: Session = Depends(get_db)):
    db_equipment = update_equipment(db, equipment_id, equipment)
    if not db_equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_equipment

@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_equipment(equipment_id: int, db: Session = Depends(get_db)):
    db_equipment = delete_equipment(db, equipment_id)
    if not db_equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return None