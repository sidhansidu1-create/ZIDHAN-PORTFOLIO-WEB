@echo off
title Deploying to zidhan.com...
echo ========================================================
echo   DEPLOYING INTERACTIVE FLIPBOOK TO ZIDHAN.COM
echo ========================================================
echo.
echo Uploading files to GitHub...
echo (If a GitHub login window or browser opens, click "Authorize / Sign In")
echo.
cd /d "%~dp0"
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] All files uploaded to GitHub!
    echo   Cloudflare is now deploying live to:
    echo   https://zidhan.com/design-principles.html
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [NOTICE] If GitHub asked you to sign in, please
    echo   sign in and run this file one more time.
    echo ========================================================
)

echo.
pause
