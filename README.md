# 📝 Task Manager API & Frontend

A lightweight task management app built with [FastAPI](https://fastapi.tiangolo.com/) (backend) and React (frontend), using SQLite for storage, SQLAlchemy for ORM, and Pydantic for data validation.

---

## 🚀 Features

- Create, read, update, and delete (CRUD) tasks
- RESTful API endpoints with OpenAPI documentation (Swagger UI)
- SQLite database (stored locally as `tasks.db`)
- Modular backend structure:
  - `/api` — API routing
  - `/models` — SQLAlchemy ORM models
  - `/schemas` — Pydantic request/response schemas
  - `/database.py` — DB connection and session
  - `/main.py` — application entry point
- Modern React frontend with GOV.UK Design System styles
- Task search, pagination, and validation
- Unit and integration tests for both backend and frontend

---

## 🧰 Requirements

- Python 3.10+
- [Poetry](https://python-poetry.org/) or `pip` for backend dependencies
- Node.js (v18+) and npm for frontend
- Uvicorn (for local backend development)

---

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/cadhain/task-manager.git
   cd task-manager
   ```

2. **Backend setup:**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   # or, if using Poetry:
   # poetry install
   ```

3. **Frontend setup:**

   ```bash
   cd ../frontend
   npm install
   ```

---

## ⏯️ Running the App

1. **Start the backend:**

   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. **Start the frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Shutdown**

   - Press `Ctrl+C` in the terminal running either the frontend or backend to stop.

---

## 🧪 Running Tests

### Backend (Python/FastAPI)

```bash
cd backend
pytest
```

### Frontend (React/Vitest)

```bash
cd frontend
npm run test
```

---

## 📖 API Documentation

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Project Structure

```
backend/
  app/
    api/         # API routing
    models/      # SQLAlchemy models
    schemas/     # Pydantic schemas
    database.py  # DB connection/session
    main.py      # FastAPI entry point
frontend/
  src/
    pages/       # React pages
    components/  # Reusable components
    utils/       # Utility functions
    api.ts       # API helpers
tasks.db         # SQLite database (created at runtime)
```

---

## 💡 Notes

- The backend runs on [http://localhost:8000](http://localhost:8000)
- The frontend runs on [http://localhost:5173](http://localhost:5173) (or as shown in your terminal)
- You can view and interact with the API using Swagger UI at `/docs`

---

Happy task managing!
