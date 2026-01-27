package com.edunexus.android.feature.hostel.presentation.buildings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.HostelBuildingDto
import com.edunexus.android.feature.hostel.data.repository.HostelRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Buildings Screen (MVI Pattern)
 */
@HiltViewModel
class BuildingsViewModel @Inject constructor(
    private val repository: HostelRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<BuildingsUiState>(BuildingsUiState.Loading)
    val uiState: StateFlow<BuildingsUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<BuildingsEffect>()
    val effect = _effect.asSharedFlow()

    private var allBuildings: List<HostelBuildingDto> = emptyList()
    private var currentSearch: String = ""

    init {
        loadBuildings()
    }

    fun handleIntent(intent: BuildingsIntent) {
        when (intent) {
            is BuildingsIntent.LoadBuildings -> loadBuildings()
            is BuildingsIntent.SearchBuildings -> searchBuildings(intent.query)
            is BuildingsIntent.RefreshBuildings -> refreshBuildings()
            is BuildingsIntent.NavigateToRooms -> navigateToRooms(intent.buildingId)
        }
    }

    private fun loadBuildings() {
        viewModelScope.launch {
            _uiState.value = BuildingsUiState.Loading

            repository.getBuildings().fold(
                onSuccess = { buildings ->
                    allBuildings = buildings
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = BuildingsUiState.Error(
                        error.message ?: "Failed to load buildings"
                    )
                }
            )
        }
    }

    private fun searchBuildings(query: String) {
        currentSearch = query
        applyFilters()
    }

    private fun applyFilters() {
        val filtered = if (currentSearch.isEmpty()) {
            allBuildings
        } else {
            allBuildings.filter { building ->
                building.name.contains(currentSearch, ignoreCase = true) ||
                        building.type.contains(currentSearch, ignoreCase = true) ||
                        (building.address?.contains(currentSearch, ignoreCase = true) == true)
            }
        }

        _uiState.value = if (filtered.isEmpty()) {
            BuildingsUiState.Empty(
                message = if (currentSearch.isNotEmpty()) {
                    "No buildings found for \"$currentSearch\""
                } else {
                    "No buildings available"
                }
            )
        } else {
            BuildingsUiState.Success(filtered)
        }
    }

    private fun refreshBuildings() {
        loadBuildings()
    }

    private fun navigateToRooms(buildingId: String) {
        viewModelScope.launch {
            _effect.emit(BuildingsEffect.NavigateToRooms(buildingId))
        }
    }
}

/**
 * UI State for Buildings Screen
 */
sealed class BuildingsUiState {
    object Loading : BuildingsUiState()
    data class Success(val buildings: List<HostelBuildingDto>) : BuildingsUiState()
    data class Empty(val message: String) : BuildingsUiState()
    data class Error(val message: String) : BuildingsUiState()
}

/**
 * User Intents for Buildings Screen
 */
sealed class BuildingsIntent {
    object LoadBuildings : BuildingsIntent()
    data class SearchBuildings(val query: String) : BuildingsIntent()
    object RefreshBuildings : BuildingsIntent()
    data class NavigateToRooms(val buildingId: String) : BuildingsIntent()
}

/**
 * Side Effects for Buildings Screen
 */
sealed class BuildingsEffect {
    data class NavigateToRooms(val buildingId: String) : BuildingsEffect()
    data class ShowToast(val message: String) : BuildingsEffect()
}
