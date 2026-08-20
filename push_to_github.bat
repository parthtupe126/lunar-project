@echo off
echo ===================================================
echo   Lunar Habitat AI - Pushing Updates to GitHub
echo   Target: https://github.com/harshpenjarla-sys/Lunar-project
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Git Status...
git status

echo.
echo [2/3] Staging and committing all updates...
git add -A
git commit -m "feat: 3D high-fidelity spinning moon opening sequence, auto-navigation, UI refinements, and resilient real-photos sync" 2>nul

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo   SUCCESS: Changes successfully pushed to GitHub!
    echo ===================================================
) else (
    echo ===================================================
    echo   NOTE: If prompted, please log in via GitHub browser popup
    echo   or verify write access permissions to this repo.
    echo ===================================================
)

echo.
pause
