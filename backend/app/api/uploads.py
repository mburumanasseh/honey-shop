from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.deps import get_current_admin_user
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
    _: Annotated[User, Depends(get_current_admin_user)],
    file: UploadFile = File(...),
):
    """Admin-only: upload an image to Cloudinary and return the secure URL."""
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
