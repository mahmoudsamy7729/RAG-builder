import httpx, hmac, hashlib, json
from fastapi import status, HTTPException
from src.config import settings







class N8N:
    @staticmethod
    def verify_sig(raw: bytes, sig: str, secret: str):
        expected = hmac.new(key=secret.encode("utf-8"),msg=raw,digestmod=hashlib.sha256).hexdigest()
        # Normalize signature (important)
        sig = sig.strip()
        if not hmac.compare_digest(expected, sig):
            print("INVALID")
            raise HTTPException(status_code=401, detail="Invalid signature")


    @staticmethod
    async def send_file_to_n8n(file, file_bytes, user_id, bot_id):
        filename = file.filename
        content_type = file.content_type

        files = {"Upload_PDF": (filename, file_bytes, content_type)}
        data = {"user_id": str(user_id), "filename": filename, "bot_id": str(bot_id)}

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(settings.n8n_webhook_knowledgebase, files=files, data=data)
                response.raise_for_status()

        except httpx.ConnectError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="n8n service is unreachable",
            )

        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="n8n request timed out",
            )

        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"n8n error: {e.response.status_code} - {e.response.text}",
            )

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unexpected error while sending file to n8n",
            )



    @staticmethod 
    async def send_msg_to_n8n(msg, bot_id):
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
            response = await client.post(
                settings.n8n_chat_url,
                json={"message": msg, "bot_id": str(bot_id)}  # payload expected by n8n Chat node
            )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="n8n request failed")
        
    
        try:
            data = response.json()
        except json.JSONDecodeError:
            return {"error": "Invalid JSON returned from n8n", "raw": response.text}
        
        print(data)
        
        message_text = None
        if isinstance(data, list) and len(data) > 0:
            message_text = data[0].get("output")

        return response.status_code, (message_text or "No message found")

