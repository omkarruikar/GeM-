@echo off
title Push GeM Prototype to GitHub
echo =======================================================
echo   Pushing GeM Prototype to https://github.com/omkarruikar/GeM-.git
echo =======================================================
cd /d "%~dp0"
echo.
echo Current Git Status:
git status
echo.
echo Pushing main branch to origin...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Initial push requires rebase or force sync. Trying rebase pull...
    git pull origin main --rebase --allow-unrelated-histories
    git push -u origin main
)
echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================
    echo [SUCCESS] Prototype successfully pushed to GitHub!
    echo Visit: https://github.com/omkarruikar/GeM-
    echo =======================================================
) else (
    echo =======================================================
    echo [!] If authentication is needed, please enter your GitHub credentials or Personal Access Token.
    echo =======================================================
)
echo.
pause
