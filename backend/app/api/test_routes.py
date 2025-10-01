from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200
