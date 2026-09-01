def test_list_products_empty(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    assert response.json() == []


def test_list_products(client, sample_product):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Honey"
    assert float(data[0]["price"]) == 1000.0


def test_get_product(client, sample_product):
    response = client.get(f"/api/v1/products/{sample_product.id}")
    assert response.status_code == 200
    assert response.json()["id"] == sample_product.id


def test_get_product_not_found(client):
    response = client.get("/api/v1/products/9999")
    assert response.status_code == 404


def test_create_product_requires_admin(client, user_payload):
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post(
        "/api/v1/products",
        json={
            "name": "New Honey",
            "price": 500,
            "stock": 5,
        },
    )
    assert response.status_code == 403


def test_create_product_as_admin(client, admin_user):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpass"},
    )
    assert login.status_code == 200

    response = client.post(
        "/api/v1/products",
        json={
            "name": "Admin Honey",
            "description": "Created by admin",
            "price": "750.00",
            "size": "250g",
            "stock": 20,
            "is_active": True,
        },
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["name"] == "Admin Honey"
    assert data["stock"] == 20


def test_update_product_as_admin(client, admin_user, sample_product):
    client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpass"},
    )
    response = client.patch(
        f"/api/v1/products/{sample_product.id}",
        json={"price": "1100.00", "stock": 8},
    )
    assert response.status_code == 200
    assert float(response.json()["price"]) == 1100.0
    assert response.json()["stock"] == 8


def test_soft_delete_product(client, admin_user, sample_product):
    client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpass"},
    )
    response = client.delete(f"/api/v1/products/{sample_product.id}")
    assert response.status_code == 204

    listed = client.get("/api/v1/products")
    assert listed.json() == []
