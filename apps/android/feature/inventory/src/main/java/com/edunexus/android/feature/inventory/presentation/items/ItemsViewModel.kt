package com.edunexus.android.feature.inventory.presentation.items

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.InventoryItemDto
import com.edunexus.android.core.network.dto.StockStatus
import com.edunexus.android.feature.inventory.data.repository.InventoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ItemsViewModel @Inject constructor(
    private val repository: InventoryRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<ItemsUiState>(ItemsUiState.Loading)
    val uiState: StateFlow<ItemsUiState> = _uiState.asStateFlow()
    private val _effect = MutableSharedFlow<ItemsEffect>()
    val effect = _effect.asSharedFlow()
    private var allItems: List<InventoryItemDto> = emptyList()
    private var currentSearch: String = ""
    private var currentFilter: StockFilter = StockFilter.ALL
    init { loadItems() }
    fun handleIntent(intent: ItemsIntent) {
        when (intent) {
            is ItemsIntent.LoadItems -> loadItems()
            is ItemsIntent.SearchItems -> searchItems(intent.query)
            is ItemsIntent.FilterByStock -> filterByStock(intent.filter)
            is ItemsIntent.RefreshItems -> refreshItems()
            is ItemsIntent.NavigateToDetail -> navigateToDetail(intent.itemId)
        }
    }
    private fun loadItems() {
        viewModelScope.launch {
            _uiState.value = ItemsUiState.Loading
            repository.getItems().fold(
                onSuccess = { items ->
                    allItems = items
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = ItemsUiState.Error(error.message ?: "Failed to load items")
                }
            )
        }
    }
    private fun searchItems(query: String) { currentSearch = query; applyFilters() }
    private fun filterByStock(filter: StockFilter) { currentFilter = filter; applyFilters() }
    private fun applyFilters() {
        var filtered = allItems
        if (currentSearch.isNotEmpty()) {
            filtered = filtered.filter { item ->
                item.name.contains(currentSearch, ignoreCase = true) ||
                item.itemCode.contains(currentSearch, ignoreCase = true) ||
                item.category.contains(currentSearch, ignoreCase = true)
            }
        }
        filtered = when (currentFilter) {
            StockFilter.ALL -> filtered
            StockFilter.IN_STOCK -> filtered.filter { it.stockStatus == StockStatus.IN_STOCK }
            StockFilter.LOW_STOCK -> filtered.filter { it.stockStatus == StockStatus.LOW_STOCK }
            StockFilter.OUT_OF_STOCK -> filtered.filter { it.stockStatus == StockStatus.OUT_OF_STOCK }
        }
        _uiState.value = if (filtered.isEmpty()) {
            ItemsUiState.Empty(message = if (currentSearch.isNotEmpty() || currentFilter \!= StockFilter.ALL) "No items found" else "No inventory items available")
        } else { ItemsUiState.Success(filtered, currentFilter) }
    }
    private fun refreshItems() { loadItems() }
    private fun navigateToDetail(itemId: String) { viewModelScope.launch { _effect.emit(ItemsEffect.NavigateToDetail(itemId)) } }
}

sealed class ItemsUiState {
    object Loading : ItemsUiState()
    data class Success(val items: List<InventoryItemDto>, val currentFilter: StockFilter) : ItemsUiState()
    data class Empty(val message: String) : ItemsUiState()
    data class Error(val message: String) : ItemsUiState()
}

sealed class ItemsIntent {
    object LoadItems : ItemsIntent()
    data class SearchItems(val query: String) : ItemsIntent()
    data class FilterByStock(val filter: StockFilter) : ItemsIntent()
    object RefreshItems : ItemsIntent()
    data class NavigateToDetail(val itemId: String) : ItemsIntent()
}

sealed class ItemsEffect {
    data class NavigateToDetail(val itemId: String) : ItemsEffect()
    data class ShowToast(val message: String) : ItemsEffect()
}

enum class StockFilter { ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK }
