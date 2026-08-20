@echo off
echo ===================================================
echo   Lunar Habitat AI - Push Development to GitHub
echo   Target: https://github.com/harshpenjarla-sys/Lunar-project
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Git Status...
git status

echo.
echo [2/3] Staging all updates...
git add -A
git commit -m "feat: complete Lunar Habitat AI development update & repository team integration" 2>nul

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo   SUCCESS: All development pushed to GitHub!
    echo ===================================================
) else (
    echo ===================================================
    echo   NOTE: If prompted, please complete browser login
    echo   or verify write access permissions to this repo.
    echo ===================================================
)

echo.
pause
