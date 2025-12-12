# Diseño del Sistema - Aplicación de Gestión de Gimnasio

## 1. Enfoque de Implementación

Implementaremos una aplicación web moderna con las siguientes características técnicas:

### Desafíos Técnicos y Soluciones

1. **Gestión de Entrenamientos Personalizados**:
   - Solución: Sistema de plantillas reutilizables con capacidad de personalización completa
2. **Control de Asistencia en Tiempo Real**:

   - Solución: Endpoints optimizados con actualizaciones incrementales y cache estratégico

3. **Reportes y Estadísticas**:
   - Solución: Queries optimizadas con agregaciones en base de datos y cache de resultados

## 2. Patrones de Interacción Usuario-UI

### Flujo Principal - Entrenador

1. **Login y Dashboard**

   - Entrenador ingresa credenciales → Validación → Redirección a dashboard
   - Dashboard muestra: resumen de pagos pendientes, clases del día, alertas importantes

2. **Gestión de Usuarios**

   - Entrenador accede a lista de usuarios → Puede filtrar por tipo (virtual/presencial/híbrido)
   - Click en usuario → Ver perfil completo con historial de pagos, asistencias, valoraciones
   - Botón "Agregar Usuario" → Formulario modal → Guardar y refrescar lista

3. **Registro de Pagos**

   - Entrenador selecciona usuario → Click "Registrar Pago"
   - Formulario: monto, concepto (mensualidad/sesión), método de pago, fecha
   - Confirmación → Actualización automática del estado de cuenta

4. **Creación de Entrenamientos**

   - Entrenador selecciona usuario → Sección "Entrenamientos"
   - Click "Nuevo Entrenamiento" → Editor con bloques de ejercicios
   - Agregar ejercicios: nombre, series, repeticiones, peso, notas
   - Guardar → Notificación al usuario

5. **Registro de Valoraciones**

   - Entrenador selecciona usuario → "Nueva Valoración"
   - Formulario extenso: medidas corporales, composición, pruebas físicas
   - Guardar → Histórico de valoraciones con gráficos de progreso

6. **Control de Asistencia**
   - Vista de calendario/lista de sesiones programadas
   - Marcar asistencia: presente/ausente/justificado
   - Filtros por fecha, usuario, tipo de sesión

### Flujo Principal - Usuario

1. **Login y Panel Personal**

   - Usuario ingresa → Dashboard con información personalizada
   - Vista de: próximas sesiones, plan de entrenamiento actual, estado de pagos

2. **Ver Entrenamientos**

   - Acceso a plan de entrenamiento asignado
   - Visualización clara de ejercicios con instrucciones
   - Marcar ejercicios como completados (opcional)

3. **Historial de Valoraciones**

   - Lista de valoraciones realizadas
   - Gráficos de evolución de métricas clave
   - Comparación entre valoraciones

4. **Estado de Cuenta**
   - Visualización de pagos realizados
   - Pagos pendientes con fechas de vencimiento
   - Historial completo de transacciones

## 3. Arquitectura del Sistema

```plantuml
@startuml
!define RECTANGLE class

package "Frontend - React + TypeScript" {
    [Componentes UI] as UI
    [Gestión de Estado] as State
    [Servicios API] as APIService
    [Rutas Protegidas] as Routes
    [Contexto de Auth] as AuthContext
}

package "Backend - FastAPI" {
    [API Gateway] as Gateway
    [Controladores] as Controllers
    [Servicios de Negocio] as Services
    [Repositorios] as Repos
    [Middleware Auth] as AuthMiddleware
    [Validadores] as Validators
}

package "Capa de Datos" {
    database "PostgreSQL" as DB {
        [Usuarios]
        [Entrenadores]
        [Pagos]
        [Entrenamientos]
        [Valoraciones]
        [Asistencias]
    }
}

package "Servicios Externos" {
    [Generación de Reportes] as Reports
    [Sistema de Notificaciones] as Notifications
}

UI --> State
State --> APIService
APIService --> AuthContext
Routes --> AuthContext
APIService --> Gateway

Gateway --> AuthMiddleware
AuthMiddleware --> Controllers
Controllers --> Validators
Controllers --> Services
Services --> Repos
Repos --> DB

Services --> Reports
Services --> Notifications

note right of AuthMiddleware
  Validación JWT
  Verificación de roles
  Rate limiting
end note

note right of DB
  Connection Pool: 20 conexiones
  Índices optimizados
  Constraints de integridad
end note

@enduml
```

