from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.routes import router as task_router

app = FastAPI(title="Task Manager API")

# --- CORS setup ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# CORS middleware – allows frontend at Vite's port to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Task Manager API is running!"}


# Create all tables from models using the shared Base
Base.metadata.create_all(bind=engine)

# Include task routes
app.include_router(task_router, prefix="/api")

# Optional debug info
for route in app.routes:
    print(f"{route.path} -> {route.name} [{','.join(route.methods)}]")
