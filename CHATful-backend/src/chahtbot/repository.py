from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.chahtbot.models import FileStatus, KnowledgeBase, Chatbot, BotWidgetSettings, BotStatus



class ChatbotRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def get_chatbot_by_id(self, bot_id: UUID) -> Chatbot:
        result = await self.db.execute(
            select(Chatbot).where(Chatbot.id == bot_id)
        )
        return result.scalar_one_or_none()


    async def my_bots(self, user_id: UUID) -> list[Chatbot]:
        stmt = (
            select(Chatbot)
            .where(Chatbot.user_id == user_id)
            .order_by(Chatbot.created_at.desc())
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())


    async def create_chatbot(self, *, user_id: UUID, data, filename) -> Chatbot:
        bot = Chatbot(
            user_id=user_id,
            name=data.name,
            description=data.description,
            allowed_hosts=data.allowed_hosts,
        )
        self.db.add(bot)
        await self.db.flush()
        await self.db.refresh(bot)

        kb = KnowledgeBase(
            user_id=user_id,
            bot_id=bot.id,
            filename=filename,
        )
        self.db.add(kb)
        await self.db.flush()     
        await self.db.refresh(kb) 

        settings = BotWidgetSettings(bot_id=bot.id)
        await self.db.flush() 
        self.db.add(settings)

        await self.db.commit()
        return bot


    async def update_chatbot_status(self, bot_id, status: BotStatus):
        bot = (await self.db.execute(
            select(Chatbot).where(Chatbot.id == bot_id)
        )).scalar_one_or_none()
        
        if not bot:
            return None
        
        bot.status = status
        await self.db.commit()
        await self.db.refresh(bot)


class KnowledgebaseRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_file_by_id(self, file_id: UUID) -> KnowledgeBase:
        result = await self.db.execute(
            select(KnowledgeBase).where(KnowledgeBase.id == file_id)
        )
        return result.scalar_one_or_none()

    async def archive_file(self, file: KnowledgeBase):
        file.status = FileStatus.ARCHIVED
        await self.db.commit()



class BotWidgetRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_bot_widget(self, bot_id):
        widget = (await self.db.execute(
            select(BotWidgetSettings).where(BotWidgetSettings.bot_id == bot_id)
        )).scalar_one_or_none()
        return widget

    async def get_bot_owner(self, bot_id, user):
        bot = (await self.db.execute(
            select(Chatbot).where(Chatbot.id == bot_id, Chatbot.user_id == user.id)
        )).scalar_one_or_none()
        return bot

    async def upsert_widget_settings(self, bot_id, payload=None):
        settings = (
            await self.db.execute(
                select(BotWidgetSettings).where(BotWidgetSettings.bot_id == bot_id)
            )
        ).scalar_one_or_none()

        if settings is None:
            settings = BotWidgetSettings(bot_id=bot_id)
            self.db.add(settings)

        if payload:
            settings.display_name = payload.display_name
            settings.primary_color = payload.primary_color
            settings.accent_color = payload.accent_color
            settings.position = payload.position
            settings.welcome_message = payload.welcome_message
            settings.input_placeholder = payload.input_placeholder
            settings.show_powered_by = payload.show_powered_by
        await self.db.flush()
        await self.db.refresh(settings)
        return settings