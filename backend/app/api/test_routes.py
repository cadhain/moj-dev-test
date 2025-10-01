from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime, timedelta

client = TestClient(app)


def test_get_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200


def test_create_task():
    future_date = (datetime.utcnow() + timedelta(days=1)).replace(
        microsecond=0
    ).isoformat() + "Z"
    response = client.post(
        "/api/tasks",
        json={
            "title": "Test Task",
            "description": "Test Description",
            "due_date": future_date,
            "status": "todo",
        },
    )
    print(response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "todo"
    assert "id" in data
