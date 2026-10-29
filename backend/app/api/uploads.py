from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.deps import get_current_active_user
from app.models.user import User
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/image")
async def upload_product_image(
    current_user: Annotated[User, Depends(get_current_active_user)],
    file: UploadFile = File(...),
):
    """Admin or active farmer: upload an image to Cloudinary and return the secure URL."""
    is_admin = current_user.is_admin or current_user.role == "admin"
    is_farmer = current_user.role == "farmer"
    if not is_admin and not is_farmer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and farmers can upload product images",
        )
    if is_farmer and not current_user.seller_active and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your seller account is inactive",
        )

    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG, WebP, or GIF images are allowed",
        )

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    try:
        result = upload_image(data, filename=file.filename)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Cloudinary upload failed: {exc}",
        ) from exc

    if not result.get("url"):
        raise HTTPException(status_code=502, detail="Upload succeeded but no URL returned")

    return result
