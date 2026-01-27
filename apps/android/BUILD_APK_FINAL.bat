@echo off
echo ============================================
echo EduNexus Android - Final Build Script
echo ============================================
echo.

echo [1/5] Cleaning project...
call gradlew.bat clean

echo.
echo [2/5] Syncing Gradle...
call gradlew.bat --refresh-dependencies

echo.
echo [3/5] Building debug APK...
call gradlew.bat assembleDebug

echo.
echo [4/5] Checking build output...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✓ APK generated successfully!
    echo Location: app\build\outputs\apk\debug\app-debug.apk

    echo.
    echo [5/5] Installing APK to connected device...
    adb install -r "app\build\outputs\apk\debug\app-debug.apk"

    if %ERRORLEVEL% EQU 0 (
        echo ✓ APK installed successfully!
    ) else (
        echo ✗ Failed to install APK. Make sure device is connected.
    )
) else (
    echo ✗ APK build failed. Check errors above.
)

echo.
echo ============================================
echo Build process completed
echo ============================================
pause
