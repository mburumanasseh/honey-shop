from typing import Annotated, Optional

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

DBSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DBSession,
    access_token: Annotated[str | None, Cookie(alias="access_token")] = None,
) -> User:
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_token(access_token)
    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = db.get(User, int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    return current_user


def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user


def get_optional_user(
    db: DBSession,
    access_token: Annotated[str | None, Cookie(alias="access_token")] = None,
) -> Optional[User]:
    """Return the current user if a valid access cookie is present; otherwise None."""
    if not access_token:
        return None
    payload = decode_token(access_token)
    if payload is None or payload.get("type") != "access":
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    try:
        user = db.get(User, int(user_id))
    except (TypeError, ValueError):
        return None
    if user is None or not user.is_active:
        return None
    return user


def get_current_farmer_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    """Require an active farmer account (login allowed even if seller_active is False)."""
    if current_user.is_admin or current_user.role == "admin":
        return current_user
    if current_user.role != "farmer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer account required",
        )
    return current_user


def require_seller_can_list(
    current_user: Annotated[User, Depends(get_current_farmer_user)],
) -> User:
    """Farmer must be seller_active to create new listings."""
    if current_user.is_admin or current_user.role == "admin":
        return current_user
    if not current_user.seller_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your seller account is inactive. You cannot create new listings.",
        )
    return current_user

