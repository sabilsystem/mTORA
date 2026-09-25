from decimal import Decimal
import logging
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.pack import Pack

logger = logging.getLogger(__name__)

INITIAL_PACKS = [
    {
        "code": "pack1",
        "name": "Pack of 1",
        "regular_price": Decimal("45.00"),
        "selling_price": Decimal("45.00"),
    },
    {
        "code": "pack2",
        "name": "Pack of 2",
        "regular_price": Decimal("90.00"),
        "selling_price": Decimal("80.00"),
    },
    {
        "code": "pack5",
        "name": "Pack of 5",
        "regular_price": Decimal("180.00"),
        "selling_price": Decimal("160.00"),
    },
]


def seed_packs(db: Session) -> list[Pack]:
    """Seed initial packs if they don't already exist, or update them idempotently."""
    seeded = []
    for pack_data in INITIAL_PACKS:
        stmt = select(Pack).where(Pack.code == pack_data["code"])
        pack = db.execute(stmt).scalar_one_or_none()

        if pack:
            # Update existing to ensure values are in sync
            pack.name = pack_data["name"]
            pack.regular_price = pack_data["regular_price"]
            pack.selling_price = pack_data["selling_price"]
            logger.info(f"Pack {pack.code} already exists - updated.")
        else:
            pack = Pack(
                code=pack_data["code"],
                name=pack_data["name"],
                regular_price=pack_data["regular_price"],
                selling_price=pack_data["selling_price"],
            )
            db.add(pack)
            logger.info(f"Pack {pack.code} created.")
        seeded.append(pack)

    db.commit()
    return seeded


def run_seed() -> None:
    logging.basicConfig(level=logging.INFO)
    db = SessionLocal()
    try:
        packs = seed_packs(db)
        print(f"Successfully seeded {len(packs)} packs:")
        for p in packs:
            print(f"  [{p.code}] {p.name} - Regular: INR {p.regular_price}, Selling: INR {p.selling_price}")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
