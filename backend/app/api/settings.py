from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.settings import StoreSettings
from app.models.user import User
from app.schemas.settings import StoreSettingsResponse, StoreSettingsUpdate

router = APIRouter(prefix="/admin/settings", tags=["Admin Settings"])


def _get_or_create_settings(db: Session) -> StoreSettings:
    row = db.get(StoreSettings, 1)
    if row is None:
        row = StoreSettings(
            id=1,
            store_name="Mercy Gold Honey",
            email=None,
            phone=None,
            currency="KES",
            address=None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.get("", response_model=StoreSettingsResponse)
def get_settings(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    return _get_or_create_settings(db)


@router.patch("", response_model=StoreSettingsResponse)
def update_settings(
    payload: StoreSettingsUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_admin_user)],
):
    row = _get_or_create_settings(db)
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(row, key, value)
    row.updated_at = datetime.now(timezone.utc)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
