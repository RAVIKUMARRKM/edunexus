package com.edunexus.android.feature.inventory.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Inventory
import androidx.compose.material.icons.outlined.Category
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.edunexus.android.core.network.dto.InventoryItemDto
import com.edunexus.android.core.network.dto.StockStatus

@Composable
fun ItemCard(
    item: InventoryItemDto,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth().clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                ItemIcon(stockStatus = item.stockStatus, size = 56.dp)
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = item.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.Category, null, Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(item.itemCode + " - " + item.category, style = MaterialTheme.typography.bodyMedium)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.Inventory2, null, Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(item.quantity.toString() + " " + item.unit, fontWeight = FontWeight.Medium)
                        Spacer(Modifier.width(8.dp))
                        StockStatusBadge(item.stockStatus)
                    }
                }
            }
            Icon(Icons.Default.ChevronRight, "View details")
        }
    }
}

@Composable
fun ItemIcon(stockStatus: StockStatus, size: androidx.compose.ui.unit.Dp = 48.dp, modifier: Modifier = Modifier) {
    val bg = when (stockStatus) {
        StockStatus.IN_STOCK -> MaterialTheme.colorScheme.primaryContainer
        StockStatus.LOW_STOCK -> MaterialTheme.colorScheme.tertiaryContainer
        StockStatus.OUT_OF_STOCK -> MaterialTheme.colorScheme.errorContainer
    }
    Box(modifier.size(size).clip(CircleShape).background(bg), Alignment.Center) {
        Icon(Icons.Default.Inventory, null, Modifier.size(size / 2))
    }
}

@Composable
fun StockStatusBadge(stockStatus: StockStatus, modifier: Modifier = Modifier) {
    val label = when (stockStatus) {
        StockStatus.IN_STOCK -> "In Stock"
        StockStatus.LOW_STOCK -> "Low Stock"
        StockStatus.OUT_OF_STOCK -> "Out of Stock"
    }
    Box(modifier.background(MaterialTheme.colorScheme.primaryContainer, MaterialTheme.shapes.small).padding(horizontal = 8.dp, vertical = 4.dp)) {
        Text(label, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Medium)
    }
}
