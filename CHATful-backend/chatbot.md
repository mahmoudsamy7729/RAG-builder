# Chatbot API

All authenticated endpoints require HTTP Bearer tokens in `Authorization: Bearer <token>`. Authentication raises 401 for invalid/expired tokens and 403 if the user is not active/verified.

## POST /send-msg
- Summary: Send a chat message to the chatbot service.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token), Content-Type: application/json
- JSON request body: message (string, required)
- Responses:
  - 200: {"status_code": <int>, "message": <string>}
  - 401: Invalid or expired token
  - 403: User account not active/verified

## POST /chatbots
- Summary: Create a chatbot with an initial PDF knowledge base file.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token), Content-Type: multipart/form-data
- Request body (multipart/form-data):
  - name (string, required; 3-100 chars)
  - description (string, optional; up to 500 chars)
  - file (UploadFile, required; PDF only, max 10 MB)
- Responses:
  - 201: ["done"] (set serialized to list)
  - 400: Unsupported file type or file too large
  - 401: Invalid or expired token
  - 403: User account not active/verified

## GET /my-bots
- Summary: List chatbots owned by the current user.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token)
- JSON response (200): list of bots
  - Each item: {id: UUID, name: string, status: "active" | "archived"}
- Error responses: 401 (invalid token), 403 (user not active/verified)

## POST /knowledge_base/upload
- Summary: Upload a knowledge base file for the user.
- Auth required: Yes
- Query params: None
- Path params: None
- Required headers: Authorization (Bearer token), Content-Type: multipart/form-data
- Request body (multipart/form-data):
  - file (UploadFile, required)
- Responses:
  - 200: Empty body (current implementation returns None)
  - 401: Invalid or expired token
  - 403: User account not active/verified

## DELETE /knowledge_base/delete/{file_id}
- Summary: Archive/delete a knowledge base file by ID.
- Auth required: Yes
- Query params: None
- Path params:
  - file_id (UUID, required)
- Required headers: Authorization (Bearer token)
- Responses:
  - 204: No content
  - 403: Deletion forbidden when the file is not owned by the user (or user not active/verified)
  - 401: Invalid or expired token

## GET /widget/config/{bot_id}
- Summary: Retrieve public widget configuration for a bot.
- Auth required: No
- Query params: None
- Path params:
  - bot_id (UUID, required)
- Required headers: None
- JSON response (200): Widget settings
  - {bot_id: UUID, display_name: string, primary_color: string, accent_color: string, position: "bottom-left" | "bottom-right", welcome_message: string, input_placeholder: string, show_powered_by: boolean}
- Error responses: 404 (no widget found for bot)

## PUT /{bot_id}/widget-settings
- Summary: Create or update widget settings for a bot owned by the current user.
- Auth required: Yes
- Query params: None
- Path params:
  - bot_id (UUID, required)
- Required headers: Authorization (Bearer token), Content-Type: application/json
- JSON request body:
  - display_name (string, required; 1-100 chars)
  - primary_color (string, optional; default "#3b82f6")
  - accent_color (string, optional; default "#1e40af")
  - position ("bottom-left" | "bottom-right", optional; default "bottom-right")
  - welcome_message (string, optional; default "Hi dY`< How can I help you?")
  - input_placeholder (string, optional; default "Type your message\u0192?\u0130" — literal non-ASCII characters)
  - show_powered_by (boolean, optional; default true)
- JSON response (200): Updated settings with bot_id
  - {bot_id: UUID, display_name: string, primary_color: string, accent_color: string, position: "bottom-left" | "bottom-right", welcome_message: string, input_placeholder: string, show_powered_by: boolean}
- Error responses: 404 (bot not found for user), 401 (invalid token), 403 (user not active/verified)

