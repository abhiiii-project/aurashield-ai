@echo off
title AURA-SHIELD AI - Forensic Screening Workstation
echo ========================================================
echo   Starting AURA-SHIELD AI Sentinel System...
echo ========================================================
echo.
start "" http://127.0.0.1:8000
python server.py
pause
