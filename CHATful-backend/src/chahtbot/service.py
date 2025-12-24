import httpx
from uuid import UUID
import fitz
import pymupdf4llm
from io import BytesIO
from fastapi import HTTPException, status, File
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import settings
from src.chahtbot.repository import KnowledgebaseRepository, ChatbotRepository, BotWidgetRepository
from src.chahtbot.utils import N8N
from src.auth.models import User
from src.chahtbot.models import BotStatus




MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_TYPES = {"application/pdf"}


class KnowledgebaseService:
    @staticmethod
    async def upload_knowledgebase_files(user: User, file: bytes, filename: str, content_type: str, repo: KnowledgebaseRepository):
        file_data = {
            "user_id": user.id,
            "filename": filename,
        }
        files = {"Upload_PDF": (filename, file, content_type)}
        data = {"user_id": str(user.id), "filename": filename}

        async with httpx.AsyncClient() as client:
            response = await client.post(settings.n8n_webhook_knowledgebase, files=files, data=data)


    @staticmethod
    async def archive_file(user: User, file_id: UUID, repo: KnowledgebaseRepository):
        file = await repo.get_file_by_id(file_id)
        if not user.id == file.user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can't delete this file")
        await repo.archive_file(file)
        return True
        



class ChatbotService:
    @staticmethod
    async def get_my_bots(user: User, repo: ChatbotRepository):
        bots = await repo.my_bots(user.id)
        return bots



    @staticmethod
    async def create_chatbot(data, file, bot_repo: ChatbotRepository, widget_repo: BotWidgetRepository ,user: User):

        file_bytes = await file.read()

        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")


        bot = await bot_repo.create_chatbot(user_id=user.id, data=data, filename=file.filename)

        await N8N.send_file_to_n8n(file, file_bytes, user.id, bot.id)

        return bot

        
    @staticmethod
    async def send_msg(data):
        status, msg = await N8N.send_msg_to_n8n(data.message, data.bot_id)
        return status, msg


    @staticmethod 
    async def get_bot_widget(bot_id, repo: BotWidgetRepository):
        widget = await repo.get_bot_widget(bot_id)
        if not widget:
            raise HTTPException(status_code=404, detail="No Widget Found for this bot")
        
        return widget


    @staticmethod
    async def upsert_bot_settings(bot_id, data, db, repo: BotWidgetRepository, user: User):
        bot = await repo.get_bot_owner(bot_id, user)
        if not bot:
            raise HTTPException(status_code=404, detail="Bot not found")
        
        
        settings = await repo.upsert_widget_settings(bot_id, data)
        await db.commit()

        return settings


    @staticmethod 
    async def chatbot_webhook(request, n8n_signature, bot_repo: ChatbotRepository):
        raw = await request.body()
        await run_in_threadpool(N8N.verify_sig, raw, n8n_signature, "SECRET")
        payload = await request.json()
        bot_id = payload["bot_id"]
        event_type = payload["type"]

        if event_type == "chatbot.ingestion.completed":
            await bot_repo.update_chatbot_status(bot_id, BotStatus.ACTIVE)
            return True

        if event_type == "chatbot.ingestion.failed":
            await bot_repo.update_chatbot_status(bot_id, BotStatus.FAILED)
            return True

        

    @staticmethod
    async def convert_to_markdown(file_bytes: bytes):
        doc = fitz.open(stream=BytesIO(file_bytes), filetype="pdf")

        all_pages = []

        for page_num in range(len(doc)):
            # Create a temporary single-page document
            single_page_doc = fitz.open()
            single_page_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)

            markdown = pymupdf4llm.to_markdown(single_page_doc)

            # Append only the page markdown, without page numbering
            all_pages.append(markdown.strip())
            single_page_doc.close()

        doc.close()

        final_markdown = "\n\n".join(all_pages)
        return final_markdown