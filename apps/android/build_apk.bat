@echo off
echo ========================================
echo   EduNexus Android - APK Builder
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Gradle Wrapper...
if not exist "gradlew.bat" (
    echo ERROR: Gradle wrapper not found!
    echo Please run: gradle wrapper
    pause
    exit /b 1
)

echo [2/4] Cleaning previous builds...
call gradlew clean
echo.

echo [3/4] Building DEBUG APK...
echo This may take 2-5 minutes on first build...
echo.
call gradlew assembleDebug

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo   BUILD FAILED!
    echo ========================================
    echo.
    echo Check the error messages above.
    echo Common fixes:
    echo   1. Install JDK 17
    echo   2. Set ANDROID_HOME environment variable
    echo   3. Run: gradlew --refresh-dependencies
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo [4/4] APK Location:
echo   %CD%\app\build\outputs\apk\debug\app-debug.apk
echo.
echo File Size:
for %%A in ("app\build\outputs\apk\debug\app-debug.apk") do echo   %%~zA bytes
echo.
echo Next Steps:
echo   1. Connect your Android phone via USB
echo   2. Enable USB Debugging on your phone
echo   3. Run: adb install app\build\outputs\apk\debug\app-debug.apk
echo.
echo Or copy the APK to your phone and install manually.
echo.
pause
