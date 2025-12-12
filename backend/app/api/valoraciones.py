from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.valoracion import (
    ValoracionFisica,
    ValoracionFisicaCreate,
    ValoracionFisicaRead,
    ValoracionFisicaUpdate
)
from app.models.user import Usuario

router = APIRouter()

def calcular_imc(peso: float, altura: float) -> float:
    """Calcula el Índice de Masa Corporal (IMC)"""
    altura_metros = altura / 100  # Convertir cm a metros
    return round(peso / (altura_metros ** 2), 2)

@router.get("/", response_model=List[ValoracionFisicaRead])
def get_valoraciones(
    cliente_id: int = None,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener todas las valoraciones físicas, opcionalmente filtradas por cliente"""
    statement = select(ValoracionFisica)
    
    if cliente_id:
        statement = statement.where(ValoracionFisica.cliente_id == cliente_id)
    
    statement = statement.order_by(ValoracionFisica.fecha.desc())
    valoraciones = session.exec(statement).all()
    return valoraciones

@router.get("/{valoracion_id}", response_model=ValoracionFisicaRead)
def get_valoracion(
    valoracion_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener una valoración física específica"""
    valoracion = session.get(ValoracionFisica, valoracion_id)
    if not valoracion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valoración no encontrada"
        )
    return valoracion

@router.post("/", response_model=ValoracionFisicaRead, status_code=status.HTTP_201_CREATED)
def create_valoracion(
    valoracion_data: ValoracionFisicaCreate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Crear una nueva valoración física"""
    # Calcular IMC automáticamente
    imc = calcular_imc(valoracion_data.peso, valoracion_data.altura)
    
    # Crear la valoración
    valoracion = ValoracionFisica(
        **valoracion_data.model_dump(),
        imc=imc
    )
    
    session.add(valoracion)
    session.commit()
    session.refresh(valoracion)
    return valoracion

@router.patch("/{valoracion_id}", response_model=ValoracionFisicaRead)
def update_valoracion(
    valoracion_id: int,
    valoracion_update: ValoracionFisicaUpdate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar una valoración física existente"""
    valoracion = session.get(ValoracionFisica, valoracion_id)
    if not valoracion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valoración no encontrada"
        )
    
    # Actualizar campos
    update_data = valoracion_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(valoracion, key, value)
    
    # Recalcular IMC si se actualizó peso o altura
    if "peso" in update_data or "altura" in update_data:
        valoracion.imc = calcular_imc(valoracion.peso, valoracion.altura)
    
    valoracion.updated_at = datetime.utcnow()
    
    session.add(valoracion)
    session.commit()
    session.refresh(valoracion)
    return valoracion

@router.delete("/{valoracion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_valoracion(
    valoracion_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Eliminar una valoración física"""
    valoracion = session.get(ValoracionFisica, valoracion_id)
    if not valoracion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valoración no encontrada"
        )
    
    session.delete(valoracion)
    session.commit()
    return None

@router.get("/cliente/{cliente_id}/progreso", response_model=dict)
def get_progreso_cliente(
    cliente_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener el progreso de un cliente (comparación entre valoraciones)"""
    statement = select(ValoracionFisica).where(
        ValoracionFisica.cliente_id == cliente_id
    ).order_by(ValoracionFisica.fecha.asc())
    
    valoraciones = session.exec(statement).all()
    
    if len(valoraciones) < 2:
        return {
            "mensaje": "Se necesitan al menos 2 valoraciones para calcular el progreso",
            "valoraciones_count": len(valoraciones)
        }
    
    primera = valoraciones[0]
    ultima = valoraciones[-1]
    
    progreso = {
        "primera_valoracion": {
            "fecha": primera.fecha,
            "peso": primera.peso,
            "imc": primera.imc,
            "porcentaje_grasa": primera.porcentaje_grasa,
            "masa_muscular": primera.masa_muscular
        },
        "ultima_valoracion": {
            "fecha": ultima.fecha,
            "peso": ultima.peso,
            "imc": ultima.imc,
            "porcentaje_grasa": ultima.porcentaje_grasa,
            "masa_muscular": ultima.masa_muscular
        },
        "cambios": {
            "peso": round(ultima.peso - primera.peso, 2),
            "imc": round((ultima.imc or 0) - (primera.imc or 0), 2),
            "porcentaje_grasa": round((ultima.porcentaje_grasa or 0) - (primera.porcentaje_grasa or 0), 2) if primera.porcentaje_grasa and ultima.porcentaje_grasa else None,
            "masa_muscular": round((ultima.masa_muscular or 0) - (primera.masa_muscular or 0), 2) if primera.masa_muscular and ultima.masa_muscular else None
        },
        "total_valoraciones": len(valoraciones),
        "dias_transcurridos": (ultima.fecha - primera.fecha).days
    }
    
    return progreso
