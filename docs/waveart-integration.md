# Integración de WaveArtCSS en GymApp

## Descripción

Este documento describe cómo se integró la librería de estilos **WaveArtCSS** en el proyecto GymApp para mejorar la experiencia visual y la consistencia del diseño.

## ¿Qué es WaveArtCSS?

WaveArtCSS es una librería CSS modular diseñada para facilitar la creación de interfaces modernas, responsivas y accesibles. Incluye:

- **Sistema de temas** con soporte para modo claro/oscuro
- **Componentes reutilizables** (botones, formularios, tarjetas, etc.)
- **Animaciones avanzadas** con `@keyframes` y scroll-driven animations
- **Utilidades CSS** para espaciado, alineación y layouts
- **Diseño responsivo** con CSS Grid y Flexbox

## Archivos Integrados

Los siguientes archivos de WaveArtCSS se copiaron a `frontend/public/css/`:

1. **`theme.css`** - Variables de colores, tipografías y temas
2. **`base.css`** - Estilos base y normalización
3. **`components.css`** - Componentes reutilizables
4. **`animations.css`** - Animaciones y transiciones
5. **`utilities.css`** - Clases utilitarias

## Estilos Personalizados de GymApp

Además de WaveArtCSS, se creó `gymapp.css` con estilos específicos para la aplicación:

### Variables Personalizadas

```css
:root {
  /* Colores de marca */
  --gym-primary: #2563EB;
  --gym-secondary: #10B981;
  --gym-accent: #F59E0B;
  --gym-danger: #EF4444;
  
  /* Espaciado */
  --gym-spacing-xs: 0.25rem;
  --gym-spacing-sm: 0.5rem;
  --gym-spacing-md: 1rem;
  --gym-spacing-lg: 1.5rem;
  --gym-spacing-xl: 2rem;
}
```

### Componentes Personalizados

#### 1. Sidebar de Navegación

```css
.gym-sidebar
.gym-sidebar-header
.gym-sidebar-nav
.gym-sidebar-footer
.gym-nav-button
```

#### 2. Tarjetas de Estadísticas

```css
.gym-stat-card
.gym-stat-card-header
.gym-stat-card-value
.gym-stat-card-label
```

#### 3. Tablas Mejoradas

```css
.gym-table
```

#### 4. Badges

```css
.gym-badge
.gym-badge-primary
.gym-badge-success
.gym-badge-warning
.gym-badge-danger
.gym-badge-purple
.gym-badge-gray
```

#### 5. Modales

```css
.gym-modal-overlay
.gym-modal
.gym-modal-header
.gym-modal-title
.gym-modal-close
```

#### 6. Formularios

```css
.gym-form-group
.gym-form-label
.gym-form-input
.gym-form-select
.gym-form-checkbox
```

#### 7. Botones

```css
.gym-button
.gym-button-primary
.gym-button-secondary
.gym-button-danger
.gym-button-icon
```

### Utilidades Adicionales

```css
.gym-flex-center
.gym-flex-between
.gym-grid-2
.gym-grid-3
```

## Cómo Usar

### 1. Clases de WaveArtCSS

Puedes usar cualquier clase de WaveArtCSS directamente en tus componentes:

```tsx
// Ejemplo de uso de utilidades de espaciado
<div className="m-4 p-6">
  <h1 className="text-center">Título</h1>
</div>
```

### 2. Clases Personalizadas de GymApp

Usa las clases con prefijo `gym-` para componentes específicos:

```tsx
// Ejemplo de tarjeta de estadística
<div className="gym-stat-card">
  <div className="gym-stat-card-header">
    <div>
      <p className="gym-stat-card-label">Total Clientes</p>
      <p className="gym-stat-card-value">42</p>
    </div>
  </div>
</div>
```

### 3. Badges de Estado

```tsx
<span className="gym-badge gym-badge-success">Activo</span>
<span className="gym-badge gym-badge-danger">Inactivo</span>
<span className="gym-badge gym-badge-primary">Presencial</span>
```

### 4. Botones

```tsx
<button className="gym-button gym-button-primary">
  Guardar
</button>

<button className="gym-button gym-button-secondary">
  Cancelar
</button>

<button className="gym-button-icon">
  <EditIcon />
</button>
```

## Responsive Design

Todos los componentes son responsivos por defecto. En pantallas móviles (< 768px):

- El sidebar se adapta a ancho completo
- Las grids se convierten en columna única
- Los modales ocupan el 95% del ancho
- Las tablas reducen su tamaño de fuente

## Modo Oscuro

Los estilos incluyen soporte para modo oscuro usando `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  /* Estilos para modo oscuro */
}
```

## Animaciones

Se incluyen animaciones predefinidas:

- `fadeIn` - Aparición suave
- `slideUp` - Deslizamiento hacia arriba
- `slideDown` - Deslizamiento hacia abajo

Uso:

```css
.elemento {
  animation: fadeIn 200ms ease-in-out;
}
```

## Próximos Pasos

1. **Migrar componentes existentes** para usar las clases de WaveArtCSS
2. **Crear componentes reutilizables** basados en los estilos de GymApp
3. **Implementar tema personalizable** para diferentes gimnasios
4. **Agregar más animaciones** para mejorar la UX

## Referencias

- [WaveArtCSS Repository](file:///e:/MyRepos/dev-laoz-WaveArtCSS)
- [WaveArtCSS README](file:///e:/MyRepos/dev-laoz-WaveArtCSS/README.md)
- [Ejemplos de WaveArtCSS](file:///e:/MyRepos/dev-laoz-WaveArtCSS/examples)

---

**Fecha de Integración**: 2025-12-11  
**Versión de WaveArtCSS**: Latest  
**Autor**: Equipo GymApp