## 4. Flujo de Navegación UI

```plantuml
@startuml
[*] --> Login

state "Login" as Login {
    [*] --> FormularioLogin
    FormularioLogin --> ValidandoCredenciales
    ValidandoCredenciales --> [*] : Éxito
}

state "Dashboard Entrenador" as DashboardTrainer {
    [*] --> VistaResumen
    VistaResumen --> GestionUsuarios : Ver usuarios
    VistaResumen --> RegistroPagos : Registrar pago
    VistaResumen --> ControlAsistencia : Ver asistencias
    VistaResumen --> Estadisticas : Ver reportes
}

state "Gestión Usuarios" as GestionUsuarios {
    [*] --> ListaUsuarios
    ListaUsuarios --> PerfilUsuario : Seleccionar usuario
    ListaUsuarios --> FormularioNuevoUsuario : Agregar usuario
    PerfilUsuario --> EditarUsuario : Editar
    PerfilUsuario --> CrearEntrenamiento : Nuevo entrenamiento
    PerfilUsuario --> RegistrarValoracion : Nueva valoración
    PerfilUsuario --> VerHistorial : Ver historial
}

state "Dashboard Usuario" as DashboardUser {
    [*] --> VistaPersonal
    VistaPersonal --> MisEntrenamientos : Ver entrenamientos
    VistaPersonal --> MisValoraciones : Ver valoraciones
    VistaPersonal --> EstadoCuenta : Ver pagos
    VistaPersonal --> MiPerfil : Ver perfil
}

Login --> DashboardTrainer : Rol: Entrenador
Login --> DashboardUser : Rol: Usuario

DashboardTrainer --> Login : Cerrar sesión
DashboardUser --> Login : Cerrar sesión

GestionUsuarios --> DashboardTrainer : Volver
RegistroPagos --> DashboardTrainer : Volver
ControlAsistencia --> DashboardTrainer : Volver
Estadisticas --> DashboardTrainer : Volver

MisEntrenamientos --> DashboardUser : Volver
MisValoraciones --> DashboardUser : Volver
EstadoCuenta --> DashboardUser : Volver
MiPerfil --> DashboardUser : Volver

note right of DashboardTrainer
  Navegación principal:
  - Usuarios (alta frecuencia)
  - Pagos (alta frecuencia)
  - Asistencia (media frecuencia)
  - Reportes (baja frecuencia)
end note

note right of DashboardUser
  Navegación simplificada:
  - Entrenamientos (alta frecuencia)
  - Valoraciones (media frecuencia)
  - Pagos (media frecuencia)
end note

@enduml
```

## 5. Diagrama de Clases y Estructuras de Datos

