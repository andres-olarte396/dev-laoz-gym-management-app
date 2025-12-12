# 🏋️ GymApp Frontend

Frontend moderno y reactivo para el sistema de Gestión Integral de Gimnasios "GymApp". Construido con **React**, **TypeScript** y **Vite**, y estilizado con el sistema de diseño exclusivo **WaveArtCSS**.

---

## 🚀 Características Principales

### 🖥️ Dashboard Interactivo

- Acceso rápido a módulos clave.
- Resumen de estadísticas (próximamente).
- Navegación fluida con Sidebar persistente.

### 👥 Gestión de Clientes

- Listado completo con filtros de búsqueda.
- Altas, bajas y modificaciones de clientes.
- Visualización de estado de membresía.

### 📊 Valoraciones Físicas (Nuevo)

- **Registro Completo:** Antropometría, composición corporal, pruebas de fuerza.
- **Cálculos Automáticos:** IMC, progreso de peso.
- **Visualización Avanzada:** Gráficos interactivos con `recharts`.
- **Reportes Profesionales:** Generación y descarga de reportes de progreso en **PDF**.
- **Comparativas:** Indicadores de tendencias (mejoras/retrocesos).

### 🔐 Seguridad y Usuarios

- Autenticación JWT integrada.
- Gestión de roles y permisos.
- Protección de rutas privadas.

---

## 🛠️ Stack Tecnológico

- **Core:** React 18, TypeScript, Vite
- **Estilos:** [WaveArtCSS](https://github.com/tu-usuario/dev-laoz-WaveArtCSS) (Sistema de diseño propio)
- **Iconos:** Lucide React
- **Gráficos:** Recharts
- **Formularios:** React Hook Form (o manejo de estado local optimizado)
- **PDF:** jsPDF, html2canvas, jspdf-autotable
- **HTTP Client:** Fetch API nativa con interceptores (auth context)

---

## 📂 Estructura del Proyecto

```text
src/
├── features/           # Módulos funcionales
│   ├── auth/           # Login, Contexto de Seguridad
│   ├── clients/        # Lista y formularios de Clientes
│   ├── dashboard/      # Layout principal y widgets
│   ├── users/          # Gestión de cuentas de staff
│   └── valoraciones/   # Módulo de evaluaciones físicas y progreso
├── styles/             # Archivos CSS globales y variables
├── Assets/             # Imágenes y recursos estáticos
├── App.tsx             # Componente raíz y Rutas
└── main.tsx            # Punto de entrada
```

---

## ⚡ Guía de Inicio Rápido

### Prerrequisitos

- Node.js 16+
- Backend de GymApp corriendo en `http://localhost:8000`

### 1. Instalación

```bash
cd frontend
npm install
```

### 2. Desarrollo

Inicia el servidor de desarrollo local:

```bash
npm run dev
```

Accede a `http://localhost:5173` (o el puerto que indique la terminal).

### 3. Build para Producción

Genera los archivos estáticos optimizados en `dist/`:

```bash
npm run build
```

---

## 📚 Documentación Relacionada

Para una visión más detallada de la arquitectura global y el backend, consulta:

- 📘 **[Documentación Maestra del Proyecto](../docs/project_documentation_v1.md)**: Visión general, arquitectura y modelos de datos.
- 📐 **Backend README**: Detalles sobre la API Python/FastAPI (en `../backend/README.md`).

---

## 🎨 Sistema de Diseño

Este frontend utiliza **WaveArtCSS**, una librería de estilos minimalista y moderna.

- **Variables CSS:** Se definen en `src/styles/variables.css` (o importadas de la librería).
- **Componentes:** Botones, inputs, tarjetas y modales siguen las pautas de diseño de WaveArt.

---

**Estado del Proyecto:** 🟢 Activo - Versión 1.0.0-beta
**Última Actualización:** 12 de Diciembre, 2025
