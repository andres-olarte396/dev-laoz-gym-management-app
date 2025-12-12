from typing import Optional
from datetime import date, datetime
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum

class TipoUsuario(str, Enum):
    VIRTUAL = "virtual"
    PRESENCIAL = "presencial"
    HIBRIDO = "hibrido"

class ClienteGymBase(SQLModel):
    nombre: str
    apellido: str
    email: str = Field(unique=True, index=True)
    telefono: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    tipo_usuario: TipoUsuario = Field(default=TipoUsuario.PRESENCIAL)
    objetivo_fitness: Optional[str] = None
    condiciones_medicas: Optional[str] = None
    activo: bool = True
    fecha_inicio: date = Field(default_factory=date.today)

class ClienteGym(ClienteGymBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # In a real app, link to User/Trainer. 
    # For now, we assume a simple list managed by any Admin.
    entrenador_id: Optional[int] = Field(default=None) 

class ClienteGymCreate(ClienteGymBase):
    pass

class ClienteGymRead(ClienteGymBase):
    id: int
    created_at: datetime

class ClienteGymUpdate(SQLModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    tipo_usuario: Optional[TipoUsuario] = None
    objetivo_fitness: Optional[str] = None
    activo: Optional[bool] = None