```plantuml
@startuml

enum TipoUsuario {
    VIRTUAL
    PRESENCIAL
    HIBRIDO
}

enum EstadoPago {
    PENDIENTE
    PAGADO
    VENCIDO
}

enum TipoAsistencia {
    PRESENTE
    AUSENTE
    JUSTIFICADO
}

enum RolUsuario {
    ENTRENADOR
    USUARIO
}

class Usuario {
    +id: UUID
    +email: str
    +password_hash: str
    +nombre: str
    +apellido: str
    +telefono: str
    +fecha_nacimiento: date
    +rol: RolUsuario
    +activo: bool
    +fecha_registro: datetime
    +ultima_conexion: datetime
    --
    +verificar_password(password: str): bool
    +generar_token(): str
}

class Entrenador {
    +id: UUID
    +usuario_id: UUID
    +especialidad: str
    +certificaciones: list[str]
    +biografia: str
    --
    +obtener_usuarios_asignados(): list[ClienteGym]
    +crear_entrenamiento(cliente_id: UUID, entrenamiento: Entrenamiento): Entrenamiento
}

class ClienteGym {
    +id: UUID
    +usuario_id: UUID
    +entrenador_id: UUID
    +tipo_usuario: TipoUsuario
    +objetivo_fitness: str
    +condiciones_medicas: str
    +fecha_inicio: date
    +activo: bool
    --
    +obtener_entrenamientos_activos(): list[Entrenamiento]
    +obtener_valoraciones(): list[Valoracion]
    +calcular_deuda_pendiente(): float
}

class Pago {
    +id: UUID
    +cliente_id: UUID
    +monto: float
    +concepto: str
    +metodo_pago: str
    +fecha_pago: datetime
    +periodo_inicio: date
    +periodo_fin: date
    +estado: EstadoPago
    +notas: str
    +registrado_por: UUID
    --
    +marcar_como_pagado(): void
    +generar_recibo(): dict
}

class Entrenamiento {
    +id: UUID
    +cliente_id: UUID
    +entrenador_id: UUID
    +nombre: str
    +descripcion: str
    +fecha_creacion: datetime
    +fecha_inicio: date
    +fecha_fin: date
    +activo: bool
    +ejercicios: list[Ejercicio]
    --
    +agregar_ejercicio(ejercicio: Ejercicio): void
    +clonar_entrenamiento(): Entrenamiento
    +obtener_progreso(): dict
}

class Ejercicio {
    +id: UUID
    +entrenamiento_id: UUID
    +nombre: str
    +descripcion: str
    +series: int
    +repeticiones: str
    +peso: float
    +tiempo_descanso: int
    +orden: int
    +video_url: str
    +notas: str
    --
    +validar_datos(): bool
}

class Valoracion {
    +id: UUID
    +cliente_id: UUID
    +entrenador_id: UUID
    +fecha_valoracion: datetime
    +peso: float
    +altura: float
    +imc: float
    +porcentaje_grasa: float
    +masa_muscular: float
    +perimetro_cintura: float
    +perimetro_cadera: float
    +perimetro_pecho: float
    +perimetro_brazo: float
    +perimetro_pierna: float
    +presion_arterial: str
    +frecuencia_cardiaca: int
    +flexibilidad: str
    +fuerza: str
    +resistencia: str
    +observaciones: str
    --
    +calcular_imc(): float
    +comparar_con_anterior(anterior: Valoracion): dict
}

class Asistencia {
    +id: UUID
    +cliente_id: UUID
    +fecha: date
    +hora_entrada: time
    +hora_salida: time
    +tipo: TipoAsistencia
    +sesion_programada: bool
    +notas: str
    +registrado_por: UUID
    --
    +calcular_duracion(): int
    +marcar_presente(): void
}

class Sesion {
    +id: UUID
    +cliente_id: UUID
    +entrenador_id: UUID
    +fecha_programada: datetime
    +duracion_minutos: int
    +tipo_sesion: str
    +modalidad: TipoUsuario
    +completada: bool
    +notas: str
    --
    +marcar_completada(): void
    +reprogramar(nueva_fecha: datetime): void
}

' Relaciones
Usuario "1" -- "0..1" Entrenador
Usuario "1" -- "0..1" ClienteGym
Entrenador "1" -- "0..*" ClienteGym : gestiona
ClienteGym "1" -- "0..*" Pago : tiene
ClienteGym "1" -- "0..*" Entrenamiento : recibe
ClienteGym "1" -- "0..*" Valoracion : tiene
ClienteGym "1" -- "0..*" Asistencia : registra
ClienteGym "1" -- "0..*" Sesion : programa
Entrenador "1" -- "0..*" Entrenamiento : crea
Entrenador "1" -- "0..*" Valoracion : realiza
Entrenamiento "1" -- "1..*" Ejercicio : contiene
Sesion "1" -- "0..1" Asistencia : genera

@enduml
```

## 6. Diagrama de Secuencia - Flujos Principales

### 6.1 Flujo de Autenticación

