package com.edunexus.android.feature.transport.presentation.vehicles

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.VehicleDto
import com.edunexus.android.feature.transport.data.repository.TransportRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Vehicles List Screen (MVI Pattern)
 */
@HiltViewModel
class VehiclesViewModel @Inject constructor(
    private val repository: TransportRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<VehiclesUiState>(VehiclesUiState.Loading)
    val uiState: StateFlow<VehiclesUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<VehiclesEffect>()
    val effect = _effect.asSharedFlow()

    private var allVehicles: List<VehicleDto> = emptyList()
    private var currentStatus: String? = null
    private var currentType: String? = null
    private var currentSearch: String = ""

    init {
        loadVehicles()
    }

    fun handleIntent(intent: VehiclesIntent) {
        when (intent) {
            is VehiclesIntent.LoadVehicles -> loadVehicles()
            is VehiclesIntent.SearchVehicles -> searchVehicles(intent.query)
            is VehiclesIntent.FilterByStatus -> filterByStatus(intent.status)
            is VehiclesIntent.FilterByType -> filterByType(intent.type)
            is VehiclesIntent.RefreshVehicles -> refreshVehicles()
            is VehiclesIntent.NavigateToDetail -> navigateToDetail(intent.vehicleId)
        }
    }

    private fun loadVehicles() {
        viewModelScope.launch {
            _uiState.value = VehiclesUiState.Loading

            repository.getVehicles(
                status = currentStatus,
                type = currentType
            ).fold(
                onSuccess = { vehicles ->
                    allVehicles = vehicles
                    val filteredVehicles = if (currentSearch.isNotEmpty()) {
                        vehicles.filter { vehicle ->
                            vehicle.vehicleNumber.contains(currentSearch, ignoreCase = true) ||
                            vehicle.model?.contains(currentSearch, ignoreCase = true) == true ||
                            vehicle.type.contains(currentSearch, ignoreCase = true)
                        }
                    } else {
                        vehicles
                    }

                    _uiState.value = if (filteredVehicles.isEmpty()) {
                        VehiclesUiState.Empty(
                            message = if (currentSearch.isNotEmpty()) {
                                "No vehicles found for \"$currentSearch\""
                            } else if (currentStatus != null || currentType != null) {
                                "No vehicles found with selected filters"
                            } else {
                                "No vehicles added yet"
                            }
                        )
                    } else {
                        VehiclesUiState.Success(filteredVehicles)
                    }
                },
                onFailure = { error ->
                    _uiState.value = VehiclesUiState.Error(
                        error.message ?: "Failed to load vehicles"
                    )
                }
            )
        }
    }

    private fun searchVehicles(query: String) {
        currentSearch = query
        loadVehicles()
    }

    private fun filterByStatus(status: String?) {
        currentStatus = status
        loadVehicles()
    }

    private fun filterByType(type: String?) {
        currentType = type
        loadVehicles()
    }

    private fun refreshVehicles() {
        loadVehicles()
    }

    private fun navigateToDetail(vehicleId: String) {
        viewModelScope.launch {
            _effect.emit(VehiclesEffect.NavigateToDetail(vehicleId))
        }
    }
}

/**
 * UI State for Vehicles List
 */
sealed class VehiclesUiState {
    object Loading : VehiclesUiState()
    data class Success(val vehicles: List<VehicleDto>) : VehiclesUiState()
    data class Empty(val message: String) : VehiclesUiState()
    data class Error(val message: String) : VehiclesUiState()
}

/**
 * User Intents for Vehicles List
 */
sealed class VehiclesIntent {
    object LoadVehicles : VehiclesIntent()
    data class SearchVehicles(val query: String) : VehiclesIntent()
    data class FilterByStatus(val status: String?) : VehiclesIntent()
    data class FilterByType(val type: String?) : VehiclesIntent()
    object RefreshVehicles : VehiclesIntent()
    data class NavigateToDetail(val vehicleId: String) : VehiclesIntent()
}

/**
 * Side Effects for Vehicles List
 */
sealed class VehiclesEffect {
    data class NavigateToDetail(val vehicleId: String) : VehiclesEffect()
    data class ShowToast(val message: String) : VehiclesEffect()
}
