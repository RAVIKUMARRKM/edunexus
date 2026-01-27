package com.edunexus.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.compose.rememberNavController
import com.edunexus.android.navigation.MainScaffold
import com.edunexus.android.navigation.NavGraph
import com.edunexus.android.navigation.Routes
import com.edunexus.android.core.ui.theme.EduNexusTheme
import androidx.navigation.compose.currentBackStackEntryAsState
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.delay
import timber.log.Timber

/**
 * Main activity for the EduNexus app.
 * Single activity architecture using Jetpack Compose and Navigation.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Install splash screen
        var keepSplashScreen = true
        installSplashScreen().setKeepOnScreenCondition { keepSplashScreen }

        Timber.d("MainActivity onCreate")

        setContent {
            // Simulate auth check during splash screen
            var isCheckingAuth by remember { mutableStateOf(true) }
            var isAuthenticated by remember { mutableStateOf(false) }

            // Check authentication state
            LaunchedEffect(Unit) {
                Timber.d("Checking authentication state...")
                // TODO: Check actual auth token from DataStore when auth module is ready
                delay(1500) // Simulate loading time

                // For now, simulate no auth token (always go to login)
                isAuthenticated = false
                isCheckingAuth = false
                keepSplashScreen = false

                Timber.d("Auth check complete. Authenticated: $isAuthenticated")
            }

            EduNexusTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    if (!isCheckingAuth) {
                        MainApp(isAuthenticated = isAuthenticated)
                    }
                }
            }
        }
    }
}

/**
 * Main app composable.
 * Handles navigation and determines the start destination based on auth state.
 */
@Composable
fun MainApp(isAuthenticated: Boolean) {
    val navController = rememberNavController()
    val startDestination = if (isAuthenticated) Routes.DASHBOARD else Routes.LOGIN

    Timber.d("MainApp started with destination: $startDestination")

    // Check if current route is one of the main bottom nav routes
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val isMainRoute = currentRoute in listOf(
        Routes.DASHBOARD,
        Routes.ATTENDANCE,
        Routes.EXAMS,
        Routes.FEES,
        Routes.PROFILE
    )

    if (isMainRoute) {
        // Show MainScaffold with bottom navigation for main routes
        MainScaffold(
            navController = navController,
            onAiAssistantClick = {
                // TODO: Implement AI Assistant when ready
                Timber.d("AI Assistant clicked")
            }
        ) { modifier ->
            NavGraph(
                navController = navController,
                startDestination = startDestination,
                modifier = modifier
            )
        }
    } else {
        // Show full screen without bottom navigation for auth and other screens
        NavGraph(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.fillMaxSize()
        )
    }
}
