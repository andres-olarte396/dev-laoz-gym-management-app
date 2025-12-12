# 🏋️ GymApp - Suite de Gestión para Centros Fitness

> **Solución integral, moderna y eficiente para la administración de gimnasios, centros de entrenamiento y estudios fitness.**

**GymApp** es una plataforma completa que unifica la gestión administrativa y el seguimiento deportivo de los clientes. Diseñada con una arquitectura moderna de microservicios monolíticos, ofrece un rendimiento excepcional y una experiencia de usuario premium gracias a su sistema de diseño exclusivo **WaveArtCSS**.

---

## 🌟 Características Destacadas

### 🎯 Gestión Administrativa

- **Control Total de Clientes:** Base de datos centralizada con perfiles detallados.
- **Gestión de Staff:** Roles diferenciados para administradores y entrenadores.
- **Seguridad Robusta:** Autenticación JWT y protección de datos.

### 📈 Seguimiento Deportivo (Nuevo Módulo)

- **Valoraciones Físicas Profesionales:** Registro detallado de antropometría y composición corporal.
- **Visualización de Progreso:** Gráficos interactivos de evolución (Peso, Grasa, Músculo).
- **Reportes Exportables:** Generación de informes PDF profesionales para los clientes.
- **Historial Completo:** Trazabilidad total del avance de cada usuario.

### 🎨 Experiencia de Usuario (UX)

- **Interfaz Moderna:** Diseño oscuro elegante basado en WaveArtCSS.
- **Responsividad:** Adaptable a diferentes tamaños de pantalla.
- **Velocidad:** Frontend reactivo optimizado con Vite.

---

## 🏗️ Arquitectura del Proyecto

El proyecto está dividido en dos componentes principales que se comunican vía API REST:

| Componente | Tecnología | Descripción |
|------------|------------|-------------|
| **Frontend** | React + TS + Vite | Interfaz de usuario SPA con gestión de estado y gráficos. |
| **Backend** | FastAPI + SQLModel | Servidor API de alto rendimiento con base de datos SQLite. |
| **Estilos** | WaveArtCSS | Sistema de diseño propietario integrado. |

---

## 📂 Organización del Repositorio

```text
dev-laoz-gym-management-app/
├── backend/            # API Servidor (Python/FastAPI)
│   ├── app/            # Código fuente del backend
│   └── README.md       # Documentación específica del backend
│
├── frontend/           # Cliente Web (React/Vite)
│   ├── src/            # Código fuente del frontend
│   └── README.md       # Documentación específica del frontend
│
├── docs/               # Documentación Técnica Detallada
│   └── project_documentation_v1.md  # Manual de arquitectura completo
│
└── installers/         # Ejecutables generados (.exe)
```

---

## 🚀 Guía Rápida de Instalación

Para levantar todo el entorno de desarrollo en tu máquina local:

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd dev-laoz-gym-management-app
```

### 2. Iniciar el Backend

En una terminal:

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Iniciar el Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. ¡Listo

- **App:** Abre `http://localhost:5173` en tu navegador.
- **API Docs:** Visita `http://localhost:8000/docs`.

---

## 📄 Documentación Adicional

Para profundizar en áreas específicas, consulta nuestras guías detalladas:

- 📘 **[Visión General y Arquitectura](./docs/project_documentation_v1.md)**
- 🖥️ **[Guía de Frontend](./frontend/README.md)**
- 🐍 **[Guía de Backend](./backend/README.md)**

---

## 🤝 Contribución

Este proyecto está en desarrollo activo (**v1.0.0-beta**). Las contribuciones son bienvenidas, especialmente en módulos de:

- Gestión de Pagos
- Rutinas de Entrenamiento
- Notificaciones Automáticas

---

**Desarrollado con ❤️ para la comunidad fitness.**
