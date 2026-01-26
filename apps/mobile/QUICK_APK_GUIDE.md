# Quick APK Generation Guide

## 📱 Generate APK in 5 Steps

### **First Time Setup (Do Once)**

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Create Expo Account
- Visit: https://expo.dev/signup
- Create free account
- Verify email

#### 3. Login to EAS
```bash
eas login
```
Enter your Expo username and password.

---

## 🔄 **Every Time You Build APK**

### Step 1: Update API URL (if needed)
Open `apps/mobile/app.json` line 55:

**For local testing:**
```json
"apiUrl": "http://192.168.1.24:3007/api"
```

**For production:**
```json
"apiUrl": "https://your-production-api.com/api"
```

### Step 2: Navigate to Mobile App
```bash
cd apps/mobile
```

### Step 3: Build APK
```bash
eas build --platform android --profile preview
```

**What happens:**
- Code uploads to Expo servers (~1-2 min)
- APK builds in cloud (~10-20 min)
- You get download link

### Step 4: Download APK
After build completes:
```bash
eas build:download --latest --platform android
```

Or download from: https://expo.dev/accounts/YOUR_USERNAME/projects/edunexus/builds

### Step 5: Install on Phone
- Transfer APK to phone
- Open file on phone
- Allow "Install from Unknown Sources" if prompted
- Tap Install

---

## 📋 **Quick Commands Reference**

```bash
# Build preview APK (for testing)
cd apps/mobile
eas build --platform android --profile preview

# Build production APK (for release)
cd apps/mobile
eas build --platform android --profile production

# List all builds
eas build:list

# Download latest build
eas build:download --latest --platform android

# Check build status
eas build:view BUILD_ID

# Cancel ongoing build
eas build:cancel
```

---

## 🎯 **Build Profiles**

### **Preview Profile** (Recommended for testing)
```bash
eas build --platform android --profile preview
```
- Internal testing
- Faster builds
- Good for development

### **Production Profile** (For final release)
```bash
eas build --platform android --profile production
```
- Optimized and minified
- Smallest file size
- Ready for Play Store

---

## 💡 **Tips**

1. **Build Time**: Builds take 10-20 minutes, you can close terminal
2. **Email Notifications**: Enable in Expo dashboard to get notified
3. **Free Tier**: Limited build minutes per month
4. **Version Updates**: Update version in `app.json` before each build:
   ```json
   "version": "1.0.0" → "1.0.1"
   "versionCode": 1 → 2
   ```

---

## 🐛 **Troubleshooting**

### "Build Failed"
```bash
cd apps/mobile
rm -rf node_modules
npm install
eas build --platform android --profile preview --clear-cache
```

### "Cannot Login"
```bash
eas logout
eas login
```

### "Project Not Found"
```bash
eas build:configure
```

---

## 📱 **Testing Workflow**

1. Make changes to code
2. Update API URL in `app.json` if needed
3. Update version numbers in `app.json`
4. Run: `eas build --platform android --profile preview`
5. Wait for build (~15 min)
6. Download APK
7. Install on phone
8. Test all features

---

## 🔗 **Useful Links**

- Expo Dashboard: https://expo.dev
- Your Builds: https://expo.dev/accounts/YOUR_USERNAME/projects/edunexus/builds
- EAS Build Docs: https://docs.expo.dev/build/setup/

---

## ✅ **Before Each Build - Checklist**

- [ ] Backend is running (or production URL set)
- [ ] API URL is correct in `app.json`
- [ ] Version number updated
- [ ] All changes committed to git (optional but recommended)
- [ ] Tested locally with `npm start`

---

## 📦 **After Build Completes**

You'll receive:
- ✅ Download link for APK
- ✅ QR code for easy sharing
- ✅ Build logs
- ✅ Build ID for tracking

**Install APK on phone and test!**
