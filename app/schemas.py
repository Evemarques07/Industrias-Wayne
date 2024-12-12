from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

class EquipmentBase(BaseModel):
    name: str
    description: str
    image_url: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(EquipmentBase):
    pass

class EquipmentResponse(BaseModel): 
    id: int
    name: str
    description: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class VehicleBase(BaseModel):
    name: str
    description: str
    image_url: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int

    class Config:
        from_attributes = True

class DeviceBase(BaseModel):
    name: str
    description: str
    image_url: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(DeviceBase):
    pass

class DeviceResponse(DeviceBase):
    id: int

    class Config:
        from_attributes = True