```plantuml
@startuml
actor Usuario
participant "Frontend\nLogin" as FE
participant "API Gateway" as API
participant "Auth Service" as Auth
participant "Database" as DB

Usuario -> FE: Ingresa credenciales
activate FE

FE -> FE: Validar formato (email, password)
FE -> API: POST /api/auth/login
activate API
note right
    Input: {
        "email": "string",
        "password": "string"
    }
end note

API -> Auth: autenticar_usuario(email, password)
activate Auth

Auth -> DB: SELECT * FROM usuarios WHERE email = ?
activate DB
DB --> Auth: Usuario encontrado
deactivate DB

Auth -> Auth: verificar_password_hash()
Auth -> Auth: generar_access_token()
Auth -> Auth: generar_refresh_token()

Auth --> API: Tokens generados
deactivate Auth

API --> FE: 200 OK
deactivate API
note right
    Output: {
        "access_token": "string",
        "refresh_token": "string",
        "token_type": "Bearer",
        "usuario": {
            "id": "uuid",
            "email": "string",
            "nombre": "string",
            "rol": "ENTRENADOR|USUARIO"
        }
    }
end note

FE -> FE: Guardar tokens en localStorage
FE -> FE: Establecer contexto de autenticación
FE -> FE: Redirigir según rol
FE --> Usuario: Dashboard cargado
deactivate FE

@enduml
```

### 6.2 Flujo de Creación de Entrenamiento Personalizado

```plantuml
@startuml
actor Entrenador
participant "Frontend\nEntrenamiento" as FE
participant "API Gateway" as API
participant "Entrenamiento\nService" as ES
participant "Database" as DB

Entrenador -> FE: Selecciona cliente
Entrenador -> FE: Click "Nuevo Entrenamiento"
activate FE

FE -> FE: Mostrar formulario
Entrenador -> FE: Completa datos básicos
Entrenador -> FE: Agrega ejercicios

FE -> API: POST /api/entrenamientos
activate API
note right
    Input: {
        "cliente_id": "uuid",
        "nombre": "string",
        "descripcion": "string",
        "fecha_inicio": "date",
        "fecha_fin": "date",
        "ejercicios": [
            {
                "nombre": "string",
                "series": int,
                "repeticiones": "string",
                "peso": float,
                "tiempo_descanso": int,
                "orden": int,
                "notas": "string"
            }
        ]
    }
end note

API -> API: Validar token JWT
API -> API: Verificar rol ENTRENADOR

API -> ES: crear_entrenamiento(datos)
activate ES

ES -> ES: Validar datos con Pydantic
ES -> DB: BEGIN TRANSACTION
activate DB

ES -> DB: INSERT INTO entrenamientos
DB --> ES: entrenamiento_id

loop Para cada ejercicio
    ES -> DB: INSERT INTO ejercicios
    DB --> ES: ejercicio_id
end

ES -> DB: COMMIT TRANSACTION
DB --> ES: Confirmación
deactivate DB

ES -> ES: Generar notificación para cliente
ES --> API: Entrenamiento creado
deactivate ES

API --> FE: 201 Created
deactivate API
note right
    Output: {
        "id": "uuid",
        "cliente_id": "uuid",
        "nombre": "string",
        "fecha_creacion": "datetime",
        "ejercicios": [
            {
                "id": "uuid",
                "nombre": "string",
                "series": int,
                "repeticiones": "string"
            }
        ]
    }
end note

FE -> FE: Actualizar lista de entrenamientos
FE --> Entrenador: Confirmación visual
deactivate FE

@enduml
```

### 6.3 Flujo de Registro de Pago

