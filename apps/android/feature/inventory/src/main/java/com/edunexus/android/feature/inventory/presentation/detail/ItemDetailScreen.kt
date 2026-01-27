package com.edunexus.android.feature.inventory.presentation.detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.edunexus.android.core.network.dto.InventoryItemDto
import com.edunexus.android.core.network.dto.StockStatus
import com.edunexus.android.feature.inventory.presentation.components.ItemIcon
import com.edunexus.android.feature.inventory.presentation.components.StockStatusBadge
import java.time.format.DateTimeFormatter
import java.time.LocalDateTime

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemDetailScreen(
    item: InventoryItemDto,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Item Details") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.primaryContainer)
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    ItemIcon(stockStatus = item.stockStatus, size = 80.dp)
                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = item.name,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(Modifier.height(8.dp))
                    StockStatusBadge(item.stockStatus)
                }
            }

            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                DetailCard(title = "Basic Information") {
                    DetailRow("Item Code", item.itemCode)
                    DetailRow("Category", item.category)
                    DetailRow("Unit", item.unit)
                    item.description?.let { DetailRow("Description", it) }
                }

                DetailCard(title = "Stock Information") {
                    DetailRow("Current Stock", item.quantity.toString() + " " + item.unit)
                    DetailRow("Min Stock Level", item.minStockLevel.toString() + " " + item.unit)
                    item.maxStockLevel?.let { DetailRow("Max Stock Level", it.toString() + " " + item.unit) }
                    DetailRow("Stock Status", getStockStatusText(item.stockStatus))
                }

                DetailCard(title = "Pricing") {
                    DetailRow("Unit Price", "Rs " + String.format("%.2f", item.unitPrice))
                    DetailRow("Total Value", "Rs " + String.format("%.2f", item.totalValue))
                }

                DetailCard(title = "Additional Details") {
                    item.supplier?.let { DetailRow("Supplier", it) }
                    item.location?.let { DetailRow("Location", it) }
                    item.lastRestockDate?.let { DetailRow("Last Restock", it) }
                }
            }
        }
    }
}

@Composable
private fun DetailCard(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
private fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}

private fun getStockStatusText(status: StockStatus): String {
    return when (status) {
        StockStatus.IN_STOCK -> "In Stock"
        StockStatus.LOW_STOCK -> "Low Stock"
        StockStatus.OUT_OF_STOCK -> "Out of Stock"
    }
}
