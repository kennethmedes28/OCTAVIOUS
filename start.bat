@echo off
REM Octavious launcher — Windows
REM Double-click this file to start the local server and open Octavious in
REM your default browser.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is required but wasn't found on your system.
  echo Install it from https://nodejs.org (version 18 or newer) and try again.
  pause
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    copy ".env.example" ".env" >nul
    echo Created .env from .env.example — add your API key(s) in the app's API Settings panel, or edit .env directly.
  )
)

node server.js
pause
