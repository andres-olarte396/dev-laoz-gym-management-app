from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.client import ClienteGym, ClienteGymCreate, ClienteGymRead, ClienteGymUpdate
from app.models.user import Usuario
# from app.api.auth import get_current_active_user # Removed unused import

router = APIRouter()

# Dependency placeholder if not exported from auth.py
from app.api.auth import login_for_access_token # Just to ensure module loaded
from fastapi.security import OAuth2PasswordBearer
from app.core.security import verify_password
from app.core.config import settings
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = session.exec(select(Usuario).where(Usuario.email == username)).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/", response_model=ClienteGymRead)
def create_client(
    client: ClienteGymCreate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    db_client = ClienteGym.from_orm(client)
    # Assign current trainer to client? 
    if current_user.role == "admin": # Admin/Trainer
        db_client.entrenador_id = current_user.id
        
    session.add(db_client)
    session.commit()
    session.refresh(db_client)
    return db_client

@router.get("/", response_model=List[ClienteGymRead])
def read_clients(
    offset: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    clients = session.exec(select(ClienteGym).offset(offset).limit(limit)).all()
    return clients

@router.get("/{client_id}", response_model=ClienteGymRead)
def read_client(
    client_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    client = session.get(ClienteGym, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.patch("/{client_id}", response_model=ClienteGymRead)
def update_client(
    client_id: int,
    client_update: ClienteGymUpdate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    db_client = session.get(ClienteGym, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
        
    client_data = client_update.dict(exclude_unset=True)
    for key, value in client_data.items():
        setattr(db_client, key, value)
        
    session.add(db_client)
    session.commit()
    session.refresh(db_client)
    return db_client

@router.delete("/{client_id}", status_code=204)
def delete_client(
    client_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Delete a client"""
    db_client = session.get(ClienteGym, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    session.delete(db_client)
    session.commit()
    return None
