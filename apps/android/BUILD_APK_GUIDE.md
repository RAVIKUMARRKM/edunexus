# 📱 EduNexus Android APK Build Guide

This guide will help you build and install the EduNexus Android APK on your physical device.

## 📋 Prerequisites

### Required Software

1. **Java Development Kit (JDK) 17+**
   - Download: https://adoptium.net/temurin/releases/
   - Verify installation: `java -version`

2. **Android Studio** (Recommended) OR **Android SDK Command Line Tools**
   - Download Android Studio: https://developer.android.com/studio
   - Or SDK Tools only: https://developer.android.com/studio#command-tools

3. **Git** (Already installed)
   - Verify: `git --version`

### Android SDK Setup

If you have Android Studio:
- Open Android Studio → Tools → SDK Manager
- Install:
  - Android SDK Platform 34 (Android 14)
  - Android SDK Build-Tools 34.0.0
  - Android SDK Platform-Tools

If using command line tools:
```bash
sdkmanager "platforms;android-34" "build-tools;34.0.0" "platform-tools"
```

### Environment Variables

Set `ANDROID_HOME` environment variable:

**Windows:**
```cmd
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
```

**Verify:**
```cmd
echo %ANDROID_HOME%
adb version
```

---

## 🔨 Building the APK

### Method 1: Using gradlew (Recommended)

Navigate to the android project directory:

```bash
cd "D:\Ravi Kumar\My Personal Work\edunexus\apps\android"
```

#### Build Debug APK (Faster, for testing)

```bash
gradlew assembleDebug
```

**Output:** `app/build/outputs/apk/debug/app-debug.apk`

#### Build Release APK (Optimized)

```bash
gradlew assembleRelease
```

**Output:** `app/build/outputs/apk/release/app-release.apk`

### Method 2: Using Android Studio

1. Open Android Studio
2. File → Open → Select `D:\Ravi Kumar\My Personal Work\edunexus\apps\android`
3. Wait for Gradle sync to complete
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Click "locate" in the notification to find the APK

---

## 📲 Installing on Physical Device

### Enable Developer Options on Your Phone

1. Go to **Settings → About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging**
5. Enable **Install via USB** (if available)

### Install APK via USB

1. **Connect your phone via USB cable**

2. **Verify device connection:**
   ```bash
   adb devices
   ```
   You should see your device listed. If "unauthorized", accept the prompt on your phone.

3. **Install the APK:**

   **For Debug APK:**
   ```bash
   adb install "app/build/outputs/apk/debug/app-debug.apk"
   ```

   **For Release APK:**
   ```bash
   adb install "app/build/outputs/apk/release/app-release.apk"
   ```

4. **If the app is already installed (re-install):**
   ```bash
   adb install -r "app/build/outputs/apk/debug/app-debug.apk"
   ```

### Install APK Wirelessly

1. Copy the APK to your phone (via USB, email, cloud storage, etc.)
2. Open the APK file on your phone
3. Tap **Install**
4. Accept the "Install from Unknown Sources" prompt if needed

---

## 🧪 Testing the APK

### Test Checklist

See `APK_TEST_CHECKLIST.md` for a comprehensive testing guide.

**Quick Test Flow:**

1. ✅ Launch app → See splash screen → Auto-navigate to login or dashboard
2. ✅ Login screen → Enter credentials → Login
3. ✅ Dashboard → See stats cards and quick actions
4. ✅ Bottom navigation → Switch between tabs
5. ✅ Students → View list, search, filter
6. ✅ Add student → Fill form → Save
7. ✅ Student detail → View info → Edit → Delete
8. ✅ Teachers → Same flow as students
9. ✅ Profile → View profile → Edit → Change password → Logout

### Test Credentials

**Mock login (for testing):**
- Email: `admin@edunexus.com`
- Password: `admin123`

**Note:** Update the API URL in `app/build.gradle.kts` if testing with real backend:
```kotlin
buildConfigField("String", "API_URL", "\"http://YOUR_SERVER_IP:3007/api/\"")
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: SDK location not found**
- Solution: Create `local.properties` file:
  ```properties
  sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
  ```

**Error: Gradle sync failed**
- Solution:
  ```bash
  gradlew clean
  gradlew build --refresh-dependencies
  ```

**Error: Unsupported Java version**
- Solution: Install JDK 17 and set `JAVA_HOME`:
  ```cmd
  setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot"
  ```

### Installation Errors

**Error: INSTALL_FAILED_UPDATE_INCOMPATIBLE**
- Solution: Uninstall the existing app first:
  ```bash
  adb uninstall com.edunexus.android
  ```

**Error: adb: device unauthorized**
- Solution: On your phone, tap "Always allow from this computer" and click OK

**Error: more than one device/emulator**
- Solution: Specify device:
  ```bash
  adb devices
  adb -s DEVICE_ID install app-debug.apk
  ```

### Runtime Errors

**App crashes on launch:**
- Check logcat: `adb logcat | findstr EduNexus`
- Look for Hilt errors → ensure all @HiltAndroidApp annotations are present
- Look for network errors → verify API URL configuration

**Network not working:**
- Ensure your phone is on the same network as your backend server
- Update API URL from `10.0.2.2` (emulator) to your server's local IP
- Disable HTTPS redirects if using HTTP

---

## 📦 APK Signing (For Production)

Currently using debug signing for internal testing. For production:

### Generate Keystore

```bash
keytool -genkey -v -keystore edunexus-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias edunexus
```

### Configure Signing in `app/build.gradle.kts`

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("../edunexus-release-key.jks")
            storePassword = "YOUR_STORE_PASSWORD"
            keyAlias = "edunexus"
            keyPassword = "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

### Build Signed APK

```bash
gradlew assembleRelease
```

---

## 📊 Build Info

| Item | Value |
|------|-------|
| **Package Name** | `com.edunexus.android` |
| **Min SDK** | 24 (Android 7.0) |
| **Target SDK** | 34 (Android 14) |
| **Version Code** | 1 |
| **Version Name** | 1.0.0 |

---

## 🚀 Quick Build Script

Create `build_apk.bat` for quick builds:

```batch
@echo off
echo Building EduNexus Android APK...
cd "D:\Ravi Kumar\My Personal Work\edunexus\apps\android"
call gradlew assembleDebug
echo.
echo Build complete!
echo APK location: app\build\outputs\apk\debug\app-debug.apk
pause
```

Run: Double-click `build_apk.bat` or run `build_apk.bat` in command prompt.

---

## ✅ Success Indicators

You'll know the build succeeded when you see:

```
BUILD SUCCESSFUL in Xm Xs
```

And the APK file exists at the specified output location.

---

## 📱 Next Steps After Successful Install

1. Test all implemented features (Dashboard, Students, Teachers, Profile)
2. Report any bugs or issues
3. After verification, remaining modules will be implemented:
   - Classes
   - Attendance
   - Exams
   - Fees
   - Library
   - Transport
   - Hostel
   - HR
   - Inventory
   - Reports
   - Communication

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify all prerequisites are installed
3. Check `BUILD_ERRORS.md` for common solutions
4. Check Android Studio's Build Output panel for detailed errors
