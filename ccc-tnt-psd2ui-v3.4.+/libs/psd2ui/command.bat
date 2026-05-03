@echo off

set input1=%1%
set input2=%2%

cd /d %~dp0

REM 优先使用内嵌的 node，没有则回退到系统 node
if exist "%~dp0..\..\bin\node.exe" (
    "%~dp0..\..\bin\node.exe" ./index.js %input1% %input2%
    goto :end
)

echo [psd2ui] 使用系统 node
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [psd2ui] 找不到 node，请安装 Node.js 22+ 后重试。
    echo.
    pause
    exit /b 1
)
node ./index.js %input1% %input2%

:end
pause
exit
