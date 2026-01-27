package com.edunexus.android.core.ui.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

/**
 * Empty State Component
 *
 * Displays a placeholder view when a list or content area is empty.
 * Includes an icon, title, description, and optional action button.
 *
 * @param title The main title to display
 * @param modifier Modifier to be applied to the empty state
 * @param description Optional description text to provide more context
 * @param icon Optional icon to display above the title
 * @param actionLabel Optional action button label
 * @param onActionClick Optional callback when action button is clicked
 */
@Composable
fun EmptyState(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    icon: ImageVector? = Icons.Default.Search,
    actionLabel: String? = null,
    onActionClick: (() -> Unit)? = null
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Icon
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Title
        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onSurface,
            textAlign = TextAlign.Center
        )

        // Description
        if (description != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }

        // Action Button
        if (actionLabel != null && onActionClick != null) {
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = onActionClick,
                modifier = Modifier
            ) {
                Text(text = actionLabel)
            }
        }
    }
}

/**
 * No Results Empty State
 *
 * A specialized empty state for search or filter results.
 */
@Composable
fun NoResultsEmptyState(
    query: String,
    modifier: Modifier = Modifier,
    onClearSearch: (() -> Unit)? = null
) {
    EmptyState(
        title = "No results found",
        description = "We couldn't find any matches for \"$query\".\nTry adjusting your search or filters.",
        icon = Icons.Default.Search,
        actionLabel = if (onClearSearch != null) "Clear Search" else null,
        onActionClick = onClearSearch,
        modifier = modifier
    )
}

/**
 * No Data Empty State
 *
 * A specialized empty state for empty lists or data sets.
 */
@Composable
fun NoDataEmptyState(
    title: String,
    description: String,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    actionLabel: String? = null,
    onActionClick: (() -> Unit)? = null
) {
    EmptyState(
        title = title,
        description = description,
        icon = icon,
        actionLabel = actionLabel,
        onActionClick = onActionClick,
        modifier = modifier
    )
}
