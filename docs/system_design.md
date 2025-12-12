# Diseño del Sistema - Aplicación de Gestión de Gimnasio

## 1. Enfoque de Implementación (Offline/Low-Resource Edition)

Implementaremos una aplicación web moderna empaquetada como ejecutable para Windows.

### Stack Tecnológico

- **Frontend**: React con TypeScript, Shadcn-ui, Tailwind CSS. Construido como SPA estática.
- **Backend**: FastAPI con Python 3.11+. Sirve tanto la API como los archivos estáticos del frontend.
- **Base de Datos**: **SQLite** con SQLModel. Archivo local `gym.db`. Zero-config.
- **Empaquetado**: **PyInstaller** para generar un solo `.exe`.

### Decisiones Arquitectónicas Clave (Ajustadas)

1. **Arquitectura Monolítica de Despliegue**: Durante el desarrollo, Frontend y Backend corren separados. En producción (el ejecutable), FastAPI sirve el build de React.
2. **Base de Datos Embebida**: SQLite reemplaza a PostgreSQL para eliminar requisitos de instalación de servidor de BD.
3. **Assets Locales**: Todo (fuentes, iconos, librerías) debe estar empaquetado. No CDN.

## 2. Arquitectura de Carpetas

```
dev-laoz-gym-management-app/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   └── run.py (Entry point para PyInstaller)
├── frontend/ (React Vite Project)
└── docs/
    └── system_design.md
```

[... resto del diseño original del usuario ...]
