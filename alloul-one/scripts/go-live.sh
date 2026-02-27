#!/usr/bin/env bash
set -euo pipefail

NS="alloul-one"

echo "[1/6] Preflight"
./scripts/preflight.sh

echo "[2/6] Apply namespace + secrets template"
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/secrets/secret-template.yaml

echo "[3/6] Apply core workloads"
kubectl apply -f infra/k8s/api-deployment.yaml
kubectl apply -f infra/k8s/api-service.yaml
kubectl apply -f infra/k8s/web-deployment.yaml
kubectl apply -f infra/k8s/web-service.yaml
kubectl apply -f infra/k8s/worker-deployment.yaml

echo "[4/6] Apply ingress/autoscaling"
kubectl apply -f infra/k8s/ingress.yaml
kubectl apply -f infra/k8s/api-hpa.yaml

echo "[5/6] Apply monitoring"
kubectl apply -f infra/k8s/monitoring/

echo "[6/6] Rollout status"
kubectl rollout status deployment/alloul-api -n "$NS" --timeout=180s
kubectl rollout status deployment/alloul-web -n "$NS" --timeout=180s
kubectl rollout status deployment/alloul-worker -n "$NS" --timeout=180s

echo "Go-live baseline applied. Next: run scripts/smoke-test.sh against production API URL."
