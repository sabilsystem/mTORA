from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Register all models for Alembic autogenerate discovery
from app.models.customer import Customer  # noqa: E402, F401
from app.models.pack import Pack  # noqa: E402, F401
from app.models.order import Order  # noqa: E402, F401
from app.models.order_item import OrderItem  # noqa: E402, F401

__all__ = ["Base", "Customer", "Pack", "Order", "OrderItem"]
