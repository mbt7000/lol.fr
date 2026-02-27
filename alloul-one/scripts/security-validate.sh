#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000/v1}"

echo "Checking protected route without token should fail"
if curl -s -o /dev/null -w "%{http_code}" "$API_URL/billing/subscriptions" | grep -qE "401|403"; then
  echo "PASS"
else
  echo "FAIL"; exit 1
fi

echo "Checking audit chain endpoint with token"
TOKEN=$(curl -fsS -X POST "$API_URL/auth/passwordless/verify" -H 'content-type: application/json' -d '{"email":"sec@alloul.one","code":"123456"}' | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
curl -fsS "$API_URL/audit/verify" -H "authorization: Bearer $TOKEN" >/dev/null

echo "Security validation baseline passed"
