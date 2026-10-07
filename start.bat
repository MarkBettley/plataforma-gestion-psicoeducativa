@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8080

where php >nul 2>nul
if %errorlevel%==0 (
    echo Starting PHP server on http://localhost:%PORT%
    php -S localhost:%PORT% -t src/html/
    goto :eof
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    echo Starting Python server on http://localhost:%PORT%
    cd src\html && python3 -m http.server %PORT%
    goto :eof
)

echo ERROR: Neither PHP nor Python3 available
echo Please install PHP 8.0+ or Python 3.6+ to run the development server
exit /b 1