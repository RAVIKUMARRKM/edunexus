# 🚀 BUILD APK NOW - Simple Steps

## ⚡ Quick Method (5 minutes)

### Step 1: Create local.properties file

Create a new file named `local.properties` in this directory:
```
D:\Ravi Kumar\My Personal Work\edunexus\apps\android\local.properties
```

Add this content (update YOUR_USERNAME):
```properties
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

**Example:**
```properties
sdk.dir=C:\\Users\\RaviKumar\\AppData\\Local\\Android\\Sdk
```

**Don't have Android SDK?** Install Android Studio from: https://developer.android.com/studio

---

### Step 2: Build the APK

Open Command Prompt in this directory and run:

```cmd
gradlew.bat assembleDebug
```

**Or** double-click the `build_apk.bat` file.

---

### Step 3: Find Your APK

After successful build, your APK will be at:

```
D:\Ravi Kumar\My Personal Work\edunexus\apps\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📱 Install on Mobile

### Method 1: Via USB (Fastest)

1. **Enable USB Debugging** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect phone via USB**

3. **Install APK:**
   ```cmd
   adb install app\build\outputs\apk\debug\app-debug.apk
   ```

### Method 2: Transfer APK File

1. Copy the APK file from:
   ```
   D:\Ravi Kumar\My Personal Work\edunexus\apps\android\app\build\outputs\apk\debug\app-debug.apk
   ```

2. Transfer to your phone via:
   - USB cable (copy to phone storage)
   - Email it to yourself
   - WhatsApp to yourself
   - Cloud storage (Google Drive, Dropbox)
   - Bluetooth

3. **On your phone:**
   - Open the APK file
   - Tap "Install"
   - If prompted, allow "Install from Unknown Sources"

---

## ❌ Don't Have Android SDK?

### Option A: Use Android Studio (Recommended)

1. **Download:** https://developer.android.com/studio
2. **Install** Android Studio
3. **Open Project:**
   - Open Android Studio
   - Click "Open"
   - Select: `D:\Ravi Kumar\My Personal Work\edunexus\apps\android`
   - Wait for Gradle sync
4. **Build APK:**
   - Click Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Click "locate" in notification to find APK

### Option B: Install SDK Command Line Tools Only

1. **Download:** https://developer.android.com/studio#command-tools
2. **Extract** to: `C:\Android\cmdline-tools`
3. **Set Environment Variable:**
   ```cmd
   setx ANDROID_HOME "C:\Android"
   ```
4. **Install Platform:**
   ```cmd
   sdkmanager "platforms;android-34" "build-tools;34.0.0"
   ```
5. **Build APK:**
   ```cmd
   gradlew.bat assembleDebug
   ```

---

## 🐛 Troubleshooting

### Error: "SDK location not found"
- Create `local.properties` file with correct sdk.dir path

### Error: "java: command not found"
- Install JDK 17: https://adoptium.net/temurin/releases/
- Set JAVA_HOME environment variable

### Error: "Gradle sync failed"
- Delete `.gradle` folder
- Run: `gradlew.bat clean`
- Run: `gradlew.bat assembleDebug --refresh-dependencies`

---

## ✅ Success!

When build succeeds, you'll see:
```
BUILD SUCCESSFUL in 2m 34s
```

Your APK is ready at:
```
app\build\outputs\apk\debug\app-debug.apk
```

File size: ~15-25 MB

---

## 📞 Need Help?

If you get stuck, share the error message and I'll help you fix it!
