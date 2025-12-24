# Auth API

Base URL: (no router prefix configured; paths are as listed)

## POST /register
- Summary: Register a new user
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - email (EmailStr, required)
  - username (str, required)
  - password (str, required, 6-128 chars)
- JSON response:
  - Status 201: UserRead
    - id (UUID)
    - email (EmailStr)
    - username (str)
    - provider (Provider)

## POST /login
- Summary: Log in with email/password
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - email (EmailStr, required)
  - password (str, required, 6-128 chars)
- JSON response:
  - Status 200: UserLoginResponse
    - token (str)
    - refresh_token (str)
    - type (str, default "Bearer")
    - user (UserRead)
      - id (UUID)
      - email (EmailStr)
      - username (str)
      - provider (Provider)

## POST /refresh-token
- Summary: Refresh access token
- Auth required: No
- Query params:
  - token (str, required)
- Path params: None
- Required headers: None
- JSON request body fields: None
- JSON response:
  - Status 200: RefreshTokenResponse
    - token (str)
    - refresh_token (str)
    - type (str, default "Bearer")

## GET /verify
- Summary: Verify email with token
- Auth required: No
- Query params:
  - token (str, required)
- Path params: None
- Required headers: None
- JSON request body fields: None
- JSON response:
  - Status 202: MessageResponse
    - message (str)

## POST /request/verify
- Summary: Request a new verification email
- Auth required: Yes (Bearer token)
- Query params: None
- Path params: None
- Required headers:
  - Authorization: Bearer <access_token>
- JSON request body fields: None
- JSON response:
  - Status 202: MessageResponse
    - message (str)

## POST /forget-password
- Summary: Request a password reset email
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - email (EmailStr, required)
- JSON response:
  - Status 202: MessageResponse
    - message (str)

## POST /new-password
- Summary: Set a new password using reset token
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - token (str, required)
  - password (str, required)
- JSON response:
  - Status 202: MessageResponse
    - message (str)

## POST /change-password
- Summary: Change password for active user
- Auth required: Yes (Bearer token)
- Query params: None
- Path params: None
- Required headers:
  - Authorization: Bearer <access_token>
- JSON request body fields:
  - old_password (str, required, 6-128 chars)
  - new_password (str, required, 6-128 chars)
- JSON response:
  - Status 200: MessageResponse
    - message (str)

## POST /request/login-code
- Summary: Request a login code via email
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - email (EmailStr, required)
- JSON response:
  - Status 200: MessageResponse
    - message (str)

## POST /login/code
- Summary: Log in with email and one-time code
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields:
  - email (EmailStr, required)
  - code (str, required)
- JSON response:
  - Status 200: UserLoginResponse
    - token (str)
    - refresh_token (str)
    - type (str, default "Bearer")
    - user (UserRead)
      - id (UUID)
      - email (EmailStr)
      - username (str)
      - provider (Provider)

## GET /google/login
- Summary: Start Google OAuth login
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields: None
- JSON response:
  - Status 307: RedirectResponse (Location header set)

## GET /auth/social/callback/google
- Summary: Google OAuth callback
- Auth required: No
- Query params: None explicitly declared
- Path params: None
- Required headers: None
- JSON request body fields: None
- JSON response:
  - Status 200: UserLoginResponse
    - token (str)
    - refresh_token (str)
    - type (str, default "Bearer")
    - user (UserRead)
      - id (UUID)
      - email (EmailStr)
      - username (str)
      - provider (Provider)

## GET /github/login
- Summary: Start GitHub OAuth login
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body fields: None
- JSON response:
  - Status 307: RedirectResponse (Location header set)

## GET /auth/social/callback/github
- Summary: GitHub OAuth callback
- Auth required: No
- Query params: None explicitly declared
- Path params: None
- Required headers: None
- JSON request body fields: None
- JSON response:
  - Status 200: UserLoginResponse
    - token (str)
    - refresh_token (str)
    - type (str, default "Bearer")
    - user (UserRead)
      - id (UUID)
      - email (EmailStr)
      - username (str)
      - provider (Provider)

## POST /deactivate
- Summary: Deactivate current user
- Auth required: Yes (Bearer token)
- Query params: None
- Path params: None
- Required headers:
  - Authorization: Bearer <access_token>
- JSON request body fields: None
- JSON response:
  - Status 202: MessageResponse
    - message (str)