```plantuml
@startuml
actor Entrenador
participant "Frontend\nPagos" as FE
participant "API Gateway" as API
participant "Pago Service" as PS
participant "Database" as DB
participant "Notificación\nService" as NS

Entrenador -> FE: Selecciona cliente
Entrenador -> FE: Click "Registrar Pago"
activate FE

FE -> API: GET /api/clientes/{id}/deuda
activate API
API -> DB: Consultar pagos pendientes
activate DB
DB --> API: Deuda actual
deactivate DB
API --> FE: Información de deuda
deactivate API

FE -> FE: Mostrar formulario con deuda
Entrenador -> FE: Completa datos del pago

FE -> API: POST /api/pagos
activate API
note right
    Input: {
        "cliente_id": "uuid",
        "monto": float,
        "concepto": "string",
        "metodo_pago": "string",
        "fecha_pago": "datetime",
        "periodo_inicio": "date",
        "periodo_fin": "date",
        "notas": "string"
    }
end note

API -> API: Validar token y rol
API -> PS: registrar_pago(datos)
activate PS

PS -> PS: Validar monto > 0
PS -> DB: BEGIN TRANSACTION
activate DB

PS -> DB: INSERT INTO pagos
DB --> PS: pago_id

PS -> DB: UPDATE cliente SET ultimo_pago = ?
DB --> PS: Actualizado

PS -> DB: COMMIT TRANSACTION
DB --> PS: Confirmación
deactivate DB

PS -> NS: enviar_confirmacion_pago(cliente_id, pago_id)
activate NS
NS --> PS: Notificación enviada
deactivate NS

PS --> API: Pago registrado
deactivate PS

API --> FE: 201 Created
deactivate API
note right
    Output: {
        "id": "uuid",
        "cliente_id": "uuid",
        "monto": float,
        "concepto": "string",
        "fecha_pago": "datetime",
        "estado": "PAGADO"
    }
end note

FE -> FE: Actualizar estado de cuenta
FE --> Entrenador: Confirmación + Recibo
deactivate FE

@enduml
```

### 6.4 Flujo de Registro de Valoración Física

```plantuml
@startuml
actor Entrenador
participant "Frontend\nValoraciones" as FE
participant "API Gateway" as API
participant "Valoracion\nService" as VS
participant "Database" as DB

Entrenador -> FE: Selecciona cliente
Entrenador -> FE: Click "Nueva Valoración"
activate FE

FE -> API: GET /api/clientes/{id}/valoraciones/ultima
activate API
API -> DB: SELECT última valoración
activate DB
DB --> API: Valoración anterior (si existe)
deactivate DB
API --> FE: Datos de referencia
deactivate API

FE -> FE: Mostrar formulario con comparativa
Entrenador -> FE: Completa mediciones

FE -> API: POST /api/valoraciones
activate API
note right
    Input: {
        "cliente_id": "uuid",
        "fecha_valoracion": "datetime",
        "peso": float,
        "altura": float,
        "porcentaje_grasa": float,
        "masa_muscular": float,
        "perimetro_cintura": float,
        "perimetro_cadera": float,
        "perimetro_pecho": float,
        "perimetro_brazo": float,
        "perimetro_pierna": float,
        "presion_arterial": "string",
        "frecuencia_cardiaca": int,
        "flexibilidad": "string",
        "fuerza": "string",
        "resistencia": "string",
        "observaciones": "string"
    }
end note

API -> API: Validar token y rol
API -> VS: crear_valoracion(datos)
activate VS

VS -> VS: Calcular IMC automáticamente
VS -> VS: Validar rangos de valores

VS -> DB: BEGIN TRANSACTION
activate DB

VS -> DB: INSERT INTO valoraciones
DB --> VS: valoracion_id

VS -> DB: SELECT valoración anterior
DB --> VS: Valoración previa

VS -> VS: Calcular diferencias y progreso

VS -> DB: COMMIT TRANSACTION
DB --> VS: Confirmación
deactivate DB

VS --> API: Valoración creada con análisis
deactivate VS

API --> FE: 201 Created
deactivate API
note right
    Output: {
        "id": "uuid",
        "cliente_id": "uuid",
        "fecha_valoracion": "datetime",
        "imc": float,
        "peso": float,
        "porcentaje_grasa": float,
        "comparativa": {
            "peso_diferencia": float,
            "grasa_diferencia": float,
            "musculo_diferencia": float
        }
    }
end note

FE -> FE: Mostrar gráficos de progreso
FE --> Entrenador: Valoración guardada
deactivate FE

@enduml
```

### 6.5 Flujo de Control de Asistencia

