#!/bin/bash
PORT=${1:-8080}

if command -v php &> /dev/null; then
    echo "Starting PHP server on http://localhost:$PORT"
    php -S localhost:$PORT -t src/html/
elif command -v python3 &> /dev/null; then
    echo "Starting Python server on http://localhost:$PORT"
    cd src/html && python3 -m http.server $PORT
else
    echo "ERROR: Neither PHP nor Python3 available"
    echo "Please install PHP 8.0+ or Python 3.6+ to run the development server"
    exit 1
fi