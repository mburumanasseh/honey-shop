def test_upload_requires_auth(client):
    response = client.post(
        "/api/v1/uploads/image",
        files={"file": ("test.jpg", b"fake-image-bytes", "image/jpeg")},
    )
    assert response.status_code == 401


def test_upload_requires_admin(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post(
        "/api/v1/uploads/image",
        files={"file": ("test.jpg", b"fake-image-bytes", "image/jpeg")},
    )
    assert response.status_code == 403


def test_upload_cloudinary_not_configured(client, admin_user):
    client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpass"},
    )
    response = client.post(
        "/api/v1/uploads/image",
        files={"file": ("test.jpg", b"fake-image-bytes", "image/jpeg")},
    )
    # Without Cloudinary env vars, service should fail gracefully
    assert response.status_code in (503, 502)
