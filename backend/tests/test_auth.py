def test_register_success(client, user_payload):
    response = client.post("/api/v1/auth/register", json=user_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == user_payload["email"]
    assert data["name"] == user_payload["name"]
    assert data["is_admin"] is False
    assert "hashed_password" not in data
    assert "access_token" in response.cookies


def test_register_duplicate_email(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post("/api/v1/auth/register", json=user_payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_login_success(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    # New client-like flow: login again
    response = client.post(
        "/api/v1/auth/login",
        json={"email": user_payload["email"], "password": user_payload["password"]},
    )
    assert response.status_code == 200
    assert response.json()["email"] == user_payload["email"]
    assert "access_token" in response.cookies


def test_login_invalid_password(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": user_payload["email"], "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_me_requires_auth(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_me_after_register(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == user_payload["email"]


def test_logout(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"]


def test_bootstrap_admin(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post(
        "/api/v1/auth/bootstrap-admin",
        json={"email": user_payload["email"], "secret": "test-bootstrap-secret"},
    )
    assert response.status_code == 200
    assert response.json()["is_admin"] is True


def test_bootstrap_admin_invalid_secret(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post(
        "/api/v1/auth/bootstrap-admin",
        json={"email": user_payload["email"], "secret": "wrong"},
    )
    assert response.status_code == 403
