from typing import Annotated
from fastapi import Depends
from src.chahtbot.repository import KnowledgebaseRepository, ChatbotRepository, BotWidgetRepository
from src.database import db_dependency



def get_knowledgebase_repo(db: db_dependency) -> KnowledgebaseRepository:
    return KnowledgebaseRepository(db)


knowledgebase_dependency = Annotated[KnowledgebaseRepository, Depends(get_knowledgebase_repo)]



def get_chatbot_repo(db: db_dependency) -> ChatbotRepository:
    return ChatbotRepository(db)


chatbot_dependency = Annotated[ChatbotRepository, Depends(get_chatbot_repo)]


def get_bot_widget_repo(db: db_dependency) -> BotWidgetRepository:
    return BotWidgetRepository(db)


bot_widget_dependency = Annotated[BotWidgetRepository, Depends(get_bot_widget_repo)]