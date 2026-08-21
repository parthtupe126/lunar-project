@echo off
title Lunar Habitat AI Launcher
echo ===================================================
echo        Starting Lunar Habitat AI Project
echo ===================================================
echo.
cd /d "%~dp0frontend"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo Dev Server starting at http://localhost:5173/
echo Opening browser...
start http://localhost:5173/
echo.
call npm run dev
pause