```plantuml
@startuml
actor Entrenador
participant "Frontend\nAsistencia" as FE
participant "API Gateway" as API
participant "Asistencia\nService" as AS
participant "Database" as DB

Entrenador -> FE: Accede a control de asistencia
activate FE

FE -> API: GET /api/asistencias/hoy
activate API
API -> DB: SELECT sesiones programadas para hoy
activate DB
DB --> API: Lista de sesiones
deactivate DB
API --> FE: Sesiones del día
deactivate API

FE -> FE: Mostrar lista de clientes esperados
Entrenador -> FE: Marca asistencia de cliente

FE -> API: POST /api/asistencias
activate API
note right
    Input: {
        "cliente_id": "uuid",
        "fecha": "date",
        "hora_entrada": "time",
        "tipo": "PRESENTE|AUSENTE|JUSTIFICADO",
        "sesion_programada": bool,
        "notas": "string"
    }
end note

API -> API: Validar token y rol
API -> AS: registrar_asistencia(datos)
activate AS

AS -> DB: BEGIN TRANSACTION
activate DB

AS -> DB: INSERT INTO asistencias
DB --> AS: asistencia_id

AS -> DB: UPDATE sesiones SET completada = true
DB --> AS: Actualizado

AS -> DB: SELECT COUNT asistencias del mes
DB --> AS: Total asistencias

AS -> DB: COMMIT TRANSACTION
DB --> AS: Confirmación
deactivate DB

AS --> API: Asistencia registrada
deactivate AS

API --> FE: 201 Created
deactivate API
note right
    Output: {
        "id": "uuid",
        "cliente_id": "uuid",
        "fecha": "date",
        "tipo": "PRESENTE",
        "hora_entrada": "time",
        "estadisticas_mes": {
            "total_asistencias": int,
            "porcentaje_asistencia": float
        }
    }
end note

FE -> FE: Actualizar vista de asistencias
FE --> Entrenador: Confirmación visual
deactivate FE

@enduml
```

## 7. Diagrama de Entidad-Relación (Base de Datos)

