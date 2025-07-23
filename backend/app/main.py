# main.py
from fastapi import FastAPI
from app.database import engine, Base  # <- shared Base from database.py
from app.api.routes import router as task_router

app = FastAPI(title="Task Manager API")


@app.get("/")
def read_root():
    return {"message": "Task Manager API is running. Visit /docs for Swagger UI."}


# Create all tables from models using the shared Base
Base.metadata.create_all(bind=engine)

# Include task routes
app.include_router(task_router, prefix="/api")

for route in app.routes:
    print(f"{route.path} -> {route.name} [{','.join(route.methods)}]")
