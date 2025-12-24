from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, Literal
from src.chahtbot.models import BotStatus

Position = Literal["bottom-left", "bottom-right"]



class ChatbotCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


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