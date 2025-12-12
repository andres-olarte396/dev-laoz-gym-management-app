@echo off
echo ===========================================
echo Building Gym Management App (Offline Installer)
echo ===========================================

REM 1. Build Frontend
echo [1/3] Building Frontend...
cd frontend
call npm run build
REM if %errorlevel% neq 0 (
REM     echo Frontend build failed!
REM     exit /b %errorlevel%
REM )
cd ..

REM 2. Prepare PyInstaller Spec
echo [2/3] Preparing Backend Bundle...
cd backend
REM Ensure venv is active
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Venv not found, assuming python is in path...
)

REM Clean previous builds
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

REM Run PyInstaller
REM We embed the ../frontend/dist folder as 'frontend/dist' inside the bundle
REM Separator for --add-data is ; on Windows
pyinstaller --name "GymApp" ^
            --onefile ^
            --paths "." ^
            --add-data "../frontend/dist;frontend/dist" ^
            --add-data "app;app" ^
            --hidden-import "sqlmodel" ^
            --hidden-import "uvicorn" ^
            --hidden-import "passlib.handlers.bcrypt" ^
            --hidden-import "bcrypt" ^
            --hidden-import "pydantic_settings" ^
            --icon "NONE" ^
            run.py

if %errorlevel% neq 0 (
    echo PyInstaller failed!
    exit /b %errorlevel%
)

echo [3/3] Build Success!
echo Executable is located at: backend\dist\GymApp.exe
cd ..
REM pause
