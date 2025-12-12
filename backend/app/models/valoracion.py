from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from enum import Enum

class TipoValoracion(str, Enum):
    INICIAL = "INICIAL"
    SEGUIMIENTO = "SEGUIMIENTO"
    FINAL = "FINAL"

class ValoracionFisica(SQLModel, table=True):
    __tablename__ = "valoraciones_fisicas"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    cliente_id: int = Field(foreign_key="clientegym.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    tipo: TipoValoracion = Field(default=TipoValoracion.SEGUIMIENTO)
    
    # Medidas Antropométricas
    peso: float = Field(description="Peso en kg")
    altura: float = Field(description="Altura en cm")
    imc: Optional[float] = Field(default=None, description="Índice de Masa Corporal")
    
    # Perímetros (en cm)
    perimetro_cuello: Optional[float] = None
    perimetro_hombros: Optional[float] = None
    perimetro_pecho: Optional[float] = None
    perimetro_cintura: Optional[float] = None
    perimetro_cadera: Optional[float] = None
    perimetro_brazo_derecho: Optional[float] = None
    perimetro_brazo_izquierdo: Optional[float] = None
    perimetro_antebrazo_derecho: Optional[float] = None
    perimetro_antebrazo_izquierdo: Optional[float] = None
    perimetro_muslo_derecho: Optional[float] = None
    perimetro_muslo_izquierdo: Optional[float] = None
    perimetro_pantorrilla_derecha: Optional[float] = None
    perimetro_pantorrilla_izquierda: Optional[float] = None
    
    # Composición Corporal
    porcentaje_grasa: Optional[float] = None
    masa_muscular: Optional[float] = None
    masa_osea: Optional[float] = None
    agua_corporal: Optional[float] = None
    grasa_visceral: Optional[float] = None
    
    # Pliegues Cutáneos (en mm)
    pliegue_triceps: Optional[float] = None
    pliegue_subescapular: Optional[float] = None
    pliegue_suprailiaco: Optional[float] = None
    pliegue_abdominal: Optional[float] = None
    pliegue_muslo: Optional[float] = None
    
    # Pruebas de Rendimiento
    flexiones_1min: Optional[int] = None
    abdominales_1min: Optional[int] = None
    sentadillas_1min: Optional[int] = None
    plancha_segundos: Optional[int] = None
    flexibilidad_cm: Optional[float] = None
    
    # Cardiovascular
    frecuencia_cardiaca_reposo: Optional[int] = None
    presion_arterial_sistolica: Optional[int] = None
    presion_arterial_diastolica: Optional[int] = None
    
    # Notas y Observaciones
    notas: Optional[str] = None
    objetivos: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    # cliente: Optional["ClienteGym"] = Relationship(back_populates="valoraciones")

# Pydantic Models para API
class ValoracionFisicaCreate(SQLModel):
    cliente_id: int
    tipo: TipoValoracion = TipoValoracion.SEGUIMIENTO
    
    # Medidas básicas (requeridas)
    peso: float
    altura: float
    
    # Perímetros (opcionales)
    perimetro_cuello: Optional[float] = None
    perimetro_hombros: Optional[float] = None
    perimetro_pecho: Optional[float] = None
    perimetro_cintura: Optional[float] = None
    perimetro_cadera: Optional[float] = None
    perimetro_brazo_derecho: Optional[float] = None
    perimetro_brazo_izquierdo: Optional[float] = None
    perimetro_antebrazo_derecho: Optional[float] = None
    perimetro_antebrazo_izquierdo: Optional[float] = None
    perimetro_muslo_derecho: Optional[float] = None
    perimetro_muslo_izquierdo: Optional[float] = None
    perimetro_pantorrilla_derecha: Optional[float] = None
    perimetro_pantorrilla_izquierda: Optional[float] = None
    
    # Composición Corporal (opcionales)
    porcentaje_grasa: Optional[float] = None
    masa_muscular: Optional[float] = None
    masa_osea: Optional[float] = None
    agua_corporal: Optional[float] = None
    grasa_visceral: Optional[float] = None
    
    # Pliegues Cutáneos (opcionales)
    pliegue_triceps: Optional[float] = None
    pliegue_subescapular: Optional[float] = None
    pliegue_suprailiaco: Optional[float] = None
    pliegue_abdominal: Optional[float] = None
    pliegue_muslo: Optional[float] = None
    
    # Pruebas de Rendimiento (opcionales)
    flexiones_1min: Optional[int] = None
    abdominales_1min: Optional[int] = None
    sentadillas_1min: Optional[int] = None
    plancha_segundos: Optional[int] = None
    flexibilidad_cm: Optional[float] = None
    
    # Cardiovascular (opcionales)
    frecuencia_cardiaca_reposo: Optional[int] = None
    presion_arterial_sistolica: Optional[int] = None
    presion_arterial_diastolica: Optional[int] = None
    
    # Notas (opcionales)
    notas: Optional[str] = None
    objetivos: Optional[str] = None

class ValoracionFisicaRead(SQLModel):
    id: int
    cliente_id: int
    fecha: datetime
    tipo: TipoValoracion
    
    # Medidas básicas
    peso: float
    altura: float
    imc: Optional[float]
    
    # Perímetros
    perimetro_cuello: Optional[float]
    perimetro_hombros: Optional[float]
    perimetro_pecho: Optional[float]
    perimetro_cintura: Optional[float]
    perimetro_cadera: Optional[float]
    perimetro_brazo_derecho: Optional[float]
    perimetro_brazo_izquierdo: Optional[float]
    perimetro_antebrazo_derecho: Optional[float]
    perimetro_antebrazo_izquierdo: Optional[float]
    perimetro_muslo_derecho: Optional[float]
    perimetro_muslo_izquierdo: Optional[float]
    perimetro_pantorrilla_derecha: Optional[float]
    perimetro_pantorrilla_izquierda: Optional[float]
    
    # Composición Corporal
    porcentaje_grasa: Optional[float]
    masa_muscular: Optional[float]
    masa_osea: Optional[float]
    agua_corporal: Optional[float]
    grasa_visceral: Optional[float]
    
    # Pliegues Cutáneos
    pliegue_triceps: Optional[float]
    pliegue_subescapular: Optional[float]
    pliegue_suprailiaco: Optional[float]
    pliegue_abdominal: Optional[float]
    pliegue_muslo: Optional[float]
    
    # Pruebas de Rendimiento
    flexiones_1min: Optional[int]
    abdominales_1min: Optional[int]
    sentadillas_1min: Optional[int]
    plancha_segundos: Optional[int]
    flexibilidad_cm: Optional[float]
    
    # Cardiovascular
    frecuencia_cardiaca_reposo: Optional[int]
    presion_arterial_sistolica: Optional[int]
    presion_arterial_diastolica: Optional[int]
    
    # Notas
    notas: Optional[str]
    objetivos: Optional[str]
    
    # Metadata
    created_at: datetime
    updated_at: datetime

class ValoracionFisicaUpdate(SQLModel):
    tipo: Optional[TipoValoracion] = None
    peso: Optional[float] = None
    altura: Optional[float] = None
    
    perimetro_cuello: Optional[float] = None
    perimetro_hombros: Optional[float] = None
    perimetro_pecho: Optional[float] = None
    perimetro_cintura: Optional[float] = None
    perimetro_cadera: Optional[float] = None
    perimetro_brazo_derecho: Optional[float] = None
    perimetro_brazo_izquierdo: Optional[float] = None
    perimetro_antebrazo_derecho: Optional[float] = None
    perimetro_antebrazo_izquierdo: Optional[float] = None
    perimetro_muslo_derecho: Optional[float] = None
    perimetro_muslo_izquierdo: Optional[float] = None
    perimetro_pantorrilla_derecha: Optional[float] = None
    perimetro_pantorrilla_izquierda: Optional[float] = None
    
    porcentaje_grasa: Optional[float] = None
    masa_muscular: Optional[float] = None
    masa_osea: Optional[float] = None
    agua_corporal: Optional[float] = None
    grasa_visceral: Optional[float] = None
    
    pliegue_triceps: Optional[float] = None
    pliegue_subescapular: Optional[float] = None
    pliegue_suprailiaco: Optional[float] = None
    pliegue_abdominal: Optional[float] = None
    pliegue_muslo: Optional[float] = None
    
    flexiones_1min: Optional[int] = None
    abdominales_1min: Optional[int] = None
    sentadillas_1min: Optional[int] = None
    plancha_segundos: Optional[int] = None
    flexibilidad_cm: Optional[float] = None
    
    frecuencia_cardiaca_reposo: Optional[int] = None
    presion_arterial_sistolica: Optional[int] = None
    presion_arterial_diastolica: Optional[int] = None
    
    notas: Optional[str] = None
    objetivos: Optional[str] = None
