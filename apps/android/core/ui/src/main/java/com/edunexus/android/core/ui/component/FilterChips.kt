package com.edunexus.android.core.ui.component

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.material3.ExperimentalMaterial3Api

/**
 * Filter Chip Item
 *
 * Data class representing a single filter chip
 */
data class FilterChipItem(
    val id: String,
    val label: String,
    val selected: Boolean = false
)

/**
 * Filter Chips Row Component
 *
 * A horizontally scrollable row of filter chips.
 * Used for filtering lists and content by categories.
 *
 * @param chips List of filter chip items to display
 * @param onChipSelected Callback when a chip is selected/deselected
 * @param modifier Modifier to be applied to the chips row
 * @param multiSelect Whether multiple chips can be selected (default: true)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilterChips(
    chips: List<FilterChipItem>,
    onChipSelected: (FilterChipItem) -> Unit,
    modifier: Modifier = Modifier,
    multiSelect: Boolean = true
) {
    Row(
        modifier = modifier
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        chips.forEach { chip ->
            FilterChip(
                selected = chip.selected,
                onClick = { onChipSelected(chip) },
                label = {
                    Text(
                        text = chip.label,
                        style = MaterialTheme.typography.labelLarge
                    )
                },
                leadingIcon = if (chip.selected) {
                    {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Selected",
                            modifier = Modifier.padding(end = 4.dp)
                        )
                    }
                } else null,
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                    selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    selectedLeadingIconColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    containerColor = MaterialTheme.colorScheme.surface,
                    labelColor = MaterialTheme.colorScheme.onSurface,
                    iconColor = MaterialTheme.colorScheme.onSurface
                )
            )
        }
    }
}

/**
 * Single Select Filter Chips
 *
 * A convenience wrapper for single selection filter chips.
 * Only one chip can be selected at a time.
 */
@Composable
fun SingleSelectFilterChips(
    chips: List<FilterChipItem>,
    selectedId: String?,
    onChipSelected: (FilterChipItem) -> Unit,
    modifier: Modifier = Modifier
) {
    val chipItems = chips.map { chip ->
        chip.copy(selected = chip.id == selectedId)
    }

    FilterChips(
        chips = chipItems,
        onChipSelected = onChipSelected,
        modifier = modifier,
        multiSelect = false
    )
}
