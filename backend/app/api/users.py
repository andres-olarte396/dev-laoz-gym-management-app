from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.db import get_session
from app.models.user import Usuario, UsuarioCreate, UsuarioRead, UsuarioUpdate, Role
from app.core.security import get_password_hash
from app.api.clients import get_current_user  # Reuse auth dependency

router = APIRouter()

@router.post("/", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UsuarioCreate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Create a new user (admin only)"""
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if email already exists
    existing_user = session.exec(select(Usuario).where(Usuario.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    db_user = Usuario(
        email=user.email,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        role=user.role,
        is_active=user.is_active if hasattr(user, 'is_active') else True
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.get("/", response_model=List[UsuarioRead])
def read_users(
    offset: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Get list of users (admin only)"""
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    users = session.exec(select(Usuario).offset(offset).limit(limit)).all()
    return users

@router.get("/me", response_model=UsuarioRead)
def read_current_user(current_user: Usuario = Depends(get_current_user)):
    """Get current logged-in user info"""
    return current_user

@router.get("/{user_id}", response_model=UsuarioRead)
def read_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Get a specific user by ID (admin only)"""
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = session.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}", response_model=UsuarioRead)
def update_user(
    user_id: int,
    user_update: UsuarioUpdate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Update a user (admin only)"""
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_user = session.get(Usuario, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    user_data = user_update.dict(exclude_unset=True)
    
    # Handle password separately
    if 'password' in user_data and user_data['password']:
        user_data['hashed_password'] = get_password_hash(user_data.pop('password'))
    
    for key, value in user_data.items():
        setattr(db_user, key, value)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Delete a user (admin only)"""
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Prevent deleting yourself
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db_user = session.get(Usuario, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    session.delete(db_user)
    session.commit()
    return None
