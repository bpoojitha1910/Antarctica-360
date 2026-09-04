# Antarctica 360 Backend

Python + FastAPI REST API for the Antarctica 360 frontend.

## Windows setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API: http://localhost:8000
Swagger docs: http://localhost:8000/docs
Health check: http://localhost:8000/api/health
