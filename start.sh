#!/usr/bin/env bash
# Octavious launcher — Linux & macOS
# Double-click this (or run ./start.sh in a terminal) to start the local
# server and open Octavious in your default browser.

set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but wasn't found on your system."
  echo "Install it from https://nodejs.org (version 18 or newer) and try again."
  read -p "Press Enter to close..."
  exit 1
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp ".env.example" ".env"
  echo "Created .env from .env.example — add your API key(s) in the app's API Settings panel, or edit .env directly."
fi

node server.js
