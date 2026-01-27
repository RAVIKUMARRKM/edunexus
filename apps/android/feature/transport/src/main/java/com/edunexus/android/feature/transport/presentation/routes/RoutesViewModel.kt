package com.edunexus.android.feature.transport.presentation.routes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
 * ViewModel for Routes List Screen (MVI Pattern)
 */
@HiltViewModel
class RoutesViewModel @Inject constructor(
    private val repository: TransportRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<RoutesUiState>(RoutesUiState.Loading)
    val uiState: StateFlow<RoutesUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<RoutesEffect>()
    val effect = _effect.asSharedFlow()

    private var allRoutes: List<TransportRouteDto> = emptyList()
    private var currentStatus: String? = null
    private var currentSearch: String = ""

    init {
        loadRoutes()
    }

    fun handleIntent(intent: RoutesIntent) {
        when (intent) {
            is RoutesIntent.LoadRoutes -> loadRoutes()
            is RoutesIntent.SearchRoutes -> searchRoutes(intent.query)
            is RoutesIntent.FilterByStatus -> filterByStatus(intent.status)
            is RoutesIntent.RefreshRoutes -> refreshRoutes()
            is RoutesIntent.NavigateToDetail -> navigateToDetail(intent.routeId)
        }
    }

    private fun loadRoutes() {
        viewModelScope.launch {
            _uiState.value = RoutesUiState.Loading

            repository.getTransportRoutes(
                status = currentStatus
            ).fold(
                onSuccess = { routes ->
                    allRoutes = routes
                    val filteredRoutes = if (currentSearch.isNotEmpty()) {
                        routes.filter { route ->
                            route.name.contains(currentSearch, ignoreCase = true) ||
                            route.routeNumber.contains(currentSearch, ignoreCase = true) ||
                            route.startPoint.contains(currentSearch, ignoreCase = true) ||
                            route.endPoint.contains(currentSearch, ignoreCase = true)
                        }
                    } else {
                        routes
                    }

                    _uiState.value = if (filteredRoutes.isEmpty()) {
                        RoutesUiState.Empty(
                            message = if (currentSearch.isNotEmpty()) {
                                "No routes found for \"$currentSearch\""
                            } else if (currentStatus != null) {
                                "No $currentStatus routes found"
                            } else {
                                "No routes added yet"
                            }
                        )
                    } else {
                        RoutesUiState.Success(filteredRoutes)
                    }
                },
                onFailure = { error ->
                    _uiState.value = RoutesUiState.Error(
                        error.message ?: "Failed to load routes"
                    )
                }
            )
        }
    }

    private fun searchRoutes(query: String) {
        currentSearch = query
        loadRoutes()
    }

    private fun filterByStatus(status: String?) {
        currentStatus = status
        loadRoutes()
    }

    private fun refreshRoutes() {
        loadRoutes()
    }

    private fun navigateToDetail(routeId: String) {
        viewModelScope.launch {
            _effect.emit(RoutesEffect.NavigateToDetail(routeId))
        }
    }
}

/**
 * UI State for Routes List
 */
sealed class RoutesUiState {
    object Loading : RoutesUiState()
    data class Success(val routes: List<TransportRouteDto>) : RoutesUiState()
    data class Empty(val message: String) : RoutesUiState()
    data class Error(val message: String) : RoutesUiState()
}

/**
 * User Intents for Routes List
 */
sealed class RoutesIntent {
    object LoadRoutes : RoutesIntent()
    data class SearchRoutes(val query: String) : RoutesIntent()
    data class FilterByStatus(val status: String?) : RoutesIntent()
    object RefreshRoutes : RoutesIntent()
    data class NavigateToDetail(val routeId: String) : RoutesIntent()
}

/**
 * Side Effects for Routes List
 */
sealed class RoutesEffect {
    data class NavigateToDetail(val routeId: String) : RoutesEffect()
    data class ShowToast(val message: String) : RoutesEffect()
}
