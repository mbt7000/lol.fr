#!/usr/bin/env bash
set -euo pipefail

ok() { echo "[OK] $1"; }
warn() { echo "[WARN] $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

command -v kubectl >/dev/null 2>&1 && ok "kubectl installed" || warn "kubectl missing"
command -v helm >/dev/null 2>&1 && ok "helm installed" || warn "helm missing"
command -v terraform >/dev/null 2>&1 && ok "terraform installed" || warn "terraform missing"
command -v pnpm >/dev/null 2>&1 && ok "pnpm installed" || fail "pnpm missing"

[ -f "infra/k8s/namespace.yaml" ] && ok "k8s namespace manifest present" || fail "missing infra/k8s/namespace.yaml"
[ -f "infra/k8s/ingress.yaml" ] && ok "ingress manifest present" || fail "missing infra/k8s/ingress.yaml"
[ -f "apps/api/prisma/schema.prisma" ] && ok "prisma schema present" || fail "missing prisma schema"
[ -f "docs/RELEASE_PACK_v1.0.md" ] && ok "release pack present" || fail "missing release pack"

echo "Preflight finished."
