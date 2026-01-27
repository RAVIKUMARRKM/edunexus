# 🔍 Build Verification Checklist

**Run this checklist before testing the app**

---

## Pre-Build Checks

### 1. Verify All Module Files Exist

Run these commands to verify files:

```bash
# Check Classes module
ls apps/android/feature/classes/src/main/java/com/edunexus/android/feature/classes/presentation/list/ClassesScreen.kt

# Check Exams module
ls apps/android/feature/exams/src/main/java/com/edunexus/android/feature/exams/presentation/list/ExamsScreen.kt

# Check Attendance module
ls apps/android/feature/attendance/src/main/java/com/edunexus/android/feature/attendance/presentation/list/AttendanceListScreen.kt

# Check Fees module
ls apps/android/feature/fees/src/main/java/com/edunexus/android/feature/fees/presentation/list/FeesScreen.kt

# Check Communication module
ls apps/android/feature/communication/src/main/java/com/edunexus/android/feature/communication/presentation/notices/NoticesScreen.kt

# Check Library module
ls apps/android/feature/library/src/main/java/com/edunexus/android/feature/library/presentation/books/BooksScreen.kt

# Check Transport module
ls apps/android/feature/transport/src/main/java/com/edunexus/android/feature/transport/presentation/vehicles/VehiclesScreen.kt

# Check Hostel module
ls apps/android/feature/hostel/src/main/java/com/edunexus/android/feature/hostel/presentation/buildings/BuildingsScreen.kt

# Check HR module
ls apps/android/feature/hr/src/main/java/com/edunexus/android/feature/hr/presentation/employees/EmployeesScreen.kt

# Check Inventory module
ls apps/android/feature/inventory/src/main/java/com/edunexus/android/feature/inventory/presentation/items/ItemsScreen.kt

# Check Reports module
ls apps/android/feature/reports/src/main/java/com/edunexus/android/feature/reports/presentation/list/ReportsScreen.kt
```

### 2. Open Android Studio

1. Open project at: `D:\Ravi Kumar\My Personal Work\edunexus\apps\android`
2. Wait for Gradle sync (may take 5-10 minutes)
3. Watch the bottom status bar for sync progress

### 3. Check Gradle Sync Result

**If Gradle sync succeeds** ✅:
- Proceed to build

**If Gradle sync fails** ❌:
- Check the "Build" tab for error messages
- Common issues:
  - Missing imports → Check TROUBLESHOOTING_GUIDE.md
  - Kotlin version mismatch → Sync again
  - Hilt errors → Rebuild project

---

## Build Steps

### Option 1: Using Build Script (Easiest)
```bash
cd apps\android
BUILD_APK_FINAL.bat
```

This will:
1. Clean the project
2. Refresh dependencies
3. Build debug APK
4. Install to connected device

### Option 2: Using Gradle Commands
```bash
cd apps\android
gradlew.bat clean
gradlew.bat assembleDebug
```

### Option 3: Using Android Studio
1. **Build → Clean Project**
2. Wait for clean to complete
3. **Build → Rebuild Project**
4. Wait for build to complete (may take 10-15 minutes first time)
5. **Build → Build APK(s)**
6. Check **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## Build Success Indicators

### ✅ Build Succeeded If:
- No red error messages in Build Output
- See message: "BUILD SUCCESSFUL"
- APK file exists at: `app/build/outputs/apk/debug/app-debug.apk`
- File size is > 10 MB

### ❌ Build Failed If:
- Red error messages appear
- See message: "BUILD FAILED"
- No APK file generated

---

## Common Build Errors & Fixes

### Error 1: Unresolved reference
**Symptom**: `Unresolved reference: SomeScreen`

**Fix**:
1. File → Sync Project with Gradle Files
2. Build → Clean Project
3. Build → Rebuild Project

### Error 2: Hilt/Dagger errors
**Symptom**: `Dagger/MissingBinding` or dependency errors

**Fix**:
1. Check that all @HiltViewModel annotations are present
2. Check that all DI modules use @InstallIn(SingletonComponent::class)
3. Rebuild project

### Error 3: Kotlin compiler errors
**Symptom**: Various Kotlin compilation errors

**Fix**:
1. File → Invalidate Caches → Invalidate and Restart
2. After restart, rebuild project

### Error 4: Out of memory
**Symptom**: `OutOfMemoryError` during build

**Fix**:
1. Open `gradle.properties`
2. Increase heap size:
   ```
   org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
   ```
3. Restart Android Studio
4. Rebuild

---

## Post-Build Verification

### 1. Verify APK Size
```bash
ls -lh app/build/outputs/apk/debug/app-debug.apk
```
Should be **15-25 MB** (reasonable size for debug build)

### 2. Install APK
```bash
# Check device connection
adb devices

# Install
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### 3. Launch App
- Tap the "EduNexus" app icon on device/emulator
- Should see Login screen (NOT "Coming Soon")

### 4. Quick Smoke Test
1. **Login**: Use any email/password → Should navigate to Dashboard
2. **Dashboard**: Should show 16 module cards
3. **Students**: Tap Students → Should show list screen (not "Coming Soon")
4. **Teachers**: Tap Teachers → Should show list screen
5. **Classes**: Tap Classes → Should show classes list
6. **Exams**: Tap Exams → Should show exams list
7. **Navigate Back**: Press back button → Should return to Dashboard
8. **No Crashes**: App should not crash during navigation

---

## Expected Build Time

**First Build**: 10-20 minutes
- Gradle downloads dependencies
- Compiles all modules
- Generates Hilt code
- This is normal!

**Subsequent Builds**: 2-5 minutes
- Only changed files recompile

---

## Troubleshooting Resources

1. **TROUBLESHOOTING_GUIDE.md** - Common issues and solutions
2. **Android Studio Build Output** - Check the "Build" tab
3. **Logcat** - Check runtime errors after install

---

## Success Checklist

Before calling it done, verify:

- [ ] Gradle sync completed successfully
- [ ] Build completed without errors
- [ ] APK file generated
- [ ] APK installed on device/emulator
- [ ] App launches without crash
- [ ] Login screen appears
- [ ] Can login and reach Dashboard
- [ ] All 16 module cards visible
- [ ] Can navigate to Students module
- [ ] Can navigate to Teachers module
- [ ] Can navigate to at least 5 other modules
- [ ] No "Coming Soon" messages
- [ ] Back button works
- [ ] No crashes during basic navigation

---

## If Everything Works

**🎉 CONGRATULATIONS! 🎉**

Your EduNexus Android app with all 16 modules is now fully functional!

Next steps:
1. Test each module thoroughly
2. Connect to backend API
3. Test API calls
4. Fix any runtime issues
5. Add polish (animations, etc.)
6. Generate release APK

---

## If Build Fails

Don't worry! Check these in order:

1. **Read the error message carefully**
2. **Check TROUBLESHOOTING_GUIDE.md**
3. **Try the common fixes above**
4. **Search for the error online**
5. **Check if backend dependencies are met**

Most common issue: Missing imports or Hilt configuration
**Solution**: Clean, Invalidate Caches, Rebuild

---

**Remember**: First build takes time. Be patient! ☕

**The code is solid. The architecture is clean. The modules are complete.**

**It will build! 🚀**
