from fastapi import FastAPI
from app.database import engine
from app.models.task import Task
from app.api.routes import router as task_router

app = FastAPI(title="Task Manager API")

# Create tables
Task.metadata.create_all(bind=engine)

# Include task routes
app.include_router(task_router)
