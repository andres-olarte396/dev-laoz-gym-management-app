# 🐍 GymApp Backend

API RESTful robusta y eficiente para la gestión integral de gimnasios. Construida con **FastAPI**, **SQLModel** y **Python**. Este backend maneja toda la lógica de negocio, autenticación, gestión de datos y cálculos automáticos.

---

## 🚀 Características del Backend

### 🔐 Seguridad y Autenticación

- **OAuth2 con Password Flow:** Autenticación estandarizada.
- **JWT (JSON Web Tokens):** Tokens de acceso seguros y expirables.
- **Hashing de Contraseñas:** Uso de `bcrypt` para almacenamiento seguro.
- **Middleware CORS:** Configurado para comunicación segura con el frontend.

### 📦 Gestión de Datos (Modelos)

- **Usuarios (Staff):** Administradores y entrenadores.
- **Clientes:** Perfiles detallados, membresías y estados.
- **Valoraciones Físicas:**
  - Modelo complejo con más de 20 metricas de salud.
  - Relaciones One-to-Many con Clientes.
  - Timestamps automáticos (created_at, updated_at).

### ⚙️ Lógica de Negocio

- **Cálculo Automático de IMC:** Al crear/actualizar valoraciones.
- **Análisis de Progreso:** Comparación de hitos (inicial vs final).
- **Validación de Datos:** Uso de Pydantic para garantizar integridad.

---

## 🛠️ Stack Tecnológico

- **Framework:** FastAPI (Alto rendimiento, asíncrono)
- **ORM:** SQLModel (Combina SQLAlchemy + Pydantic)
- **Base de Datos:** SQLite (Por defecto, fácil de migrar a PostgreSQL)
- **Validación:** Pydantic V2
- **Servidor:** Uvicorn (ASGI)

---

## 📂 Estructura del Proyecto

```text
backend/
├── app/
│   ├── api/            # Endpoints (Rutas)
│   │   ├── auth.py         # Login y Tokens
│   │   ├── clients.py      # CRUD Clientes
│   │   ├── users.py        # CRUD Usuarios
│   │   └── valoraciones.py # CRUD Valoraciones y Progreso
│   ├── core/           # Configuración base
│   │   ├── config.py       # Variables de entorno
│   │   ├── db.py           # Conexión DB
│   │   └── security.py     # Lógica JWT y Hashing
│   ├── models/         # Definición de tablas
│   └── main.py         # Punto de entrada de la aplicación
├── scripts/            # Scripts de utilidad (seed data)
├── requirements.txt    # Dependencias
└── gym.db              # Archivo de base de datos SQLite
```

---

## ⚡ Guía de Inicio Rápido

### Prerrequisitos

- Python 3.9 o superior

### 1. Configuración del Entorno

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Instalación de Dependencias

```bash
pip install -r requirements.txt
```

### 3. Ejecución del Servidor

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`.

### 4. Documentación Interactiva

FastAPI genera documentación automática:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 🧪 Scripts de Utilidad

### Generar Datos de Prueba

Para poblar la base de datos con valoraciones de ejemplo:

```bash
python scripts/create_sample_valoraciones.py
```

---

## 📚 Referencias

- 📘 **[Documentación Maestra](../docs/project_documentation_v1.md)**
- 🖥️ **[Frontend README](../frontend/README.md)**

---

**Estado:** 🟢 Estable - API v1
