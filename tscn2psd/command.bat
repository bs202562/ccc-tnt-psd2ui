@echo off
setlocal

cd /d %~dp0

if not exist node_modules (
    echo.
    echo [tscn2psd] node_modules 不存在，需要先安装依赖。
    echo [tscn2psd] 在本目录执行: npm install
    echo.
    pause
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [tscn2psd] 找不到 node，请先安装 Node.js 16+
    echo.
    pause
    exit /b 1
)

node tscn2psd.js %*

pause
exit /b %ERRORLEVEL%
