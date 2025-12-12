from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from datetime import datetime

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.usuario import Usuario
from app.models.entrenamiento import (
    Ejercicio, EjercicioCreate, EjercicioRead,
    Rutina, RutinaCreate, RutinaRead, RutinaReadWithDetails,
    DiaRutina, DetalleRutina, DetalleRutinaBase
)

router = APIRouter()

# --- EJERCICIOS (CATÁLOGO) ---

@router.get(
    "/ejercicios/", 
    response_model=List[EjercicioRead],
    summary="Listar ejercicios del catálogo",
    description="Obtiene una lista de todos los ejercicios disponibles. Permite filtrar por grupo muscular y buscar por nombre."
)
def get_ejercicios(
    grupo_muscular: Optional[str] = Query(None, description="Filtrar por grupo muscular (ej: Pecho, Espalda)"),
    search: Optional[str] = Query(None, description="Buscar por nombre del ejercicio"),
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """
    Devuelve el catálogo de ejercicios.
    
    - **grupo_muscular**: Filtro opcional.
    - **search**: Búsqueda de texto parcial en el nombre.
    """
    query = select(Ejercicio)
    if grupo_muscular:
        query = query.where(Ejercicio.grupo_muscular == grupo_muscular)
    if search:
        query = query.where(Ejercicio.nombre.contains(search))
    
    return session.exec(query).all()

@router.post(
    "/ejercicios/", 
    response_model=EjercicioRead,
    summary="Crear nuevo ejercicio",
    description="Agrega un nuevo ejercicio al catálogo global.",
    status_code=status.HTTP_201_CREATED
)
def create_ejercicio(
    ejercicio: EjercicioCreate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    db_ejercicio = Ejercicio.from_orm(ejercicio)
    session.add(db_ejercicio)
    session.commit()
    session.refresh(db_ejercicio)
    return db_ejercicio

# --- RUTINAS ---

@router.get(
    "/rutinas/cliente/{cliente_id}", 
    response_model=List[RutinaReadWithDetails],
    summary="Obtener rutinas de un cliente",
    description="Devuelve el historial completo de rutinas asignadas a un cliente específico, incluyendo los detalles de días y ejercicios."
)
def get_rutinas_cliente(
    cliente_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    # Obtener rutinas activas primero
    rutinas = session.exec(
        select(Rutina)
        .where(Rutina.cliente_id == cliente_id)
        .order_by(Rutina.fecha_inicio.desc())
    ).all()
    
    # Construir respuesta anidada (esto podría optimizarse con joins, pero por simplicidad iteramos)
    result = []
    for rutina in rutinas:
        rutina_read = RutinaReadWithDetails.from_orm(rutina)
        dias_read = []
        
        # Cargar dias
        dias = session.exec(select(DiaRutina).where(DiaRutina.rutina_id == rutina.id).order_by(DiaRutina.orden)).all()
        
        for dia in dias:
            dia_obj = {"id": dia.id, "nombre": dia.nombre, "orden": dia.orden, "ejercicios": []}
            
            # Cargar detalles (ejercicios del día)
            detalles = session.exec(
                select(DetalleRutina, Ejercicio.nombre)
                .join(Ejercicio)
                .where(DetalleRutina.dia_rutina_id == dia.id)
                .order_by(DetalleRutina.orden)
            ).all()
            
            for det, nombre_ejercicio in detalles:
                det_dict = det.dict()
                det_dict["ejercicio_nombre"] = nombre_ejercicio
                dia_obj["ejercicios"].append(det_dict)
            
            dias_read.append(dia_obj)
        
        rutina_read.dias = dias_read
        result.append(rutina_read)
        
    return result

# Esquema complejo para crear rutina completa
from pydantic import BaseModel, Field

class DetalleRoutineInput(BaseModel):
    ejercicio_id: int = Field(..., description="ID del ejercicio del catálogo")
    series: int = Field(..., ge=1, le=10)
    repeticiones: str = Field(..., example="10-12")
    peso_sugerido: Optional[str] = Field(None, example="RPE 8")
    descanso_segundos: int = Field(60, description="Tiempo de descanso en segundos")
    notas: Optional[str] = None

class DiaRoutineInput(BaseModel):
    nombre: str = Field(..., example="Día A: Pecho y Tríceps")
    orden: int = Field(..., ge=1)
    ejercicios: List[DetalleRoutineInput]

class FullRutinaCreate(RutinaCreate):
    dias: List[DiaRoutineInput]

@router.post(
    "/rutinas/", 
    response_model=RutinaRead,
    summary="Crear Rutina Completa",
    description="Crea una rutina completa con sus días y ejercicios asignados en una sola operación transaccional.",
    status_code=status.HTTP_201_CREATED
)
def create_rutina_completa(
    rutina_data: FullRutinaCreate,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    """
    Crea una estructura completa de rutina:
    1. **Cabecera**: Info general (nombre, cliente, objetivo).
    2. **Días**: Lista de días de entrenamiento.
    3. **Ejercicios**: Detalles de cada ejercicio por día.
    """
    # 1. Crear Rutina Base
    nueva_rutina = Rutina(
        nombre=rutina_data.nombre,
        descripcion=rutina_data.descripcion,
        objetivo=rutina_data.objetivo,
        nivel=rutina_data.nivel,
        duracion_semanas=rutina_data.duracion_semanas,
        cliente_id=rutina_data.cliente_id,
        entrenador_id=current_user.id, # Asignar al usuario actual
        active=True
    )
    session.add(nueva_rutina)
    session.flush() # Para obtener ID
    
    # 2. Iterar Días
    for dia_in in rutina_data.dias:
        nuevo_dia = DiaRutina(
            rutina_id=nueva_rutina.id,
            nombre=dia_in.nombre,
            orden=dia_in.orden
        )
        session.add(nuevo_dia)
        session.flush() # ID del día
        
        # 3. Iterar Ejercicios
        for idx, ejer_in in enumerate(dia_in.ejercicios):
            nuevo_detalle = DetalleRutina(
                dia_rutina_id=nuevo_dia.id,
                ejercicio_id=ejer_in.ejercicio_id,
                orden=idx + 1,
                series=ejer_in.series,
                repeticiones=ejer_in.repeticiones,
                peso_sugerido=ejer_in.peso_sugerido,
                descanso_segundos=ejer_in.descanso_segundos,
                notas=ejer_in.notas
            )
            session.add(nuevo_detalle)
            
    session.commit()
    session.refresh(nueva_rutina)
    return nueva_rutina

@router.delete("/rutinas/{rutina_id}")
def delete_rutina(
    rutina_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    # Validar permisos (solo admin o el creador)
    if current_user.role != "admin" and rutina.entrenador_id != current_user.id:
         raise HTTPException(status_code=403, detail="No tienes permiso para eliminar esta rutina")
         
    session.delete(rutina)
    session.commit()
    return {"message": "Rutina eliminada correctamente"}
