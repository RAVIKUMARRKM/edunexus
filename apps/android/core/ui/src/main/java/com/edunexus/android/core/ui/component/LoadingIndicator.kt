package com.edunexus.android.core.ui.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Loading Indicator Component
 *
 * A reusable loading spinner with optional message.
 * Can be displayed as fullscreen or inline.
 *
 * @param modifier Modifier to be applied to the loading indicator
 * @param message Optional loading message to display below the spinner
 * @param color Color of the progress indicator
 * @param size Size of the circular progress indicator
 */
@Composable
fun LoadingIndicator(
    modifier: Modifier = Modifier,
    message: String? = null,
    color: Color = MaterialTheme.colorScheme.primary,
    size: Dp = 48.dp
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(16.dp)
        ) {
            CircularProgressIndicator(
                modifier = Modifier.size(size),
                color = color,
                strokeWidth = 4.dp
            )

            if (message != null) {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = message,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

/**
 * Inline Loading Indicator
 *
 * A smaller loading indicator for inline use (e.g., in buttons or lists).
 */
@Composable
fun InlineLoadingIndicator(
    modifier: Modifier = Modifier,
    color: Color = MaterialTheme.colorScheme.primary,
    size: Dp = 24.dp
) {
    CircularProgressIndicator(
        modifier = modifier.size(size),
        color = color,
        strokeWidth = 3.dp
    )
}

/**
 * Fullscreen Loading Indicator
 *
 * A fullscreen loading indicator with message.
 * Used for initial data loading or screen transitions.
 */
@Composable
fun FullscreenLoadingIndicator(
    message: String = "Loading...",
    color: Color = MaterialTheme.colorScheme.primary
) {
    LoadingIndicator(
        modifier = Modifier.fillMaxSize(),
        message = message,
        color = color,
        size = 56.dp
    )
}

/**
 * Card Loading Indicator
 *
 * A loading indicator designed to be displayed within a card.
 */
@Composable
fun CardLoadingIndicator(
    modifier: Modifier = Modifier,
    message: String? = "Loading...",
    color: Color = MaterialTheme.colorScheme.primary
) {
    Box(
        modifier = modifier.padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            CircularProgressIndicator(
                modifier = Modifier.size(40.dp),
                color = color,
                strokeWidth = 3.dp
            )

            if (message != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = message,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
