import uvicorn
import os
import sys

# Ensure backend directory is in path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Determine if we are running in a bundle or live and set APP_BASE_DIR BEFORE importing
if getattr(sys, 'frozen', False):
    # Running in a bundle
    base_dir = sys._MEIPASS
else:
    # Running live
    base_dir = os.path.dirname(os.path.abspath(__file__))

# Set environment variable to help main.py find static files if needed
os.environ["APP_BASE_DIR"] = base_dir

# Debugging import issue
try:
    from app.main import app
except ImportError as e:
    import traceback
    traceback.print_exc()
    print(f"CRITICAL ERROR: {e}")
    # Print Debug Info
    print(f"Current Working Dir: {os.getcwd()}")
    print(f"sys.path: {sys.path}")
    if getattr(sys, 'frozen', False):
        print(f"Bundle Manifest (MEIPASS): {os.listdir(sys._MEIPASS)}")
        app_dir = os.path.join(sys._MEIPASS, 'app')
        if os.path.exists(app_dir):
             print(f"Contents of 'app' dir: {os.listdir(app_dir)}")
        else:
             print("'app' directory not found in bundle!")
    input("Press Enter to exit...")
    sys.exit(1)

if __name__ == "__main__":
    # Listen on localhost, port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)
