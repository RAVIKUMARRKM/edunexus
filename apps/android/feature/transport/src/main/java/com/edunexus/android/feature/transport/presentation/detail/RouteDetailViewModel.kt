package com.edunexus.android.feature.transport.presentation.detail

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.TransportAllocationDto
import com.edunexus.android.core.network.dto.TransportRouteDto
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
 * ViewModel for Route Detail Screen (MVI Pattern)
 */
@HiltViewModel
class RouteDetailViewModel @Inject constructor(
    private val repository: TransportRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val routeId: String = savedStateHandle.get<String>("routeId")
        ?: throw IllegalArgumentException("Route ID is required")

    private val _uiState = MutableStateFlow<RouteDetailUiState>(RouteDetailUiState.Loading)
    val uiState: StateFlow<RouteDetailUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<RouteDetailEffect>()
    val effect = _effect.asSharedFlow()

    init {
        loadRouteDetails()
    }

    fun handleIntent(intent: RouteDetailIntent) {
        when (intent) {
            is RouteDetailIntent.LoadRouteDetails -> loadRouteDetails()
            is RouteDetailIntent.RefreshDetails -> loadRouteDetails()
            is RouteDetailIntent.NavigateBack -> navigateBack()
        }
    }

    private fun loadRouteDetails() {
        viewModelScope.launch {
            _uiState.value = RouteDetailUiState.Loading

            // Load route details
            val routeResult = repository.getTransportRoute(routeId)

            routeResult.fold(
                onSuccess = { route ->
                    // Load allocations (student assignments) for this route
                    repository.getTransportAllocations(routeId = routeId).fold(
                        onSuccess = { allocations ->
                            _uiState.value = RouteDetailUiState.Success(
                                route = route,
                                allocations = allocations
                            )
                        },
                        onFailure = { error ->
                            // Still show route even if allocations fail
                            _uiState.value = RouteDetailUiState.Success(
                                route = route,
                                allocations = emptyList()
                            )
                            _effect.emit(
                                RouteDetailEffect.ShowToast(
                                    "Failed to load student assignments: ${error.message}"
                                )
                            )
                        }
                    )
                },
                onFailure = { error ->
                    _uiState.value = RouteDetailUiState.Error(
                        error.message ?: "Failed to load route details"
                    )
                }
            )
        }
    }

    private fun navigateBack() {
        viewModelScope.launch {
            _effect.emit(RouteDetailEffect.NavigateBack)
        }
    }
}

/**
 * UI State for Route Detail
 */
sealed class RouteDetailUiState {
    object Loading : RouteDetailUiState()
    data class Success(
        val route: TransportRouteDto,
        val allocations: List<TransportAllocationDto>
    ) : RouteDetailUiState()
    data class Error(val message: String) : RouteDetailUiState()
}

/**
 * User Intents for Route Detail
 */
sealed class RouteDetailIntent {
    object LoadRouteDetails : RouteDetailIntent()
    object RefreshDetails : RouteDetailIntent()
    object NavigateBack : RouteDetailIntent()
}

/**
 * Side Effects for Route Detail
 */
sealed class RouteDetailEffect {
    object NavigateBack : RouteDetailEffect()
    data class ShowToast(val message: String) : RouteDetailEffect()
}
