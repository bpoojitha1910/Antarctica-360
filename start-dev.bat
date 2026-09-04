@echo off
setlocal
cd /d "%~dp0"

echo Starting Antarctica 360 backend...
start "Antarctica 360 Backend" cmd /k "cd /d ""%~dp0backend"" && if not exist .venv (python -m venv .venv) && call .venv\Scripts\activate && pip install -r requirements.txt && python -m uvicorn main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo Starting Antarctica 360 frontend...
start "Antarctica 360 Frontend" cmd /k "cd /d ""%~dp0"" && npm run dev"

echo.
echo Backend:  http://localhost:8000/docs
echo Frontend: http://localhost:5173
endlocal
