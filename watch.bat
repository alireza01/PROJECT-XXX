@echo off
echo Starting file watcher...
echo Press Ctrl+C to stop

:loop
nodemon --watch . --ignore node_modules --ignore .git --exec push.bat
goto loop 