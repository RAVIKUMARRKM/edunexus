package com.edunexus.android

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

/**
 * Application class for EduNexus.
 * Initializes Hilt for dependency injection and Timber for logging.
 */
@HiltAndroidApp
class EduNexusApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // Initialize Timber for logging
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
            Timber.d("EduNexus Application started in DEBUG mode")
        } else {
            // In production, you might want to use a custom tree that logs to analytics
            // For now, we'll just use a minimal tree that logs errors
            Timber.plant(object : Timber.Tree() {
                override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
                    // Only log errors and warnings in production
                    if (priority >= android.util.Log.WARN) {
                        // TODO: Send to crash reporting service (e.g., Firebase Crashlytics)
                    }
                }
            })
        }

        Timber.i("EduNexus Application initialized")
    }
}
