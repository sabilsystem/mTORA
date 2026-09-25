from fastapi import APIRouter

from app.api.routes import customers, packs, orders

api_router = APIRouter()
api_router.include_router(customers.router)
api_router.include_router(packs.router)
api_router.include_router(orders.router)

__all__ = ["api_router"]
