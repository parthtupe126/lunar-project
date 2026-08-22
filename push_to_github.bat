@echo off
setlocal EnableDelayedExpansion
title Push Lunar Project to GitHub
echo ===================================================
echo   Lunar Habitat AI - Push Development to GitHub
echo   Target: https://github.com/harshpenjarla-sys/Lunar-project 
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Staging and committing all updates...
git add -A
git commit -m "feat: complete Lunar Habitat AI development update & repository team integration" 2>nul

echo.
echo [2/3] Commits to be pushed:
git log origin/main..HEAD --oneline 2>nul

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo   SUCCESS: All development pushed to GitHub!
    echo ===================================================
    goto END
)

echo.
echo ===================================================
echo   GitHub authentication or permissions required.
echo ===================================================
echo.
echo If you have a GitHub Personal Access Token (PAT), you can
echo enter it below to push instantly.
echo.
set /p TOKEN="Enter GitHub Personal Access Token (or press ENTER to exit): "

if not "!TOKEN!"=="" (
    echo.
    echo Pushing using Personal Access Token...
    git push https://!TOKEN!@github.com/harshpenjarla-sys/Lunar-project.git main
    if !ERRORLEVEL! equ 0 (
        echo.
        echo ===================================================
        echo   SUCCESS: All development pushed to GitHub!
        echo ===================================================
        goto END
    ) else (
        echo.
        echo Push failed. Please verify that your token has 'repo' write permissions.
    )
)

:END
echo.
pause
