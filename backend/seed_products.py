"""
Seed the three original honey products.
Run from backend/ with the virtualenv active:

    python seed_products.py
"""
from decimal import Decimal

from app.db.session import SessionLocal
from app.models.product import Product


PRODUCTS = [
    {
        "name": "Pure Natural Honey",
        "description": "Raw, natural honey harvested straight from the hive.",
        "price": Decimal("850.00"),
        "size": "500g",
        "image_url": "/src/assets/honeyjar.jpg",
        "stock": 50,
    },
    {
        "name": "Premium Forest Honey",
        "description": "Rich and aromatic honey collected from forest hives.",
        "price": Decimal("1200.00"),
        "size": "750g",
        "image_url": "/src/assets/honeyjar.jpg",
        "stock": 30,
    },
    {
        "name": "Raw Wildflower Honey",
        "description": "Naturally sweet honey with a delicate floral flavor.",
        "price": Decimal("1500.00"),
        "size": "1kg",
        "image_url": "/src/assets/honeyjar.jpg",
        "stock": 25,
    },
]


def main():
    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        if existing > 0:
            print(f"Products already exist ({existing}). Skipping seed.")
            return

        for data in PRODUCTS:
            db.add(Product(**data, is_active=True))
        db.commit()
        print(f"Seeded {len(PRODUCTS)} products.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
