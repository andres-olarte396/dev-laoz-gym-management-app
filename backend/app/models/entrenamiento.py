from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

# --- Parte 1: Catálogo de Ejercicios ---

class EjercicioBase(SQLModel):
    nombre: str = Field(index=True)
    grupo_muscular: str # Pecho, Espalda, Pierna, Hombro, Brazo, Core, Cardio
    descripcion: Optional[str] = None
    equipo_necesario: Optional[str] = None # Mancuernas, Barra, Máquina, Peso Corporal
    video_url: Optional[str] = None # Link a video explicativo (opcional)

class Ejercicio(EjercicioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Un ejercicio puede estar en muchos detalles de rutina
    detalles: List["DetalleRutina"] = Relationship(back_populates="ejercicio")

class EjercicioCreate(EjercicioBase):
    pass

class EjercicioRead(EjercicioBase):
    id: int

# --- Parte 2: Estructura de Rutinas ---

class RutinaBase(SQLModel):
    nombre: str # Ej: "Hipertrofia 4 días", "Pérdida de Grasa Principiante"
    descripcion: Optional[str] = None
    objetivo: Optional[str] = None
    nivel: str = "Intermedio" # Principiante, Intermedio, Avanzado
    duracion_semanas: int = 4

class Rutina(RutinaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cliente_id: int = Field(foreign_key="clientegym.id")
    entrenador_id: int = Field(foreign_key="usuario.id")
    activo: bool = True
    fecha_inicio: datetime = Field(default_factory=datetime.utcnow)
    fecha_fin: Optional[datetime] = None
    
    # Relaciones
    # cliente: Optional["ClienteGym"] = Relationship(back_populates="rutinas")
    # entrenador: Optional["Usuario"] = Relationship(back_populates="rutinas_asignadas")
    dias: List["DiaRutina"] = Relationship(back_populates="rutina", sa_relationship_kwargs={"cascade": "all, delete"})

class RutinaCreate(RutinaBase):
    cliente_id: int

class RutinaRead(RutinaBase):
    id: int
    cliente_id: int
    entrenador_id: int
    activo: bool
    fecha_inicio: datetime

# --- Parte 3: Días y Detalles ---

class DiaRutinaBase(SQLModel):
    nombre: str # Ej: "Día A: Empuje", "Día 1: Pierna Completa"
    orden: int # 1, 2, 3...

class DiaRutina(DiaRutinaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutina.id")
    
    rutina: Rutina = Relationship(back_populates="dias")
    ejercicios: List["DetalleRutina"] = Relationship(back_populates="dia_rutina", sa_relationship_kwargs={"cascade": "all, delete"})

class DetalleRutinaBase(SQLModel):
    orden: int # Orden dentro del día
    series: int
    repeticiones: str # "10-12", "Al fallo", "15"
    peso_sugerido: Optional[str] = None # "20kg", "RPE 8"
    descanso_segundos: int = 60
    notas: Optional[str] = None

class DetalleRutina(DetalleRutinaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    dia_rutina_id: int = Field(foreign_key="diarutina.id")
    ejercicio_id: int = Field(foreign_key="ejercicio.id")
    
    dia_rutina: DiaRutina = Relationship(back_populates="ejercicios")
    ejercicio: Ejercicio = Relationship(back_populates="detalles")

# Modelos compuestos para lectura (Nested)
class DetalleRutinaRead(DetalleRutinaBase):
    id: int
    ejercicio_nombre: str # Flattened para facilitar frontend

class DiaRutinaRead(DiaRutinaBase):
    id: int
    ejercicios: List[DetalleRutinaRead] = []

class RutinaReadWithDetails(RutinaRead):
    dias: List[DiaRutinaRead] = []
