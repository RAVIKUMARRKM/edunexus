# 🔧 EduNexus Android - Troubleshooting Guide

## Common Build Errors & Solutions

### 1. CLEARTEXT Communication Error
**Error**: `CLEARTEXT communication to 10.0.2.2 not permitted by network security policy`

**Solution**: ✅ Already Fixed!
- File: `app/src/main/res/xml/network_security_config.xml` created
- AndroidManifest.xml updated with network security config

**Manual Fix** (if needed):
```xml
<!-- In AndroidManifest.xml -->
<application
    android:networkSecurityConfig="@xml/network_security_config"
    android:usesCleartextTraffic="true">
```

---

### 2. Unresolved Reference Errors
**Error**: `Unresolved reference: SomeScreen`

**Solutions**:
1. **Check Import Path**:
   ```kotlin
   // ✅ Correct
   import com.edunexus.android.feature.students.presentation.list.StudentsScreen

   // ❌ Wrong
   import com.edunexus.android.feature.students.StudentsScreen
   ```

2. **Sync Gradle**:
   ```bash
   File → Sync Project with Gradle Files
   ```

3. **Invalidate Caches**:
   ```bash
   File → Invalidate Caches → Invalidate and Restart
   ```

---

### 3. Hilt Errors
**Error**: `Dagger/MissingBinding` or `cannot be provided without an @Provides`

**Solutions**:
1. **Check Module is Installed**:
   ```kotlin
   @Module
   @InstallIn(SingletonComponent::class)
   object YourModule {
       // ...
   }
   ```

2. **Check ViewModel Annotation**:
   ```kotlin
   @HiltViewModel
   class YourViewModel @Inject constructor() : ViewModel()
   ```

3. **Rebuild Project**:
   ```bash
   Build → Clean Project
   Build → Rebuild Project
   ```

---

### 4. Circular Dependency
**Error**: `Circular dependency between tasks`

**Solution**: ✅ Already Fixed!
- TokenProvider moved to `core:common` module
- Both `core:network` and `core:datastore` depend on `core:common`

**If it happens again**:
- Check `build.gradle.kts` dependencies
- Make sure no module depends on itself
- Use interface in common module pattern

---

### 5. Coroutine Errors
**Error**: `Suspend function can only be called from a coroutine` or `Unresolved reference: launch`

**Solution**:
```kotlin
// ✅ Correct
val coroutineScope = rememberCoroutineScope()

Button(onClick = {
    coroutineScope.launch {
        delay(1000)
        // do something
    }
})

// ❌ Wrong
Button(onClick = {
    GlobalScope.launch { // Don't use GlobalScope!
        // ...
    }
})
```

---

### 6. Smart Cast Errors
**Error**: `Smart cast to 'String' is impossible`

**Solution**:
```kotlin
// ✅ Correct
uiState.error?.let { errorMessage ->
    Text(errorMessage)
}

// ❌ Wrong
if (uiState.error != null) {
    Text(uiState.error) // Smart cast error
}
```

---

### 7. Compose BOM Version Mismatch
**Error**: Various Compose-related errors

**Solution**: Make sure all modules use same BOM version:
```kotlin
implementation(platform("androidx.compose:compose-bom:2024.02.00"))
```

---

### 8. API Connection Issues

#### 8a. Cannot connect to API
**Symptoms**: Network timeout, connection refused

**Solutions**:
1. **Check Backend is Running**:
   ```bash
   # On your PC, make sure backend is running on port 3000
   npm run dev
   ```

2. **Check API URL in BuildConfig**:
   ```kotlin
   // core/network/build.gradle.kts
   buildConfigField("String", "API_URL", "\"http://10.0.2.2:3000/api/\"")

   // 10.0.2.2 = localhost for Android Emulator
   // For physical device, use your PC's IP: "http://192.168.x.x:3000/api/"
   ```

3. **Check Firewall**:
   - Allow port 3000 in Windows Firewall
   - Backend should listen on 0.0.0.0, not 127.0.0.1

