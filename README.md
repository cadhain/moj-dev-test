# 📝 Task Manager API

A lightweight task management API built with [FastAPI](https://fastapi.tiangolo.com/) and SQLite, using SQLAlchemy for ORM and Pydantic for data validation.

---

## 🚀 Features

- Create, read, update, and delete (CRUD) tasks
- RESTful API endpoints with OpenAPI documentation (Swagger UI)
- SQLite database (stored locally as `tasks.db`)
- Organised modular structure:
  - `/api` — routing
  - `/crud` — database operations
  - `/models` — SQLAlchemy ORM models
  - `/schemas` — Pydantic request/response schemas
  - `/database.py` — DB connection and session
  - `/main.py` — application entry point

---

## 🧰 Requirements

- Python 3.10+
- [Poetry](https://python-poetry.org/) or `pip` for installing dependencies
- Uvicorn (for local development)

---

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/cadhain/task-manager.git
   cd task-manager
   ```

## ⏯️ Dev Startup / Shutdown

1. **Frontend**

   - npm run dev

2. **Backend**

   - source venv/bin/activate
   - uvicorn backend.main:app --reload

3. **Shutdown**

   - navigate to either the frontend or backend folder
   - ctrl + c to shutdown
