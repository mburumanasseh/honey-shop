import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Force test settings before app imports use DB
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = "test-secret-key-for-unit-tests-only"
os.environ["DEBUG"] = "true"
os.environ["BOOTSTRAP_SECRET"] = "test-bootstrap-secret"
os.environ["CLOUDINARY_CLOUD_NAME"] = ""
os.environ["CLOUDINARY_API_KEY"] = ""
os.environ["CLOUDINARY_API_SECRET"] = ""

from app.db.session import Base, get_db
from app.main import app
from app.models import User, Product, Order, OrderItem  # noqa: F401
from app.core.security import get_password_hash


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_database() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def user_payload() -> dict:
    return {
        "name": "Test User",
        "email": "user@example.com",
        "phone": "0700000000",
        "password": "secret12",
    }


@pytest.fixture
def admin_user(db: Session) -> User:
    user = User(
        name="Admin User",
        email="admin@example.com",
        phone="0700000001",
        hashed_password=get_password_hash("adminpass"),
        is_active=True,
        is_admin=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def sample_product(db: Session) -> Product:
    product = Product(
        name="Test Honey",
        description="A test jar of honey",
        price=1000,
        size="500g",
        image_url="https://example.com/honey.jpg",
        stock=10,
        is_active=True,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def register_and_login(client: TestClient, payload: dict) -> TestClient:
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201, response.text
    return client
