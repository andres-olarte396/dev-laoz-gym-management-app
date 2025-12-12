from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os

from app.core.db import create_db_and_tables, get_session
from app.api import auth, clients, users, valoraciones, entrenamientos
from app.core.config import settings
from app.models.user import Usuario, Role
from app.models.client import ClienteGym # Import to register table
from app.models.valoracion import ValoracionFisica # Import to register table
from app.core.security import get_password_hash
from sqlmodel import Session, select

# Startup event to create tables and seed admin
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # Seed Admin User if not exists
    from app.core.db import engine
    try:
        with Session(engine) as session:
            user = session.exec(select(Usuario).where(Usuario.email == "admin@gym.com")).first()
            if not user:
                admin_user = Usuario(
                    email="admin@gym.com",
                    full_name="Admin Entrenador",
                    hashed_password=get_password_hash("admin123"),
                    role=Role.ADMIN
                )
                session.add(admin_user)
                session.commit()
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error seeding admin user: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

# CORS (Allow all for local dev/offline app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(valoraciones.router, prefix="/api/valoraciones", tags=["valoraciones"])
app.include_router(entrenamientos.router, prefix="/api/entrenamientos", tags=["entrenamientos"])


@app.get("/health")
def health_check():
    return {"status": "ok", "mode": "offline-ready"}

# Mount Static Files (Frontend Build)
# We expect the 'static' folder to be in the same directory as main.py or configured path
# For this setup, we will point to the relative ../../frontend/dist for dev, or internal path for exe
base_dir = os.environ.get("APP_BASE_DIR")
if base_dir:
    static_path = os.path.join(base_dir, "frontend", "dist")
else:
    static_path = os.path.join(os.path.dirname(__file__), "../../frontend/dist")

# Only mount if directory exists (it will strictly exist in prod/build)
if os.path.exists(static_path):
    # Mount assets directory
    app.mount("/assets", StaticFiles(directory=os.path.join(static_path, "assets")), name="assets")
    
    # Mount CSS directory if it exists
    css_path = os.path.join(static_path, "css")
    if os.path.exists(css_path):
        app.mount("/css", StaticFiles(directory=css_path), name="css")
    
    # Serve other static files (like vite.svg)
    @app.get("/vite.svg")
    async def serve_vite_svg():
        svg_path = os.path.join(static_path, "vite.svg")
        if os.path.exists(svg_path):
            return FileResponse(svg_path)
        return {"error": "Not found"}
    
    # Catch-all for SPA (return index.html)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API routes to pass through (handled above by include_router priority) but verify logic
        if full_path.startswith("api"):
             return {"error": "Not found"} # Should be handled by routers
        
        index_path = os.path.join(static_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not built"}
else:
    print(f"WARNING: Static path {static_path} not found. Running in API-only mode.")
