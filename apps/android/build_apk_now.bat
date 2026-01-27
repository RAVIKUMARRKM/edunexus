@echo off
echo ========================================
echo   EduNexus Android - APK Builder
echo ========================================
echo.

cd /d "%~dp0"

echo Setting up Java environment...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java Version:
java -version
echo.

echo ========================================
echo Building DEBUG APK...
echo This will take 2-5 minutes...
echo ========================================
echo.

call gradlew.bat assembleDebug --no-daemon

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Your APK is ready at:
    echo %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo APK Size:
    for %%A in ("app\build\outputs\apk\debug\app-debug.apk") do echo   %%~zA bytes (%%~zA / 1048576 MB^)
    echo.
    echo Next: Install on your phone using:
    echo   adb install app\build\outputs\apk\debug\app-debug.apk
    echo.
) else (
    echo.
    echo ========================================
    echo   BUILD FAILED!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
