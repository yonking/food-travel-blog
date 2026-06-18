@echo off
chcp 65001 >nul 2>&1
title 美食游记 - 一键发布

echo.
echo  ========================================
echo   美食游记 - 一键发布到 Vercel
echo  ========================================
echo.

cd /d "%~dp0"

echo [1/3] 暂存文件...
git add -A

echo [2/3] 提交更改...
for /f "tokens=*" %%i in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set TIMESTAMP=%%i
git commit -m "post: update content %TIMESTAMP%" 2>nul
if errorlevel 1 (
    echo.
    echo  没有新的更改需要发布。
    echo.
    pause
    exit /b 0
)

echo [3/3] 推送到 GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo  推送失败！请检查网络和代理设置。
    echo.
    pause
    exit /b 1
)

echo.
echo  ========================================
echo   发布成功！
echo   Vercel 将在 1-2 分钟内更新：
echo   https://food-travel-blog.vercel.app/
echo  ========================================
echo.
pause
