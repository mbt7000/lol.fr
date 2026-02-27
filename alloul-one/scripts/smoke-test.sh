#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000/v1}"

echo "[1] health"
curl -fsS "$API_URL/observability/healthz" >/dev/null

echo "[2] auth passwordless"
TOKEN=$(curl -fsS -X POST "$API_URL/auth/passwordless/verify" -H 'content-type: application/json' -d '{"email":"ops@alloul.one","code":"123456"}' | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
  echo "Token acquisition failed"; exit 1
fi

AUTH=(-H "authorization: Bearer $TOKEN")

echo "[3] billing list"
curl -fsS "$API_URL/billing/subscriptions" "${AUTH[@]}" >/dev/null

echo "[4] feed list"
curl -fsS "$API_URL/feed/posts" "${AUTH[@]}" >/dev/null

echo "[5] audit verify"
curl -fsS "$API_URL/audit/verify" "${AUTH[@]}" >/dev/null

echo "Smoke test passed"
