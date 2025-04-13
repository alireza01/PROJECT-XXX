@echo off
echo Running tests...
call npm run test
if %ERRORLEVEL% NEQ 0 (
    echo Tests failed. Please fix the tests before pushing.
    exit /b 1
)

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Auto-commit: %date% %time%"

echo Pushing to GitHub...
git push origin master

echo Done! 