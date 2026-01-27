package com.edunexus.android.core.ui.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp

/**
 * Dashboard Stat Card Component
 *
 * A card component for displaying statistics on the dashboard.
 * Shows a title, value, optional icon, and optional trend indicator.
 *
 * @param title The stat title (e.g., "Total Students")
 * @param value The stat value to display
 * @param modifier Modifier to be applied to the card
 * @param icon Optional icon to display
 * @param iconTint Optional tint color for the icon
 * @param trend Optional trend indicator (positive/negative percentage)
 * @param trendDirection Direction of the trend (up/down)
 * @param onClick Optional click handler to make the card clickable
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StatCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    iconTint: Color = MaterialTheme.colorScheme.primary,
    trend: String? = null,
    trendDirection: TrendDirection = TrendDirection.UP,
    onClick: (() -> Unit)? = null
) {
    val cardModifier = modifier.fillMaxWidth()

    if (onClick != null) {
        Card(
            onClick = onClick,
            modifier = cardModifier,
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = MaterialTheme.colorScheme.onSurface
            ),
            elevation = CardDefaults.cardElevation(
                defaultElevation = 2.dp
            ),
            shape = MaterialTheme.shapes.medium
        ) {
            StatCardContent(
                title = title,
                value = value,
                icon = icon,
                iconTint = iconTint,
                trend = trend,
                trendDirection = trendDirection
            )
        }
    } else {
        Card(
            modifier = cardModifier,
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = MaterialTheme.colorScheme.onSurface
            ),
            elevation = CardDefaults.cardElevation(
                defaultElevation = 2.dp
            ),
            shape = MaterialTheme.shapes.medium
        ) {
            StatCardContent(
                title = title,
                value = value,
                icon = icon,
                iconTint = iconTint,
                trend = trend,
                trendDirection = trendDirection
            )
        }
    }
}

@Composable
private fun StatCardContent(
    title: String,
    value: String,
    icon: ImageVector?,
    iconTint: Color,
    trend: String?,
    trendDirection: TrendDirection
) {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        // Header with icon and title
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp),
                    tint = iconTint
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Value
        Text(
            text = value,
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onSurface
        )

        // Trend indicator
        if (trend != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (trendDirection == TrendDirection.UP) {
                        Icons.Default.TrendingUp
                    } else {
                        Icons.Default.TrendingDown
                    },
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = if (trendDirection == TrendDirection.UP) {
                        Color(0xFF10B981) // Green-500
                    } else {
                        Color(0xFFEF4444) // Red-500
                    }
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = trend,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (trendDirection == TrendDirection.UP) {
                        Color(0xFF10B981) // Green-500
                    } else {
                        Color(0xFFEF4444) // Red-500
                    }
                )
            }
        }
    }
}

/**
 * Trend Direction Enum
 */
enum class TrendDirection {
    UP,
    DOWN
}
