from uuid import UUID
from fastapi import APIRouter, UploadFile, File, Form, Depends, status, Header, Request, HTTPException
from src.dependencies import redis_dependency
from src.rate_limiter import limiter
from src.auth_bearer import user_dependency
from src.database import db_dependency
from src.chahtbot.service import KnowledgebaseService, ChatbotService
from src.chahtbot.dependencies import knowledgebase_dependency, chatbot_dependency, bot_widget_dependency
from src.chahtbot import schemas
from strip_markdown import strip_markdown



router = APIRouter()





def chatbot_form(
    name: str = Form(...),
    description: str | None = Form(None),
    allowed_hosts: str | None = Form(None),
    source_type: str = Form("file"),  # "file" | "webpage" | "website"
    url: str | None = Form(None),     # used for webpage/website
):
    hosts_list: list[str] = ["*"]

    if allowed_hosts and allowed_hosts.strip():
        raw = allowed_hosts.replace(",", "\n")
        hosts_list = [h.strip() for h in raw.splitlines() if h.strip()]

    st = source_type.strip().lower()
    if st not in {"file", "webpage", "website"}:
        raise HTTPException(status_code=400, detail="Invalid source_type")

    if st in {"webpage", "website"} and (not url or not url.strip()):
        raise HTTPException(status_code=400, detail="url is required for webpage/website")

    return schemas.ChatbotCreateRequest(
        name=name,
        description=description,
        allowed_hosts=hosts_list,
        source_type=st,
        url=url.strip() if url else None,
    )


@router.post("/send-msg")
async def send_chat_message(data: schemas.MessageRequest, chat_repo: chatbot_dependency,
        request: Request, redis: redis_dependency):
    status, msg = await ChatbotService.send_msg(data, chat_repo, request, redis)
    return {
            "status_code": status,

            "answer": strip_markdown(msg) ,

        }



@router.post("/chatbots", status_code=status.HTTP_201_CREATED)
async def create_chatbot(chat_repo: chatbot_dependency, current_user: user_dependency,
    data: schemas.ChatbotCreateRequest = Depends(chatbot_form), file: UploadFile | None = File(None)):
    bot= await ChatbotService.create_chatbot(data, file, chat_repo, current_user)
    return {"id": bot.id}



@router.get("/my-bots", response_model=list[schemas.ChabotOut], status_code=status.HTTP_200_OK)
async def list_my_bots(current_user: user_dependency, repo_dep: chatbot_dependency):
    my_bots = await ChatbotService.get_my_bots(current_user, repo_dep)
    return my_bots


@router.post("/knowledge_base/upload")
async def upload_knowledge_base(current_user: user_dependency, repo_deb: knowledgebase_dependency, file: UploadFile = File(...)):
    result = await KnowledgebaseService.upload_knowledgebase_files(current_user, await file.read(), file.filename, file.content_type, repo_deb) #type:ignore
    return result


@router.delete("/knowledge_base/delete/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge_base(current_user: user_dependency, repo_deb: knowledgebase_dependency, file_id: UUID):
    result = await KnowledgebaseService.archive_file(current_user, file_id, repo_deb)



@router.get("/widget/config/{bot_id}", response_model=schemas.WidgetSettingsOut)
async def get_bot_widget(bot_id: UUID, widget_repo: bot_widget_dependency):
    widget = await ChatbotService.get_bot_widget(bot_id, widget_repo)
    return widget


@router.put("/{bot_id}/widget-settings", response_model=schemas.WidgetSettingsOut)
async def upsert_widget_settings(bot_id: UUID, data: schemas.WidgetSettingsUpdate, 
        current_user: user_dependency, widget_repo: bot_widget_dependency, db: db_dependency):
    settings = await ChatbotService.upsert_bot_settings(bot_id, data, db, widget_repo, current_user)

    return settings



@router.post("/chatbot/pdf/to/md")
async def convert_to_md(file: UploadFile = File(...)):
    file_bytes = await file.read()
    md_content = await ChatbotService.convert_to_markdown(file_bytes)
    return {"markdown": md_content}



@router.post("/chatbot-status")
@limiter.exempt
async def n8n_chatbot_status(
    chat_repo: chatbot_dependency,
    request: Request,
    x_n8n_signature: str = Header(...),
):
    await ChatbotService.chatbot_webhook(request, x_n8n_signature, chat_repo)
    