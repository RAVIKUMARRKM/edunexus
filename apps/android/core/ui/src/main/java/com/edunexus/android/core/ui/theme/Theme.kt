package com.edunexus.android.core.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

/**
 * EduNexus Light Color Scheme
 * Based on Material 3 with Indigo-600 primary color
 */
private val LightColorScheme = lightColorScheme(
    primary = Indigo600,
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Indigo100,
    onPrimaryContainer = Indigo700,

    secondary = Indigo400,
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Indigo50,
    onSecondaryContainer = Indigo700,

    tertiary = Amber500,
    onTertiary = Color(0xFFFFFFFF),
    tertiaryContainer = Amber100,
    onTertiaryContainer = Amber600,

    error = Red500,
    onError = Color(0xFFFFFFFF),
    errorContainer = Red100,
    onErrorContainer = Red600,

    background = BackgroundLight,
    onBackground = TextPrimaryLight,

    surface = SurfaceLight,
    onSurface = TextPrimaryLight,
    surfaceVariant = Gray100,
    onSurfaceVariant = TextSecondaryLight,

    outline = Gray300,
    outlineVariant = Gray200,

    scrim = Color(0x80000000),

    inverseSurface = Gray800,
    inverseOnSurface = Gray50,
    inversePrimary = Indigo300,

    surfaceTint = Indigo600
)

/**
 * EduNexus Dark Color Scheme
 * Based on Material 3 with Indigo-600 primary color
 */
private val DarkColorScheme = darkColorScheme(
    primary = Indigo400,
    onPrimary = Indigo900,
    primaryContainer = Indigo700,
    onPrimaryContainer = Indigo100,

    secondary = Indigo300,
    onSecondary = Indigo800,
    secondaryContainer = Indigo700,
    onSecondaryContainer = Indigo100,

    tertiary = Amber400,
    onTertiary = Amber900,
    tertiaryContainer = Amber600,
    onTertiaryContainer = Amber100,

    error = Red400,
    onError = Red900,
    errorContainer = Red600,
    onErrorContainer = Red100,

    background = BackgroundDark,
    onBackground = TextPrimaryDark,

    surface = SurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = Gray700,
    onSurfaceVariant = TextSecondaryDark,

    outline = Gray600,
    outlineVariant = Gray700,

    scrim = Color(0x80000000),

    inverseSurface = Gray100,
    inverseOnSurface = Gray800,
    inversePrimary = Indigo600,

    surfaceTint = Indigo400
)

/**
 * EduNexus Theme Composable
 *
 * @param darkTheme Whether to use dark theme colors
 * @param dynamicColor Whether to use dynamic colors from Android 12+ (Material You)
 * @param content The composable content to wrap with the theme
 */
@Composable
fun EduNexusTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = EduNexusTypography,
        content = content
    )
}
