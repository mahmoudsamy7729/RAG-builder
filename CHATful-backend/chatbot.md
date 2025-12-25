# Chatbot API

All authenticated endpoints require HTTP Bearer auth using `Authorization: Bearer <token>`.

## POST /send-msg
- Summary: Send a chat message to a chatbot and get a reply.
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - message (string, required)
  - bot_id (UUID, required)
  - visitor_id (UUID, required)
- JSON response fields and status codes:
  - 200: {"status_code": int, "answer": string}

## POST /chatbots
- Summary: Create a chatbot with an initial PDF knowledge base upload.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token), Content-Type: multipart/form-data
- JSON request body fields: None (multipart/form-data)
- Multipart form fields:
  - name (string, required; 3-100 chars)
  - description (string, optional; up to 500 chars)
  - allowed_hosts (string, optional; comma- or newline-separated origins; "*" allowed)
  - file (file, required; PDF only; max 10 MB)
- JSON response fields and status codes:
  - 201: {"id": UUID}
  - 400: {"detail": "Unsupported file type" | "File too large"}
  - 401: {"detail": "Invalid or expired token"}
  - 403: {"detail": "User account is not active or verified"}

## GET /my-bots
- Summary: List chatbots owned by the current user.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token)
- JSON request body fields: None
- JSON response fields and status codes:
  - 200: list of bots
    - Each item: {"id": UUID, "name": string, "status": "active" | "archived" | "pending" | "failed"}
  - 401: {"detail": "Invalid or expired token"}
  - 403: {"detail": "User account is not active or verified"}

## POST /knowledge_base/upload
- Summary: Upload a knowledge base PDF for the authenticated user.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token), Content-Type: multipart/form-data
- JSON request body fields: None (multipart/form-data)
- Multipart form fields:
  - file (file, required)
- JSON response fields and status codes:
  - 200: empty body (no JSON fields in current implementation)
  - 401: {"detail": "Invalid or expired token"}
  - 403: {"detail": "User account is not active or verified"}

## DELETE /knowledge_base/delete/{file_id}
- Summary: Archive a knowledge base file by ID.
- Auth required: Yes
- Query params: None
- Path params:
  - file_id (UUID, required)
- Required headers: Authorization (Bearer token)
- JSON request body fields: None
- JSON response fields and status codes:
  - 204: No content
  - 401: {"detail": "Invalid or expired token"}
  - 403: {"detail": "You can't delete this file"}

## GET /widget/config/{bot_id}
- Summary: Retrieve public widget configuration for a bot.
- Auth required: No
- Query params: None
- Path params:
  - bot_id (UUID, required)
- Required headers: None
- JSON request body fields: None
- JSON response fields and status codes:
  - 200: {"bot_id": UUID, "display_name": string, "primary_color": string, "accent_color": string, "position": "bottom-left" | "bottom-right", "welcome_message": string, "input_placeholder": string, "show_powered_by": boolean}
  - 404: {"detail": "No Widget Found for this bot"}

## PUT /{bot_id}/widget-settings
- Summary: Create or update widget settings for a bot owned by the current user.
- Auth required: Yes
- Query params: None
- Path params:
  - bot_id (UUID, required)
- Required headers: Authorization (Bearer token), Content-Type: application/json
- JSON request body fields:
  - display_name (string, required; 1-100 chars)
  - primary_color (string, optional)
  - accent_color (string, optional)
  - position ("bottom-left" | "bottom-right", optional)
  - welcome_message (string, optional; default value in schema)
  - input_placeholder (string, optional; default value in schema)
  - show_powered_by (boolean, optional)
- JSON response fields and status codes:
  - 200: {"bot_id": UUID, "display_name": string, "primary_color": string, "accent_color": string, "position": "bottom-left" | "bottom-right", "welcome_message": string, "input_placeholder": string, "show_powered_by": boolean}
  - 401: {"detail": "Invalid or expired token"}
  - 403: {"detail": "User account is not active or verified"}
  - 404: {"detail": "Bot not found"}

## POST /chatbot/pdf/to/md
- Summary: Convert a PDF file to Markdown.
- Auth required: No
- Query params: None
- Path params: None
- Required headers: Content-Type: multipart/form-data
- JSON request body fields: None (multipart/form-data)
- Multipart form fields:
  - file (file, required; PDF)
- JSON response fields and status codes:
  - 200: {"markdown": string}

## POST /chatbot-status
- Summary: Webhook endpoint for chatbot ingestion status updates.
- Auth required: No
- Query params: None
- Path params: None
- Required headers: x-n8n-signature (string)
- JSON request body fields:
  - bot_id (UUID, required)
  - type (string, required; expected: "chatbot.ingestion.completed" or "chatbot.ingestion.failed")
- JSON response fields and status codes:
  - 200: empty body (no JSON fields in current implementation)
  - 401: {"detail": "Invalid or expired token"} (only if downstream auth is added)
