def test_health(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "honey-shop-api"


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "docs" in response.json()
