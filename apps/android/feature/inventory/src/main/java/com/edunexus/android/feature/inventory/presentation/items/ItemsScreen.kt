package com.edunexus.android.feature.inventory.presentation.items

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.feature.inventory.presentation.components.ItemCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemsScreen(
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ItemsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is ItemsEffect.NavigateToDetail -> onNavigateToDetail(effect.itemId)
                is ItemsEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Inventory") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(ItemsIntent.RefreshItems) }) {
                        Icon(Icons.Default.Refresh, "Refresh")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { paddingValues ->
        Column(modifier = Modifier.fillMaxSize().padding(paddingValues)) {
            SearchBar(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    viewModel.handleIntent(ItemsIntent.SearchItems(it))
                },
                placeholder = "Search items...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            if (uiState is ItemsUiState.Success) {
                val currentFilter = (uiState as ItemsUiState.Success).currentFilter
                LazyRow(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(StockFilter.values()) { filter ->
                        FilterChip(
                            selected = filter == currentFilter,
                            onClick = { viewModel.handleIntent(ItemsIntent.FilterByStock(filter)) },
                            label = { Text(getFilterLabel(filter)) }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is ItemsUiState.Loading -> {
                        Box(Modifier.fillMaxSize(), Alignment.Center) {
                            CircularProgressIndicator()
                        }
                    }
                    is ItemsUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items = state.items, key = { it.id }) { item ->
                                ItemCard(
                                    item = item,
                                    onClick = {
                                        viewModel.handleIntent(ItemsIntent.NavigateToDetail(item.id))
                                    }
                                )
                            }
                        }
                    }
                    is ItemsUiState.Empty -> {
                        EmptyState(
                            title = "No Items Found",
                            description = state.message,
                            icon = Icons.Default.Inventory,
                            actionLabel = null,
                            onActionClick = null
                        )
                    }
                    is ItemsUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = { viewModel.handleIntent(ItemsIntent.RefreshItems) }
                        )
                    }
                }
            }
        }
    }
}

private fun getFilterLabel(filter: StockFilter): String {
    return when (filter) {
        StockFilter.ALL -> "All"
        StockFilter.IN_STOCK -> "In Stock"
        StockFilter.LOW_STOCK -> "Low Stock"
        StockFilter.OUT_OF_STOCK -> "Out of Stock"
    }
}
