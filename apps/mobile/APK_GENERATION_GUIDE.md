# EduNexus Mobile - APK Generation Guide

This guide provides step-by-step instructions to generate a production-ready APK for the EduNexus mobile app.

---

## 📋 Prerequisites

### 1. Install EAS CLI (One-time)
```bash
npm install -g eas-cli
```

### 2. Create Expo Account
- Visit: https://expo.dev/signup
- Create a free account
- Verify your email

### 3. Login to Expo
```bash
eas login
```
Enter your Expo credentials when prompted.

---

## 🚀 APK Generation Steps

### Step 1: Navigate to Mobile App Directory
```bash
cd apps/mobile
```

### Step 2: Install Dependencies
Make sure all dependencies are installed:
```bash
npm install
```

### Step 3: Configure EAS Build (First Time Only)
```bash
eas build:configure
```

This command will:
- Create/update `eas.json` (already created)
- Link your project to Expo
- Set up build profiles

### Step 4: Update API URL (Important!)

Before building, update the API URL in `app.json` to point to your production backend:

**For local testing on physical device:**
```json
"extra": {
  "apiUrl": "http://YOUR_COMPUTER_IP:3006/api"
}
```
Replace `YOUR_COMPUTER_IP` with your actual IP (e.g., `http://192.168.1.100:3006/api`)

**For production deployment:**
```json
"extra": {
  "apiUrl": "https://your-production-api.com/api"
}
```

### Step 5: Build Preview APK (Recommended for Testing)
```bash
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo servers
- Build the APK in the cloud
- Take approximately 10-20 minutes
- Provide a download link when complete

**What happens:**
- ✅ No need for Android Studio
- ✅ Cloud-based build
- ✅ Faster than local builds
- ✅ Free tier available

### Step 6: Build Production APK (For Release)
```bash
eas build --platform android --profile production
```

Use this for final release version.

---

## 📥 Downloading the APK

### Option 1: Via CLI
```bash
# List all builds
eas build:list

# Download latest build
eas build:download --latest --platform android
```

The APK will be downloaded to your current directory.

### Option 2: Via Web Dashboard
1. Visit: https://expo.dev/accounts/YOUR_USERNAME/projects/edunexus/builds
2. Find your latest build
3. Click "Download" button
4. Save the APK file

---

## 📱 Installing APK on Android Device

### Method 1: Direct Transfer
1. Connect your Android device to computer via USB
2. Copy the downloaded APK to device storage
3. On device, navigate to Downloads folder
4. Tap the APK file
5. Allow "Install from Unknown Sources" if prompted
6. Tap "Install"

### Method 2: Via ADB
```bash
# Install APK using ADB
adb install path/to/your-app.apk

