@echo off
chcp 65001 >nul 2>&1
title 美食游记 - 本地编辑器

echo.
echo  ========================================
echo   美食游记 - 启动本地编辑器
echo  ========================================
echo.
echo  启动中，请稍候...
echo  启动后浏览器打开: http://localhost:3000/admin
echo  按 Ctrl+C 停止服务器
echo.

cd /d "%~dp0"
npm run dev
