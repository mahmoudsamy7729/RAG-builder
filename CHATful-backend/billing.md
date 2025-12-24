# Billing API

All endpoints are under the `/billing` prefix.

## GET /billing/plans
- Summary: List available billing plans.
- Auth required: No
- Query params: None
- Path params: None
- Required headers: None
- JSON request body: None
- JSON response (200): Array of `PlanOut` objects with fields `id` (UUID), `name` (string), `code` (string), `price_cents` (integer), `currency` (string).

## POST /billing/plans
- Summary: Create a new billing plan.
- Auth required: Yes (admin bearer token)
- Query params: None
- Path params: None
- Required headers: `Authorization: Bearer <token>`
- JSON request body: `PlanCreate` with `name` (string, required), `code` (string, required), `price_cents` (integer, required), `billing_period` (string enum `monthly`|`yearly`, required), `currency` (string, default `"USD"`), `is_active` (boolean, default `true`).
- JSON response (201): `PlanOut` with `id`, `name`, `code`, `price_cents`, `currency`.

## GET /billing/plans/{plan_id}
- Summary: Retrieve a billing plan by ID.
- Auth required: No
- Query params: None
- Path params: `plan_id` (UUID)
- Required headers: None
- JSON request body: None
- JSON response (200): `PlanOut` with `id`, `name`, `code`, `price_cents`, `currency`.

## DELETE /billing/plans/{plan_id}
- Summary: Soft-delete a billing plan.
- Auth required: Yes (admin bearer token)
- Query params: None
- Path params: `plan_id` (UUID)
- Required headers: `Authorization: Bearer <token>`
- JSON request body: None
- JSON response (204): No content.

## PATCH /billing/plans/{plan_id}
- Summary: Update fields on a billing plan.
- Auth required: Yes (admin bearer token)
- Query params: None
- Path params: `plan_id` (UUID)
- Required headers: `Authorization: Bearer <token>`
- JSON request body: `PlanUpdate` with optional fields `name` (string), `price_cents` (integer), `billing_period` (string enum `monthly`|`yearly`), `currency` (string), `is_active` (boolean).
- JSON response (200): `PlanOut` with `id`, `name`, `code`, `price_cents`, `currency`.

## GET /billing/payments/me
- Summary: List payments for the authenticated user.
- Auth required: Yes (user bearer token)
- Query params: None
- Path params: None
- Required headers: `Authorization: Bearer <token>`
- JSON request body: None
- JSON response (200): Array of `PaymentResponse` objects with fields `id` (UUID), `subscription_id` (UUID|null), `provider` (enum `manual`|`stripe`|`paymob`), `provider_invoice_id` (string), `status` (enum `succeeded`|`pending`|`failed`), `created_at` (datetime).

## GET /billing/subscriptions/me
- Summary: Get the authenticated user's active subscription.
- Auth required: Yes (user bearer token)
- Query params: None
- Path params: None
- Required headers: `Authorization: Bearer <token>`
- JSON request body: None
- JSON response (200): `SubscriptionOut` with `id` (UUID), `status` (enum `active`|`trialing`|`pending`|`canceled`|`past_due`), `started_at` (datetime), `cancel_at_period_end` (boolean), `current_period_end` (datetime|null), `provider` (enum `manual`|`stripe`|`paymob`), `provider_subscription_id` (string), `plan` (`PlanOut`).

## POST /billing/subscriptions/subscribe
- Summary: Subscribe the authenticated user to a plan.
- Auth required: Yes (user bearer token)
- Query params: None
- Path params: None
- Required headers: `Authorization: Bearer <token>`
- JSON request body: `SubscribeRequest` with `plan_code` (string, required).
- JSON response (201): `CheckoutUrlResponse` with `checkout_url` (string).

## POST /billing/subscriptions/cancel
- Summary: Schedule cancellation of the current subscription at period end.
- Auth required: Yes (user bearer token)
- Query params: None
- Path params: None
- Required headers: `Authorization: Bearer <token>`
- JSON request body: None
- JSON response (200): `SubscriptionOut` with fields as in GET `/billing/subscriptions/me`.

## POST /billing/subscriptions/upgrade
- Summary: Upgrade the user's subscription to a different plan.
- Auth required: Yes (user bearer token)
- Query params: None
- Path params: None
- Required headers: `Authorization: Bearer <token>`
- JSON request body: `SubscribeRequest` with `plan_code` (string, required).
- JSON response (200): `CheckoutUrlResponse` with `checkout_url` (string).

## POST /billing/stripe/webhook
- Summary: Stripe webhook receiver for subscription/payment events.
- Auth required: No
- Query params: None
- Path params: None
- Required headers: `Stripe-Signature` (string)
- JSON request body: Raw Stripe event payload.
- JSON response (200): `true` (boolean) on successful processing.
