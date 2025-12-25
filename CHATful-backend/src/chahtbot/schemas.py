from uuid import UUID
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal, List
from urllib.parse import urlparse
from src.chahtbot.models import BotStatus

Position = Literal["bottom-left", "bottom-right"]



class ChatbotCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)

    allowed_hosts: List[str] = Field(
        default_factory=lambda: ["*"],
        description="List of allowed origins. Use ['*'] to allow all."
    )

    @field_validator("allowed_hosts")
    @classmethod
    def validate_allowed_hosts(cls, hosts: List[str]) -> List[str]:
        # Empty list is not allowed (security)
        if not hosts:
            raise ValueError("allowed_hosts cannot be empty")

        # If '*' exists, it must be the only value
        if "*" in hosts and len(hosts) > 1:
            raise ValueError("'*' must be the only value in allowed_hosts")

        normalized: list[str] = []

        for host in hosts:
            if host == "*":
                return ["*"]

            parsed = urlparse(host)

            if not parsed.scheme or not parsed.netloc:
                raise ValueError(
                    f"Invalid host '{host}'. Must be full origin like https://example.com"
                )

            if parsed.scheme not in ("http", "https"):
                raise ValueError("Only http and https schemes are allowed")

            # normalize (remove trailing slash)
            normalized.append(f"{parsed.scheme}://{parsed.netloc}")

        return normalized


class ChabotOut(BaseModel):
    id: UUID
    name: str
    status: BotStatus


class MessageRequest(BaseModel):
    message: str
    bot_id: UUID
    visitor_id: UUID


class WidgetSettingsUpdate(BaseModel):
    display_name: str = Field(min_length=1, max_length=100)
    primary_color: str = Field(default="#3b82f6", max_length=20)   # validate hex later if you want
    accent_color: str = Field(default="#1e40af", max_length=20)
    position: Position = "bottom-right"
    welcome_message: str = Field(default="Hi 👋 How can I help you?", max_length=2000)
    input_placeholder: str = Field(default="Type your message…", max_length=100)
    show_powered_by: bool = True


class WidgetSettingsOut(WidgetSettingsUpdate):
    bot_id: UUID