# 🏋️ GymApp - Sistema de Gestión Integral de Gimnasios

**Versión Actual:** 1.0.0-beta
**Fecha de Actualización:** 12 de Diciembre, 2025
**Estado:** Desarrollo Activo

---

## 1. 🌟 Visión General

GymApp es una solución moderna y escalable para la administración de centros de acondicionamiento físico. Combina un backend robusto en Python (FastAPI) con un frontend reactivo (React + Vite), todo estilizado con el sistema de diseño propio **WaveArtCSS**.

### Características Principales

- **Gestión de Clientes:** Altas, bajas, perfiles detallados.
- **Control de Usuarios:** Sistema de roles (Admin, Entrenador, Recepción) con seguridad JWT.
- **Valoraciones Físicas:** Seguimiento avanzado de progreso con gráficos y estadísticas.
- **Diseño Premium:** Interfaz moderna, oscura y responsiva.
- **Arquitectura Local:** Diseñado para funcionar offline con base de datos SQLite.

---

## 2. 🎨 Sistema de Diseño (UI/UX)

El proyecto utiliza una integración híbrida de **WaveArtCSS** (librería base) y estilos personalizados de **GymApp**.

### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| **Primary Blue** | `#2563EB` | Botones principales, enlaces, acentos activos |
| **Success Green** | `#10B981` | Indicadores de progreso positivo, confirmaciones |
| **Danger Red** | `#EF4444` | Errores, acciones destructivas, alertas |
| **Background Dark** | `#0F172A` | Fondo del sidebar y elementos oscuros |
| **Surface White** | `#FFFFFF` | Tarjetas, modales, contenedores |
| **Text Primary** | `#1E293B` | Títulos y texto principal |
| **Text Secondary** | `#64748B` | Subtítulos y metadatos |

### Tipografía

- **Familia:** Inter (Google Fonts)
- **Pesos:** Regular (400), Medium (500), Bold (700)
- **Escala:** Sistema modular (xs, sm, base, lg, xl, 2xl, 3xl)

### Componentes Clave

- **Sidebar:** Navegación vertical persistente con estados activos.
- **Tarjetas (Cards):** Contenedores con sombra suave (`shadow-sm`) y bordes redondeados (`radius-lg`).
- **Tablas:** Diseño limpio con cabeceras diferenciadas y filas con hover.
- **Modales:** Ventanas emergentes centradas con overlay oscuro.
- **Gráficos:** Visualizaciones interactivas con `recharts`.

---

## 3. 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Frontend:** React 18, TypeScript, Vite
- **Estilos:** WaveArtCSS (CSS Variables), Lucide React (Iconos)
- **Backend:** Python 3.9+, FastAPI, SQLModel (SQLAlchemy + Pydantic)
- **Base de Datos:** SQLite (local)
- **Empaquetado:** PyInstaller (para ejecutable .exe)

### Estructura de Directorios

```
dev-laoz-gym-management-app/
├── backend/
│   ├── app/
│   │   ├── api/            # Endpoints (auth, clients, users, valoraciones)
│   │   ├── core/           # Config, seguridad, db
│   │   ├── models/         # Modelos SQLModel
│   │   └── main.py         # Entry point
│   ├── scripts/            # Scripts de utilidad (seed data)
│   └── venv/               # Entorno virtual
├── frontend/
│   ├── src/
│   │   ├── features/       # Módulos (auth, dashboard, clients, valoraciones)
│   │   ├── styles/         # CSS (main.css, variables)
│   │   └── main.tsx        # Entry point React
│   └── public/             # Assets estáticos
├── docs/                   # Documentación del proyecto
└── installers/             # Ejecutables generados
```

---

## 4. 📦 Módulos Implementados

### A. Autenticación y Seguridad

- **Login:** Autenticación JWT con expiración.
- **Protección:** Rutas protegidas en frontend y backend.
- **Roles:** Diferenciación entre Administradores y Usuarios estándar.

### B. Gestión de Clientes

- **CRUD Completo:** Crear, Leer, Actualizar, Eliminar clientes.
- **Listado:** Tabla con búsqueda y filtros (pendiente).
- **Detalle:** Información de contacto y estado de membresía.

### C. Gestión de Usuarios (Staff)

- **Administración:** Gestión de cuentas de empleados.
- **Permisos:** Asignación de roles y estados (Activo/Inactivo).

### D. Valoraciones Físicas (Nuevo 🚀)

- **Registro:** Peso, altura, medidas corporales (13 zonas), pliegues, pruebas de fuerza.
- **Cálculos:** IMC automático, % Grasa, Masa Muscular.
- **Historial:** Registro cronológico de evaluaciones.
- **Reportes:** Modal de progreso con:
  - Gráficos de línea (Peso, IMC).
  - Gráfico dual (Grasa vs Músculo).
  - Indicadores de tendencia (flechas de mejora/empeoramiento).
  - Resumen comparativo (Antes vs Después).

---

## 5. 💾 Modelo de Datos

### Tablas Principales

#### `Usuario`

- `id`: PK
- `email`: Unique
- `hashed_password`
- `full_name`
- `role`: [ADMIN, USER]
- `is_active`: Boolean

#### `ClienteGym`

- `id`: PK
- `nombre`
- `apellido`
- `email`: Unique
- `telefono`
- `fecha_registro`
- `tipo_membresia`: [MENSUAL, TRIMESTRAL, ANUAL]
- `estado`: [ACTIVO, INACTIVO, PENDIENTE]

#### `ValoracionFisica`

- `id`: PK
- `cliente_id`: FK -> ClienteGym
- `fecha`: DateTime
- `tipo`: [INICIAL, SEGUIMIENTO, FINAL]
- `peso`, `altura`, `imc`
- `perimetro_*` (cintura, cadera, brazo, etc.)
- `porcentaje_grasa`, `masa_muscular`
- `flexiones`, `sentadillas`, `plancha`

---

## 6. 🔌 API Endpoints

### Autenticación

- `POST /api/auth/login`: Obtener token JWT.

### Clientes

- `GET /api/clients/`: Listar clientes.
- `POST /api/clients/`: Crear cliente.
- `GET /api/clients/{id}`: Detalle cliente.
- `PATCH /api/clients/{id}`: Actualizar cliente.
- `DELETE /api/clients/{id}`: Eliminar cliente.

### Valoraciones

- `GET /api/valoraciones/`: Listar (filtro `?cliente_id=X`).
- `POST /api/valoraciones/`: Crear valoración.
- `GET /api/valoraciones/cliente/{id}/progreso`: Obtener estadísticas de progreso.

---

## 7. 🚀 Instalación y Ejecución

### Prerrequisitos

- Python 3.9+
- Node.js 16+

### Pasos para Desarrollo

1. **Backend:**

   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Generación de Ejecutable

Ejecutar el script automático:

```bash
.\build_installer.bat
```

Esto generará un archivo `.exe` en la carpeta `dist/` o `installers/`.

---

## 8. 📅 Próximos Pasos (Roadmap)

1. **Gestión de Pagos:** Registro de mensualidades, historial y recordatorios.
2. **Entrenamientos:** Asignación de rutinas personalizadas.
3. **Fotos de Progreso:** Módulo para subir y comparar fotos antes/después.
4. **Exportar Reportes:** Generación de PDF para enviar a clientes.
5. **Dashboard Principal:** Widgets con métricas globales del gimnasio.

---

**Documentación generada por el Asistente de Desarrollo AI (Google Deepmind)**
