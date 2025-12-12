"""
Script para insertar datos de prueba de valoraciones físicas
Simula el progreso de un cliente a lo largo de 6 meses
"""
import sys
import os
from datetime import datetime, timedelta

# Agregar el directorio backend al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from sqlmodel import Session, select
from app.core.db import engine
from app.models.client import ClienteGym
from app.models.valoracion import ValoracionFisica, TipoValoracion

def create_sample_data():
    with Session(engine) as session:
        # Verificar si ya existe un cliente de prueba
        cliente = session.exec(
            select(ClienteGym).where(ClienteGym.email == "juan.perez@example.com")
        ).first()
        
        if not cliente:
            # Crear cliente de prueba
            cliente = ClienteGym(
                nombre="Juan",
                apellido="Pérez",
                email="juan.perez@example.com",
                telefono="555-0123",
                tipo_membresia="MENSUAL",
                estado="ACTIVO"
            )
            session.add(cliente)
            session.commit()
            session.refresh(cliente)
            print(f"✅ Cliente creado: {cliente.nombre} {cliente.apellido} (ID: {cliente.id})")
        else:
            print(f"ℹ️  Cliente ya existe: {cliente.nombre} {cliente.apellido} (ID: {cliente.id})")
        
        # Verificar si ya existen valoraciones para este cliente
        existing = session.exec(
            select(ValoracionFisica).where(ValoracionFisica.cliente_id == cliente.id)
        ).first()
        
        if existing:
            print(f"⚠️  Ya existen valoraciones para este cliente. Eliminando...")
            session.exec(
                select(ValoracionFisica).where(ValoracionFisica.cliente_id == cliente.id)
            ).all()
            for val in session.exec(select(ValoracionFisica).where(ValoracionFisica.cliente_id == cliente.id)).all():
                session.delete(val)
            session.commit()
        
        # Crear valoraciones con progreso realista
        # Simula un cliente que pierde peso y grasa, gana músculo
        base_date = datetime.now() - timedelta(days=180)  # Hace 6 meses
        
        valoraciones_data = [
            # Valoración Inicial (hace 6 meses)
            {
                "fecha": base_date,
                "tipo": TipoValoracion.INICIAL,
                "peso": 85.0,
                "altura": 175.0,
                "perimetro_cintura": 95.0,
                "perimetro_cadera": 105.0,
                "perimetro_pecho": 100.0,
                "porcentaje_grasa": 28.5,
                "masa_muscular": 55.0,
                "masa_osea": 3.2,
                "agua_corporal": 52.0,
                "flexiones_1min": 15,
                "abdominales_1min": 20,
                "sentadillas_1min": 25,
                "plancha_segundos": 30,
                "frecuencia_cardiaca_reposo": 75,
                "presion_arterial_sistolica": 130,
                "presion_arterial_diastolica": 85,
                "notas": "Cliente inicia programa de pérdida de peso. Objetivo: -10kg en 6 meses.",
                "objetivos": "Reducir grasa corporal, aumentar masa muscular, mejorar resistencia cardiovascular"
            },
            # Mes 1
            {
                "fecha": base_date + timedelta(days=30),
                "tipo": TipoValoracion.SEGUIMIENTO,
                "peso": 83.5,
                "altura": 175.0,
                "perimetro_cintura": 93.0,
                "perimetro_cadera": 104.0,
                "perimetro_pecho": 100.5,
                "porcentaje_grasa": 27.2,
                "masa_muscular": 56.0,
                "masa_osea": 3.2,
                "agua_corporal": 53.0,
                "flexiones_1min": 18,
                "abdominales_1min": 25,
                "sentadillas_1min": 30,
                "plancha_segundos": 40,
                "frecuencia_cardiaca_reposo": 72,
                "presion_arterial_sistolica": 128,
                "presion_arterial_diastolica": 83,
                "notas": "Buen progreso inicial. Cliente muy motivado."
            },
            # Mes 2
            {
                "fecha": base_date + timedelta(days=60),
                "tipo": TipoValoracion.SEGUIMIENTO,
                "peso": 81.8,
                "altura": 175.0,
                "perimetro_cintura": 91.0,
                "perimetro_cadera": 103.0,
                "perimetro_pecho": 101.0,
                "porcentaje_grasa": 25.8,
                "masa_muscular": 57.5,
                "masa_osea": 3.3,
                "agua_corporal": 54.0,
                "flexiones_1min": 22,
                "abdominales_1min": 30,
                "sentadillas_1min": 35,
                "plancha_segundos": 50,
                "frecuencia_cardiaca_reposo": 70,
                "presion_arterial_sistolica": 125,
                "presion_arterial_diastolica": 82,
                "notas": "Excelente progreso. Aumento visible de masa muscular."
            },
            # Mes 3
            {
                "fecha": base_date + timedelta(days=90),
                "tipo": TipoValoracion.SEGUIMIENTO,
                "peso": 80.5,
                "altura": 175.0,
                "perimetro_cintura": 89.5,
                "perimetro_cadera": 102.0,
                "perimetro_pecho": 101.5,
                "porcentaje_grasa": 24.5,
                "masa_muscular": 58.5,
                "masa_osea": 3.3,
                "agua_corporal": 54.5,
                "flexiones_1min": 25,
                "abdominales_1min": 35,
                "sentadillas_1min": 40,
                "plancha_segundos": 60,
                "frecuencia_cardiaca_reposo": 68,
                "presion_arterial_sistolica": 122,
                "presion_arterial_diastolica": 80,
                "notas": "Mitad del programa. Resultados muy satisfactorios."
            },
            # Mes 4
            {
                "fecha": base_date + timedelta(days=120),
                "tipo": TipoValoracion.SEGUIMIENTO,
                "peso": 79.0,
                "altura": 175.0,
                "perimetro_cintura": 88.0,
                "perimetro_cadera": 101.0,
                "perimetro_pecho": 102.0,
                "porcentaje_grasa": 23.0,
                "masa_muscular": 59.8,
                "masa_osea": 3.4,
                "agua_corporal": 55.0,
                "flexiones_1min": 28,
                "abdominales_1min": 38,
                "sentadillas_1min": 45,
                "plancha_segundos": 70,
                "frecuencia_cardiaca_reposo": 66,
                "presion_arterial_sistolica": 120,
                "presion_arterial_diastolica": 78,
                "notas": "Cliente reporta sentirse con más energía."
            },
            # Mes 5
            {
                "fecha": base_date + timedelta(days=150),
                "tipo": TipoValoracion.SEGUIMIENTO,
                "peso": 77.8,
                "altura": 175.0,
                "perimetro_cintura": 86.5,
                "perimetro_cadera": 100.0,
                "perimetro_pecho": 102.5,
                "porcentaje_grasa": 21.8,
                "masa_muscular": 60.5,
                "masa_osea": 3.4,
                "agua_corporal": 55.5,
                "flexiones_1min": 32,
                "abdominales_1min": 42,
                "sentadillas_1min": 50,
                "plancha_segundos": 80,
                "frecuencia_cardiaca_reposo": 64,
                "presion_arterial_sistolica": 118,
                "presion_arterial_diastolica": 76,
                "notas": "Cerca del objetivo. Excelente condición física."
            },
            # Mes 6 - Valoración Final
            {
                "fecha": base_date + timedelta(days=180),
                "tipo": TipoValoracion.FINAL,
                "peso": 76.5,
                "altura": 175.0,
                "perimetro_cintura": 85.0,
                "perimetro_cadera": 99.0,
                "perimetro_pecho": 103.0,
                "porcentaje_grasa": 20.5,
                "masa_muscular": 61.2,
                "masa_osea": 3.5,
                "agua_corporal": 56.0,
                "flexiones_1min": 35,
                "abdominales_1min": 45,
                "sentadillas_1min": 55,
                "plancha_segundos": 90,
                "frecuencia_cardiaca_reposo": 62,
                "presion_arterial_sistolica": 115,
                "presion_arterial_diastolica": 75,
                "notas": "¡Objetivo alcanzado! Pérdida de 8.5kg, -8% grasa, +6.2kg músculo. Cliente muy satisfecho.",
                "objetivos": "Mantener peso actual, continuar ganancia muscular"
            }
        ]
        
        print(f"\n📊 Creando {len(valoraciones_data)} valoraciones...")
        
        for i, data in enumerate(valoraciones_data, 1):
            valoracion = ValoracionFisica(
                cliente_id=cliente.id,
                **data
            )
            # El IMC se calcula automáticamente en el backend
            session.add(valoracion)
            print(f"  {i}. {data['tipo'].value} - {data['fecha'].strftime('%d/%m/%Y')} - Peso: {data['peso']}kg")
        
        session.commit()
        print(f"\n✅ Datos de prueba creados exitosamente!")
        print(f"\n📈 Resumen del Progreso:")
        print(f"   Peso: {valoraciones_data[0]['peso']}kg → {valoraciones_data[-1]['peso']}kg ({valoraciones_data[-1]['peso'] - valoraciones_data[0]['peso']:.1f}kg)")
        print(f"   % Grasa: {valoraciones_data[0]['porcentaje_grasa']}% → {valoraciones_data[-1]['porcentaje_grasa']}% ({valoraciones_data[-1]['porcentaje_grasa'] - valoraciones_data[0]['porcentaje_grasa']:.1f}%)")
        print(f"   Masa Muscular: {valoraciones_data[0]['masa_muscular']}kg → {valoraciones_data[-1]['masa_muscular']}kg (+{valoraciones_data[-1]['masa_muscular'] - valoraciones_data[0]['masa_muscular']:.1f}kg)")
        print(f"   Flexiones: {valoraciones_data[0]['flexiones_1min']} → {valoraciones_data[-1]['flexiones_1min']} (+{valoraciones_data[-1]['flexiones_1min'] - valoraciones_data[0]['flexiones_1min']})")
        print(f"\n🎯 Para ver el progreso:")
        print(f"   1. Ir a Valoraciones")
        print(f"   2. Filtrar por cliente: Juan Pérez")
        print(f"   3. Click en 'Ver Progreso'")

if __name__ == "__main__":
    print("🚀 Creando datos de prueba para Valoraciones Físicas...\n")
    create_sample_data()
