"""Outbound email helpers (welcome messages, etc.)."""
from __future__ import annotations

import logging
import smtplib
import ssl
from email.message import EmailMessage
from typing import Optional

import urllib.error
import urllib.request
import json

from app.core.config import settings

logger = logging.getLogger(__name__)


def email_configured() -> bool:
    if settings.RESEND_API_KEY and settings.EMAIL_FROM:
        return True
    if settings.SMTP_HOST and settings.EMAIL_FROM:
        return True
    return False


def send_email(to: str, subject: str, text_body: str, html_body: Optional[str] = None) -> bool:
    """
    Send an email via Resend (preferred) or SMTP.
    Returns True on success. Logs and returns False on failure.
    Never raises to callers used from request handlers.
    """
    to = (to or "").strip()
    if not to:
        logger.warning("send_email skipped: empty recipient")
        return False

    if not email_configured():
        logger.warning(
            "Email not configured. Set RESEND_API_KEY + EMAIL_FROM "
            "or SMTP_HOST + EMAIL_FROM to enable outbound mail."
        )
        return False

    try:
        if settings.RESEND_API_KEY:
            return _send_via_resend(to, subject, text_body, html_body)
        return _send_via_smtp(to, subject, text_body, html_body)
    except Exception:
        logger.exception("Failed to send email to %s", to)
        return False


def send_welcome_email(to_email: str, name: str) -> bool:
    display_name = (name or "").strip() or "there"
    subject = "Welcome to Honey Shop — thank you for joining us"
    text_body = (
        f"Hi {display_name},\n\n"
        "Thank you for creating an account with Honey Shop.\n\n"
        "We're glad you're here. Explore our pure, naturally harvested honey "
        "and enjoy shopping with us.\n\n"
        "If you did not create this account, you can ignore this email.\n\n"
        "Warm regards,\n"
        "The Honey Shop team\n"
    )
    html_body = f"""\
<!DOCTYPE html>
<html>
  <body style="font-family: Georgia, serif; color: #2c1a00; line-height: 1.5;">
    <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
      <p style="color: #b8860b; letter-spacing: 0.08em; text-transform: uppercase; font-size: 12px;">
        Honey Shop
      </p>
      <h1 style="font-size: 24px; margin: 0 0 16px;">Welcome, {display_name}!</h1>
      <p>Thank you for creating an account with <strong>Honey Shop</strong>.</p>
      <p>
        We're glad you're here. Explore our pure, naturally harvested honey
        and enjoy shopping with us.
      </p>
      <p style="margin-top: 24px;">Warm regards,<br/>The Honey Shop team</p>
      <p style="margin-top: 32px; font-size: 12px; color: #777;">
        If you did not create this account, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
"""
    return send_email(to_email, subject, text_body, html_body)


def _send_via_resend(
    to: str,
    subject: str,
    text_body: str,
    html_body: Optional[str],
) -> bool:
    payload = {
        "from": settings.EMAIL_FROM,
        "to": [to],
        "subject": subject,
        "text": text_body,
    }
    if html_body:
        payload["html"] = html_body

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            if 200 <= resp.status < 300:
                logger.info("Welcome email sent via Resend to %s", to)
                return True
            logger.error("Resend returned status %s", resp.status)
            return False
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        logger.error("Resend HTTP error %s: %s", exc.code, body)
        return False


def _send_via_smtp(
    to: str,
    subject: str,
    text_body: str,
    html_body: Optional[str],
) -> bool:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to
    msg.set_content(text_body)
    if html_body:
        msg.add_alternative(html_body, subtype="html")

    host = settings.SMTP_HOST
    port = settings.SMTP_PORT
    user = settings.SMTP_USER
    password = settings.SMTP_PASSWORD

    if settings.SMTP_USE_TLS:
        context = ssl.create_default_context()
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.starttls(context=context)
            if user and password:
                server.login(user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=20) as server:
            if user and password:
                server.login(user, password)
            server.send_message(msg)

    logger.info("Welcome email sent via SMTP to %s", to)
    return True