```plantuml
@startuml

entity "usuarios" as usuarios {
    * id : UUID <<PK>>
    --
    * email : VARCHAR(255) <<UNIQUE>>
    * password_hash : VARCHAR(255)
    * nombre : VARCHAR(100)
    * apellido : VARCHAR(100)
    telefono : VARCHAR(20)
    fecha_nacimiento : DATE
    * rol : ENUM('ENTRENADOR', 'USUARIO')
    * activo : BOOLEAN
    * fecha_registro : TIMESTAMP
    ultima_conexion : TIMESTAMP
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "entrenadores" as entrenadores {
    * id : UUID <<PK>>
    --
    * usuario_id : UUID <<FK>> <<UNIQUE>>
    especialidad : VARCHAR(200)
    certificaciones : JSONB
    biografia : TEXT
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "clientes_gym" as clientes {
    * id : UUID <<PK>>
    --
    * usuario_id : UUID <<FK>> <<UNIQUE>>
    * entrenador_id : UUID <<FK>>
    * tipo_usuario : ENUM('VIRTUAL', 'PRESENCIAL', 'HIBRIDO')
    objetivo_fitness : TEXT
    condiciones_medicas : TEXT
    * fecha_inicio : DATE
    * activo : BOOLEAN
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "pagos" as pagos {
    * id : UUID <<PK>>
    --
    * cliente_id : UUID <<FK>>
    * monto : DECIMAL(10,2)
    * concepto : VARCHAR(200)
    * metodo_pago : VARCHAR(50)
    * fecha_pago : TIMESTAMP
    periodo_inicio : DATE
    periodo_fin : DATE
    * estado : ENUM('PENDIENTE', 'PAGADO', 'VENCIDO')
    notas : TEXT
    * registrado_por : UUID <<FK>>
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "entrenamientos" as entrenamientos {
    * id : UUID <<PK>>
    --
    * cliente_id : UUID <<FK>>
    * entrenador_id : UUID <<FK>>
    * nombre : VARCHAR(200)
    descripcion : TEXT
    * fecha_creacion : TIMESTAMP
    fecha_inicio : DATE
    fecha_fin : DATE
    * activo : BOOLEAN
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "ejercicios" as ejercicios {
    * id : UUID <<PK>>
    --
    * entrenamiento_id : UUID <<FK>>
    * nombre : VARCHAR(200)
    descripcion : TEXT
    series : INTEGER
    repeticiones : VARCHAR(50)
    peso : DECIMAL(6,2)
    tiempo_descanso : INTEGER
    * orden : INTEGER
    video_url : VARCHAR(500)
    notas : TEXT
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "valoraciones" as valoraciones {
    * id : UUID <<PK>>
    --
    * cliente_id : UUID <<FK>>
    * entrenador_id : UUID <<FK>>
    * fecha_valoracion : TIMESTAMP
    peso : DECIMAL(5,2)
    altura : DECIMAL(5,2)
    imc : DECIMAL(5,2)
    porcentaje_grasa : DECIMAL(5,2)
    masa_muscular : DECIMAL(5,2)
    perimetro_cintura : DECIMAL(5,2)
    perimetro_cadera : DECIMAL(5,2)
    perimetro_pecho : DECIMAL(5,2)
    perimetro_brazo : DECIMAL(5,2)
    perimetro_pierna : DECIMAL(5,2)
    presion_arterial : VARCHAR(20)
    frecuencia_cardiaca : INTEGER
    flexibilidad : TEXT
    fuerza : TEXT
    resistencia : TEXT
    observaciones : TEXT
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "asistencias" as asistencias {
    * id : UUID <<PK>>
    --
    * cliente_id : UUID <<FK>>
    * fecha : DATE
    hora_entrada : TIME
    hora_salida : TIME
    * tipo : ENUM('PRESENTE', 'AUSENTE', 'JUSTIFICADO')
    sesion_programada : BOOLEAN
    notas : TEXT
    * registrado_por : UUID <<FK>>
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "sesiones" as sesiones {
    * id : UUID <<PK>>
    --
    * cliente_id : UUID <<FK>>
    * entrenador_id : UUID <<FK>>
    * fecha_programada : TIMESTAMP
    * duracion_minutos : INTEGER
    tipo_sesion : VARCHAR(100)
    modalidad : ENUM('VIRTUAL', 'PRESENCIAL', 'HIBRIDO')
    * completada : BOOLEAN
    notas : TEXT
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

' Relaciones
usuarios ||--o| entrenadores : "usuarios.id -> entrenadores.usuario_id"
usuarios ||--o| clientes : "usuarios.id -> clientes.usuario_id"
entrenadores ||--o{ clientes : "entrenadores.id -> clientes.entrenador_id"
clientes ||--o{ pagos : "clientes.id -> pagos.cliente_id"
clientes ||--o{ entrenamientos : "clientes.id -> entrenamientos.cliente_id"
clientes ||--o{ valoraciones : "clientes.id -> valoraciones.cliente_id"
clientes ||--o{ asistencias : "clientes.id -> asistencias.cliente_id"
clientes ||--o{ sesiones : "clientes.id -> sesiones.cliente_id"
entrenadores ||--o{ entrenamientos : "entrenadores.id -> entrenamientos.entrenador_id"
entrenadores ||--o{ valoraciones : "entrenadores.id -> valoraciones.entrenador_id"
entrenadores ||--o{ sesiones : "entrenadores.id -> sesiones.entrenador_id"
entrenamientos ||--|{ ejercicios : "entrenamientos.id -> ejercicios.entrenamiento_id"
usuarios ||--o{ pagos : "usuarios.id -> pagos.registrado_por"
usuarios ||--o{ asistencias : "usuarios.id -> asistencias.registrado_por"

@enduml
```

### Índices de Base de Datos para Optimización

