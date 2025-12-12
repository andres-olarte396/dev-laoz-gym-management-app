from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin" # Entrenador
    USER = "user"   # Cliente

class UsuarioBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str = Field(index=True)
    is_active: bool = True
    role: Role = Field(default=Role.USER)

class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioRead(UsuarioBase):
    id: int

class UsuarioUpdate(SQLModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[Role] = None


class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: Optional[str] = None
