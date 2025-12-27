# Chatbot API

Base URL: no router prefix configured; paths are as listed below.

## POST /send-msg - Send a chat message to a bot and return its response

Auth required: no

Query params: none

Path params: none

Required headers: none

JSON request body fields:
- message: string, required
- bot_id: uuid, required
- visitor_id: uuid, required

JSON response fields and status codes:
- 200: object
  - status_code: integer (upstream status returned by N8N)
  - answer: string (markdown stripped)

## POST /chatbots - Create a chatbot and optionally trigger ingestion

Auth required: yes (Authorization: Bearer <token>)

Query params: none

Path params: none

Required headers:
- Authorization: Bearer <token>

JSON request body fields:
- None (multipart/form-data fields are used)
  - name: string, required (form field)
  - description: string, optional (form field)
  - allowed_hosts: string, optional (form field; comma or newline separated)
  - source_type: string, optional (form field; one of file, webpage, website; default file)
  - url: string, required when source_type is webpage or website (form field)
  - file: file, optional (multipart file; required when source_type is file)

JSON response fields and status codes:
- 201: object
  - id: uuid

## GET /my-bots - List the current user's chatbots

Auth required: yes (Authorization: Bearer <token>)

Query params: none

Path params: none

Required headers:
- Authorization: Bearer <token>

JSON request body fields:
- None

JSON response fields and status codes:
- 200: array of objects
  - id: uuid
  - name: string
  - status: string (active, archived, pending, failed)

## POST /knowledge_base/upload - Upload a knowledge base file for ingestion

Auth required: yes (Authorization: Bearer <token>)

Query params: none

Path params: none

Required headers:
- Authorization: Bearer <token>

JSON request body fields:
- None (multipart/form-data fields are used)
  - file: file, required (multipart file)

JSON response fields and status codes:
- 200: empty response body (service returns no payload)

## DELETE /knowledge_base/delete/{file_id} - Archive a knowledge base file

Auth required: yes (Authorization: Bearer <token>)

Query params: none

Path params:
- file_id: uuid, required

Required headers:
- Authorization: Bearer <token>

JSON request body fields:
- None

JSON response fields and status codes:
- 204: no content

## GET /widget/config/{bot_id} - Get widget settings for a bot

Auth required: no

Query params: none

Path params:
- bot_id: uuid, required

Required headers: none

JSON request body fields:
- None

JSON response fields and status codes:
- 200: object
  - bot_id: uuid
  - display_name: string
  - primary_color: string
  - accent_color: string
  - position: string (bottom-left, bottom-right)
  - welcome_message: string
  - input_placeholder: string
  - show_powered_by: boolean

## PUT /{bot_id}/widget-settings - Create or update widget settings for a bot

Auth required: yes (Authorization: Bearer <token>)

Query params: none

Path params:
- bot_id: uuid, required

Required headers:
- Authorization: Bearer <token>

JSON request body fields:
- display_name: string, required
- primary_color: string, required
- accent_color: string, required
- position: string, required (bottom-left, bottom-right)
- welcome_message: string, required
- input_placeholder: string, required
- show_powered_by: boolean, required

JSON response fields and status codes:
- 200: object
  - bot_id: uuid
  - display_name: string
  - primary_color: string
  - accent_color: string
  - position: string (bottom-left, bottom-right)
  - welcome_message: string
  - input_placeholder: string
  - show_powered_by: boolean

## POST /chatbot/pdf/to/md - Convert a PDF to markdown

Auth required: no

Query params: none

Path params: none

Required headers: none

JSON request body fields:
- None (multipart/form-data fields are used)
  - file: file, required (multipart file)

JSON response fields and status codes:
- 200: object
  - markdown: string

## POST /chatbot-status - Webhook to update chatbot ingestion status

Auth required: no

Query params: none

Path params: none

Required headers:
- x-n8n-signature: string

JSON request body fields:
- bot_id: uuid, required
- type: string, required (expected values: chatbot.ingestion.completed, chatbot.ingestion.failed)

JSON response fields and status codes:
- 200: empty response body (handler does not return a payload)
