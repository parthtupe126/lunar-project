@echo off
title Lunar Habitat AI Launcher
echo ===================================================
echo        Starting Lunar Habitat AI Project
echo ===================================================
echo.
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting development server...
call npm run dev
pause
