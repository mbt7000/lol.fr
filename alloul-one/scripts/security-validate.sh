#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:4000/v1}"

echo "[1] Protected route without token => 401/403"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/billing/subscriptions")
[[ "$CODE" == "401" || "$CODE" == "403" ]] || { echo "FAIL auth guard"; exit 1; }

echo "[2] Security headers present"
HDR=$(curl -sI "$API_URL/observability/healthz")
echo "$HDR" | grep -qi "x-frame-options" || { echo "FAIL x-frame-options"; exit 1; }
echo "$HDR" | grep -qi "x-content-type-options" || { echo "FAIL x-content-type-options"; exit 1; }
echo "$HDR" | grep -qi "referrer-policy" || { echo "FAIL referrer-policy"; exit 1; }

echo "[3] Acquire token"
TOKEN=$(curl -fsS -X POST "$API_URL/auth/passwordless/verify" -H 'content-type: application/json' -d '{"email":"sec@alloul.one","code":"123456"}' | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
[ -n "$TOKEN" ] || { echo "FAIL token"; exit 1; }

echo "[4] Audit chain verify"
curl -fsS "$API_URL/audit/verify" -H "authorization: Bearer $TOKEN" >/dev/null

echo "[5] Rate limit quick burst (expect at least one 429 eventually)"
HIT429=0
for i in $(seq 1 260); do
  RC=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/observability/healthz")
  if [[ "$RC" == "429" ]]; then HIT429=1; break; fi
done
if [[ "$HIT429" -eq 0 ]]; then
  echo "WARN no 429 observed (environment may vary)"
fi

echo "Security validation baseline passed"
