@echo off

:: Run the build command using 'call' to ensure the script continues
call npm run build

:: Check if the build was successful
if %ERRORLEVEL% NEQ 0 (
    echo Build failed, aborting push.
    exit /b 1
)

:: If build was successful, proceed with git commands
echo Build succeeded, pushing to GitHub...

@REM git pull is done to ensure that the local repository is up to date with the remote repository
git pull

@REM Add all changes, commit with the provided message, and push to the remote repository
git add .
git commit -m "%1"
git push -u origin main
