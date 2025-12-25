from uuid import uuid4, UUID as PyUUID
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import String, ForeignKey, DateTime, Enum as SAEnum, Text, Boolean
from sqlalchemy.orm import mapped_column, Mapped, relationship
from src.database import Base


class FileStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class BotStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    PENDING = "pending"
    FAILED = "failed"


class Chatbot(Base):
    __tablename__ = "chatbots"

    id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(), nullable=False)
    description: Mapped[str] = mapped_column(String(), nullable=True)
    status: Mapped[BotStatus] = mapped_column(SAEnum(BotStatus), default=BotStatus.PENDING)

    allowed_hosts: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=lambda: ["*"], server_default='["*"]')

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), 
                                    default=lambda: datetime.now(timezone.utc))
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="chatbots")
    knowledgebase_files = relationship(
        "KnowledgeBase",
        back_populates="chatbot",
        cascade="all, delete-orphan",
    )



class KnowledgeBase(Base):
    __tablename__ = "knowledgebase_files"
    
    id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    bot_id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(), nullable=False)
    status: Mapped[FileStatus] = mapped_column(SAEnum(FileStatus), default=FileStatus.ACTIVE)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), 
                                    default=lambda: datetime.now(timezone.utc))
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="files")
    chatbot = relationship("Chatbot", back_populates="knowledgebase_files")



class BotWidgetSettings(Base):
    __tablename__ = "bot_widget_settings"

    id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    bot_id: Mapped[PyUUID] = mapped_column(UUID(as_uuid=True), ForeignKey("chatbots.id"), nullable=False)
    
    display_name: Mapped[str] = mapped_column(String(100), nullable=False, default="Assistant Bot")
    primary_color: Mapped[str] = mapped_column(String(20), nullable=False, default="#3b82f6")
    accent_color: Mapped[str] = mapped_column(String(20), nullable=False, default="#1e40af")
    position: Mapped[str] = mapped_column(String(20), nullable=False, default="bottom-right")
    welcome_message: Mapped[str] = mapped_column(Text, nullable=False, default="Hi, How can I help you?")
    input_placeholder: Mapped[str] = mapped_column(String(100), nullable=False, default="Type your message")
    show_powered_by: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                                    default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                default=lambda: datetime.now(timezone.utc),onupdate=lambda: datetime.now(timezone.utc))
    



