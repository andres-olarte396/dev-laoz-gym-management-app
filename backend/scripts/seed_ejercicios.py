from sqlmodel import Session, select
from app.core.db import engine, create_db_and_tables
from app.models.entrenamiento import Ejercicio
# Importar modelos dependientes para que SQLModel los registre
from app.models.client import ClienteGym
from app.models.user import Usuario

def seed_ejercicios():
    create_db_and_tables()
    ejercicios_data = [
        # Pecho
        {"nombre": "Press de Banca Plano (Barra)", "grupo_muscular": "Pecho", "equipo_necesario": "Barra"},
        {"nombre": "Press Inclinado (Mancuernas)", "grupo_muscular": "Pecho", "equipo_necesario": "Mancuernas"},
        {"nombre": "Aperturas con Polea", "grupo_muscular": "Pecho", "equipo_necesario": "Máquina"},
        {"nombre": "Flexiones (Push-ups)", "grupo_muscular": "Pecho", "equipo_necesario": "Peso Corporal"},
        
        # Espalda
        {"nombre": "Dominadas", "grupo_muscular": "Espalda", "equipo_necesario": "Peso Corporal"},
        {"nombre": "Remo con Barra", "grupo_muscular": "Espalda", "equipo_necesario": "Barra"},
        {"nombre": "Jalón al Pecho (Polea)", "grupo_muscular": "Espalda", "equipo_necesario": "Máquina"},
        {"nombre": "Remo Unilateral con Mancuerna", "grupo_muscular": "Espalda", "equipo_necesario": "Mancuernas"},
        
        # Pierna
        {"nombre": "Sentadilla Libre (Squat)", "grupo_muscular": "Pierna", "equipo_necesario": "Barra"},
        {"nombre": "Prensa de Piernas", "grupo_muscular": "Pierna", "equipo_necesario": "Máquina"},
        {"nombre": "Peso Muerto Rumano", "grupo_muscular": "Pierna", "equipo_necesario": "Barra"},
        {"nombre": "Extensiones de Cuádriceps", "grupo_muscular": "Pierna", "equipo_necesario": "Máquina"},
        {"nombre": "Curl Femoral Tumbado", "grupo_muscular": "Pierna", "equipo_necesario": "Máquina"},
        {"nombre": "Elevación de Gemelos", "grupo_muscular": "Pierna", "equipo_necesario": "Máquina"},
        
        # Hombro
        {"nombre": "Press Militar (Mancuernas)", "grupo_muscular": "Hombro", "equipo_necesario": "Mancuernas"},
        {"nombre": "Elevaciones Laterales", "grupo_muscular": "Hombro", "equipo_necesario": "Mancuernas"},
        {"nombre": "Pájaros (Posterior)", "grupo_muscular": "Hombro", "equipo_necesario": "Mancuernas"},
        
        # Brazos
        {"nombre": "Curl de Bíceps con Barra", "grupo_muscular": "Brazos", "equipo_necesario": "Barra"},
        {"nombre": "Curl Martillo", "grupo_muscular": "Brazos", "equipo_necesario": "Mancuernas"},
        {"nombre": "Extensiones de Tríceps en Polea", "grupo_muscular": "Brazos", "equipo_necesario": "Máquina"},
        {"nombre": "Fondos en Paralelas", "grupo_muscular": "Brazos", "equipo_necesario": "Peso Corporal"},
        
        # Core
        {"nombre": "Plancha Abdominal", "grupo_muscular": "Core", "equipo_necesario": "Peso Corporal"},
        {"nombre": "Crunch Abdominal", "grupo_muscular": "Core", "equipo_necesario": "Peso Corporal"},
        {"nombre": "Elevación de Piernas", "grupo_muscular": "Core", "equipo_necesario": "Peso Corporal"},
    ]

    with Session(engine) as session:
        count = 0
        for data in ejercicios_data:
            # Check if exists
            exists = session.exec(select(Ejercicio).where(Ejercicio.nombre == data["nombre"])).first()
            if not exists:
                ejercicio = Ejercicio(**data)
                session.add(ejercicio)
                count += 1
        
        session.commit()
        print(f"✅ Se han insertado {count} ejercicios nuevos en el catálogo.")

if __name__ == "__main__":
    seed_ejercicios()
