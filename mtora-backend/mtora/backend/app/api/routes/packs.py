from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.pack import PackResponse
from app.services import pack_service

router = APIRouter(prefix="/packs", tags=["Packs"])


@router.get("", response_model=List[PackResponse])
def read_packs(db: Session = Depends(get_db)) -> List[PackResponse]:
    """Retrieve all available packs."""
    return pack_service.get_packs(db)


@router.get("/{pack_id}", response_model=PackResponse)
def read_pack(pack_id: int, db: Session = Depends(get_db)) -> PackResponse:
    """Retrieve a single pack by id."""
    pack = pack_service.get_pack_by_id(db, pack_id=pack_id)
    if not pack:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pack with id {pack_id} not found",
        )
    return pack
