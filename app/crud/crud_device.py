from sqlalchemy.orm import Session
from app.models import Device
from app.schemas import DeviceCreate, DeviceUpdate

def get_devices(db: Session):
    return db.query(Device).all()

def get_device(db: Session, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()

def create_device(db: Session, device: DeviceCreate):
    db_device = Device(
        name=device.name,
        description=device.description,
        image_url=device.image_url,
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def update_device(db: Session, device_id: int, device: DeviceUpdate):
    db_device = db.query(Device).filter(Device.id == device_id).first()
    if db_device:
        db_device.name = device.name
        db_device.description = device.description
        db_device.image_url = device.image_url
        db.commit()
        db.refresh(db_device)
    return db_device

def delete_device(db: Session, device_id: int):
    db_device = db.query(Device).filter(Device.id == device_id).first()
    if db_device:
        db.delete(db_device)
        db.commit()
    return db_device
