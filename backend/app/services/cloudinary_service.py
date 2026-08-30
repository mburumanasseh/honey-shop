import io
from typing import Optional

import cloudinary
import cloudinary.uploader

from app.core.config import settings


def configure_cloudinary() -> None:
    if not (
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_API_KEY
        and settings.CLOUDINARY_API_SECRET
    ):
        raise RuntimeError(
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        )
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def upload_image(file_bytes: bytes, filename: Optional[str] = None) -> dict:
    configure_cloudinary()
    stream = io.BytesIO(file_bytes)
    result = cloudinary.uploader.upload(
        stream,
        folder=settings.CLOUDINARY_FOLDER or "honey-shop",
        resource_type="image",
        use_filename=bool(filename),
        unique_filename=True,
        overwrite=False,
        filename_override=filename,
    )
    return {
        "url": result.get("secure_url") or result.get("url"),
        "public_id": result.get("public_id"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes"),
    }
