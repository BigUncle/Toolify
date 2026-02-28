#!/usr/bin/env bash
set -euo pipefail

echo "[vercel-build] Installing Python deps..."
pip install -r requirements.txt

echo "[vercel-build] Installing Node deps..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "[vercel-build] Done."
