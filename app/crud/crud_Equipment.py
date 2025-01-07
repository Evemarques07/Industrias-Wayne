from sqlalchemy.orm import Session
from app.models import Equipment
from app.schemas import EquipmentCreate, EquipmentUpdate

def get_equipments(db: Session):
    return db.query(Equipment).all()

def get_equipment(db: Session, equipment_id: int):
    return db.query(Equipment).filter(Equipment.id == equipment_id).first()

def create_equipment(db: Session, equipment: EquipmentCreate):
    db_equipment = Equipment(
        name=equipment.name,
        description=equipment.description,
        image_url=equipment.image_url,
    )
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def update_equipment(db: Session, equipment_id: int, equipment: EquipmentUpdate):
    db_equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if db_equipment:
        db_equipment.name = equipment.name
        db_equipment.description = equipment.description
        db_equipment.image_url = equipment.image_url
        db.commit()
        db.refresh(db_equipment)
    return db_equipment

def delete_equipment(db: Session, equipment_id: int):
    db_equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if db_equipment:
        db.delete(db_equipment)
        db.commit()
    return db_equipment