```sql
-- Índices para mejorar rendimiento de consultas frecuentes
CREATE INDEX idx_clientes_entrenador ON clientes_gym(entrenador_id) WHERE activo = true;
CREATE INDEX idx_clientes_tipo ON clientes_gym(tipo_usuario);
CREATE INDEX idx_pagos_cliente_fecha ON pagos(cliente_id, fecha_pago DESC);
CREATE INDEX idx_pagos_estado ON pagos(estado) WHERE estado != 'PAGADO';
CREATE INDEX idx_entrenamientos_cliente_activo ON entrenamientos(cliente_id) WHERE activo = true;
CREATE INDEX idx_valoraciones_cliente_fecha ON valoraciones(cliente_id, fecha_valoracion DESC);
CREATE INDEX idx_asistencias_cliente_fecha ON asistencias(cliente_id, fecha DESC);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha) WHERE tipo = 'PRESENTE';
CREATE INDEX idx_sesiones_fecha ON sesiones(fecha_programada) WHERE completada = false;
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

## 8. Consideraciones de Escalabilidad y Rendimiento

### Para 10 Entrenadores Concurrentes

1. **Connection Pooling**

   - Pool mínimo: 5 conexiones
   - Pool máximo: 20 conexiones
   - Timeout: 30 segundos

2. **Caché de Datos**

   - Implementar Redis para cache de sesiones JWT
   - Cache de queries frecuentes (dashboard, listas de usuarios)
   - TTL: 5 minutos para datos dinámicos, 1 hora para datos estáticos

3. **Optimización de Queries**

   - Uso de índices compuestos para filtros comunes
   - Paginación en todas las listas (20 items por página)
   - Lazy loading de relaciones en ORM

4. **Rate Limiting**

   - 100 requests por minuto por usuario autenticado
   - 10 requests por minuto para endpoints de login

5. **Compresión de Respuestas**

   - Gzip para respuestas > 1KB
   - Reducción de payload en APIs (solo campos necesarios)

6. **Monitoreo**
   - Logging de errores y excepciones
   - Métricas de rendimiento de endpoints
   - Alertas para queries lentas (> 1 segundo)

## 9. Seguridad

### Medidas Implementadas

1. **Autenticación y Autorización**

   - JWT con expiración de 1 hora para access token
   - Refresh token con expiración de 7 días
   - Validación de roles en cada endpoint protegido
   - Hashing de contraseñas con bcrypt (cost factor: 12)

2. **Protección de Datos**

   - HTTPS obligatorio en producción
   - Sanitización de inputs (prevención de SQL injection)
   - Validación de datos con Pydantic/Zod
   - CORS configurado para dominios específicos

3. **Protección contra Ataques**

   - Rate limiting por IP y usuario
   - Protección CSRF en formularios
   - Headers de seguridad (X-Frame-Options, X-Content-Type-Options)
   - Validación de tamaño de archivos (si se implementa upload)

4. **Auditoría**
   - Logging de acciones críticas (creación, edición, eliminación)
   - Timestamps de creación y actualización en todas las tablas
   - Registro de quién realizó cada acción (registrado_por)

## 10. Aspectos No Claros o Supuestos

### Supuestos Realizados

1. **Gestión de Pagos**

   - Se asume que los pagos son solo registro y seguimiento, sin integración con pasarelas de pago reales
   - Los entrenadores registran manualmente los pagos recibidos
   - No se requiere generación automática de facturas fiscales

2. **Notificaciones**

   - Se asume notificaciones por email básicas
   - No se implementa sistema de notificaciones push en esta versión

3. **Entrenamientos Personalizados**

   - Los ejercicios se describen en texto, sin biblioteca predefinida
   - No se incluye sistema de videos integrado (solo URLs externas)
   - No hay tracking automático de progreso del usuario

4. **Valoraciones Físicas**

   - Las mediciones son ingresadas manualmente por el entrenador
   - No hay integración con dispositivos de medición (básculas inteligentes, etc.)

5. **Control de Asistencia**

   - El registro de asistencia es manual por parte del entrenador
   - No se implementa sistema de check-in automático con QR o biométrico

6. **Multiidioma**
   - La aplicación se desarrollará inicialmente solo en español
   - La internacionalización puede agregarse en versiones futuras

### Preguntas para Clarificación Futura

1. ¿Se requiere integración con sistemas de pago en línea en el futuro?
2. ¿Es necesario un sistema de reportes exportables (PDF, Excel)?
3. ¿Se necesita un módulo de comunicación interna (chat) entre entrenador y usuario?
4. ¿Hay requisitos específicos de cumplimiento normativo (protección de datos de salud)?
5. ¿Se planea expansión a más de 10 entrenadores en el corto plazo?

---

**Fecha de Creación**: 2025-11-23  
**Versión**: 1.0  
**Autor**: Bob (Arquitecto de Software)
