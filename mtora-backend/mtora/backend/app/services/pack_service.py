from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pack import Pack


def get_packs(db: Session) -> List[Pack]:
    """Retrieve all available packs ordered by id."""
    stmt = select(Pack).order_by(Pack.id.asc())
    return list(db.execute(stmt).scalars().all())


def get_pack_by_id(db: Session, pack_id: int) -> Optional[Pack]:
    """Retrieve pack by primary key id."""
    stmt = select(Pack).where(Pack.id == pack_id)
    return db.execute(stmt).scalar_one_or_none()


def get_pack_by_code(db: Session, code: str) -> Optional[Pack]:
    """Retrieve pack by unique stable code (e.g. pack1, pack2, pack5)."""
    stmt = select(Pack).where(Pack.code == code)
    return db.execute(stmt).scalar_one_or_none()