# Or if multiple devices connected
adb -s DEVICE_ID install path/to/your-app.apk
```

### Method 3: Share via Email/Cloud
1. Upload APK to Google Drive / Dropbox
2. Open link on Android device
3. Download and install

---

## 🔧 Build Profiles Explained

### `development` Profile
- For active development
- Includes dev tools
- Larger file size
- Not for distribution

### `preview` Profile (Recommended for testing)
- Internal testing build
- Production-like environment
- Generates standalone APK
- Can be shared with testers

### `production` Profile (For release)
- Final release build
- Optimized and minified
- Smallest file size
- Ready for Play Store or direct distribution

---

## 📊 Build Configuration (eas.json)

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

**Key settings:**
- `buildType: "apk"` - Generates APK (not AAB)
- `distribution: "internal"` - For internal testing
- Production builds are optimized for release

---

## ⚙️ App Configuration (app.json)

Key configurations already set:
```json
{
  "name": "EduNexus",
  "version": "1.0.0",
  "android": {
    "package": "com.edunexus.app",
    "versionCode": 1,
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

**To update version for new builds:**
- Increment `version`: "1.0.0" → "1.0.1"
- Increment `versionCode`: 1 → 2

---

## 🐛 Troubleshooting

### Build Fails
**Problem:** Build fails with "Cannot find module" error
**Solution:**
```bash
rm -rf node_modules
npm install
eas build --platform android --profile preview --clear-cache
```

### API Connection Issues
**Problem:** App can't connect to backend
**Solution:**
1. Check `app.json` → `extra.apiUrl` is correct
2. For local testing, use computer's IP, not `localhost`
3. Ensure backend is running and accessible

### APK Won't Install
**Problem:** "App not installed" error
**Solution:**
1. Enable "Install from Unknown Sources" in device settings
2. Uninstall previous version if exists
3. Ensure sufficient storage space

### Expo Account Issues
**Problem:** Login fails or project not linked
**Solution:**
```bash
eas logout
eas login
eas build:configure
```

---

## 📦 Build Commands Quick Reference

```bash
# Configure EAS Build (first time)
eas build:configure

# Build preview APK for testing
eas build --platform android --profile preview

# Build production APK for release
eas build --platform android --profile production

# List all builds
eas build:list

# View specific build details
eas build:view BUILD_ID

# Download latest APK
eas build:download --latest --platform android

# Cancel ongoing build
eas build:cancel

# Clear build cache
eas build --platform android --profile preview --clear-cache
```

---

## 🎯 Recommended Workflow

### For Testing (First Time)
1. ✅ Update API URL to your computer's IP
2. ✅ Run: `eas build --platform android --profile preview`
3. ✅ Wait for build to complete (~15 mins)
4. ✅ Download APK
5. ✅ Install on device
6. ✅ Test all features

### For Production Release
1. ✅ Update API URL to production backend
2. ✅ Test thoroughly on preview build first
3. ✅ Update version numbers in app.json
4. ✅ Run: `eas build --platform android --profile production`
5. ✅ Download and distribute

---

## 💡 Tips

1. **Free Tier Limits**: Expo free plan includes limited build minutes. Monitor usage at expo.dev
2. **Build Time**: Builds typically take 10-20 minutes. You can close terminal - build continues in cloud
3. **Notifications**: Enable email notifications in Expo dashboard to get notified when build completes
4. **Version Management**: Always increment version numbers for each new build
5. **Testing**: Test preview builds thoroughly before creating production builds
6. **Local Backend**: For testing with local backend, use your computer's IP address, not localhost

---

## 📝 Next Steps After APK Generation

1. **Internal Testing**
   - Share preview APK with team members
   - Test all features thoroughly
   - Collect feedback

2. **Production Deployment**
   - Build production APK
   - Create release notes
   - Distribute to users

3. **Play Store Submission (Optional)**
   - Generate AAB instead of APK: `"buildType": "app-bundle"`
   - Follow Google Play Store guidelines
   - Submit for review

---

## 🔗 Useful Links

- EAS Build Documentation: https://docs.expo.dev/build/setup/
- Expo Dashboard: https://expo.dev
- Android Debug Bridge (ADB): https://developer.android.com/tools/adb
- App Signing: https://docs.expo.dev/app-signing/app-credentials/

---

## ✅ Checklist Before Building

- [ ] All dependencies installed (`npm install`)
- [ ] API URL configured correctly in `app.json`
- [ ] Backend server is running and accessible
- [ ] EAS CLI installed and logged in
- [ ] Project linked to Expo account
- [ ] Version numbers updated (if not first build)
- [ ] Tested in development mode first

---

## 🎉 Success!

Once your build completes, you'll receive:
- ✅ Downloadable APK file
- ✅ Build logs for debugging
- ✅ QR code for easy distribution
- ✅ Build ID for tracking

Your EduNexus mobile app is now ready to install on any Android device!

---

**Need Help?**
- Check build logs: `eas build:view BUILD_ID`
- Expo Forums: https://forums.expo.dev
- Documentation: https://docs.expo.dev
