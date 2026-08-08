#!/usr/bin/env bash
# 生成自包含单文件 HTML。详见 standalone/README.md
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p standalone/out
./node_modules/.bin/esbuild standalone/entry.tsx \
  --bundle --minify --format=iife --jsx=automatic \
  --define:process.env.NODE_ENV='"production"' \
  --inject:standalone/shim.js \
  --alias:next/image=./standalone/next-image-shim.tsx \
  --loader:.tsx=tsx --loader:.ts=ts \
  --outfile=/tmp/app.js
./node_modules/.bin/tailwindcss -i app/globals.css -o /tmp/app.css --minify
python3 standalone/make_assets.py
python3 standalone/inline.py
python3 standalone/build_html.py