#### 8b. 401 Unauthorized Errors
**Cause**: Token expired or invalid

**Solution**:
- Logout and login again
- Token is stored in DataStore and cleared on 401

---

### 9. APK Build Fails

#### 9a. Java Version Error
**Error**: `Java version X is not supported`

**Solution**:
```bash
File → Settings → Build, Execution, Deployment → Build Tools → Gradle
→ Gradle JDK: Select "jbr-17" or "JDK 17"
```

#### 9b. Out of Memory
**Error**: `OutOfMemoryError` during build

**Solution**: Increase heap size in `gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

#### 9c. Lint Errors Blocking Build
**Solution**: Disable lint checks for now:
```kotlin
// app/build.gradle.kts
android {
    lint {
        abortOnError = false
    }
}
```

---

### 10. Runtime Crashes

#### 10a. App Crashes on Launch
**Check**:
1. Logcat for error message
2. Make sure Hilt is properly initialized in Application class
3. Check AndroidManifest.xml has correct application name

#### 10b. Crash on Navigation
**Check**:
1. Make sure all routes are defined in NavGraph
2. Verify screen composables don't have runtime errors
3. Check SavedStateHandle parameters match route arguments

#### 10c. Crash on API Call
**Check**:
1. Network security config is set
2. Backend is running and accessible
3. Retrofit interfaces match backend endpoints
4. DTOs can deserialize API responses

---

## Build Commands Reference

### Clean Build
```bash
cd apps/android
./gradlew.bat clean
./gradlew.bat assembleDebug
```

### Quick Rebuild
```bash
./gradlew.bat --refresh-dependencies
./gradlew.bat assembleDebug
```

### Install APK
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Check Connected Devices
```bash
adb devices
```

### View Logs
```bash
adb logcat | grep -i edunexus
```

---

## Module-Specific Issues

### Students/Teachers Module
- **Issue**: List not loading
- **Check**: Repository is injected via Hilt
- **Check**: API endpoint returns valid data
- **Check**: DTO to Domain mapping is correct

### Dashboard Module
- **Issue**: Stats showing 0
- **Check**: API returns dashboard stats
- **Check**: Backend is seeded with test data

### Profile/Settings Module
- **Issue**: Profile not loading
- **Check**: Token is saved in DataStore
- **Check**: User ID is available

---

## Quick Fixes Checklist

When something breaks:
1. ☐ File → Sync Project with Gradle Files
2. ☐ Build → Clean Project
3. ☐ Build → Rebuild Project
4. ☐ File → Invalidate Caches → Restart
5. ☐ Check imports are correct
6. ☐ Check Hilt annotations present
7. ☐ Check backend is running
8. ☐ Check network security config
9. ☐ Check logcat for errors
10. ☐ Try on different device/emulator

---

## Getting Help

### Check Documentation
- `/apps/android/OVERNIGHT_WORK_SUMMARY.md` - What was implemented
- `/apps/android/NAVGRAPH_INTEGRATION_PLAN.md` - Navigation structure
- `/apps/android/BUILD_APK_FINAL.bat` - Build script

### Debugging Tips
1. **Enable verbose logging**:
   ```kotlin
   Timber.plant(Timber.DebugTree())
   ```

2. **Check network calls**:
   - OkHttp logging interceptor is enabled in DEBUG builds
   - Check logcat for HTTP requests/responses

3. **Check Hilt graph**:
   - Rebuild project to regenerate Hilt code
   - Check generated files in `build/generated/hilt/`

---

## Emergency Reset

If everything breaks:
```bash
# 1. Stop Gradle
./gradlew.bat --stop

# 2. Clean everything
rm -rf .gradle build */build

# 3. Sync and rebuild
./gradlew.bat --refresh-dependencies
./gradlew.bat clean build
```

---

**Last Updated**: 2026-01-28
**Version**: 1.0.0
