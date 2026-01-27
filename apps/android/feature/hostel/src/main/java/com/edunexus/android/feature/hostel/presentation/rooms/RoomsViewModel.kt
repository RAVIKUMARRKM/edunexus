package com.edunexus.android.feature.hostel.presentation.rooms

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.HostelRoomDto
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
 * Room status filter options
 */
enum class RoomStatusFilter {
    ALL, OCCUPIED, VACANT
}

/**
 * ViewModel for Rooms Screen (MVI Pattern)
 */
@HiltViewModel
class RoomsViewModel @Inject constructor(
    private val repository: HostelRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<RoomsUiState>(RoomsUiState.Loading)
    val uiState: StateFlow<RoomsUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<RoomsEffect>()
    val effect = _effect.asSharedFlow()

    private var allRooms: List<HostelRoomDto> = emptyList()
    private var currentSearch: String = ""
    private var currentFilter: RoomStatusFilter = RoomStatusFilter.ALL

    init {
        loadRooms()
    }

    fun handleIntent(intent: RoomsIntent) {
        when (intent) {
            is RoomsIntent.LoadRooms -> loadRooms(intent.buildingId)
            is RoomsIntent.SearchRooms -> searchRooms(intent.query)
            is RoomsIntent.FilterRooms -> filterRooms(intent.filter)
            is RoomsIntent.RefreshRooms -> refreshRooms()
            is RoomsIntent.NavigateToDetail -> navigateToDetail(intent.roomId)
        }
    }

    private fun loadRooms(buildingId: String? = null) {
        viewModelScope.launch {
            _uiState.value = RoomsUiState.Loading

            val result = if (buildingId != null) {
                repository.getRoomsByBuilding(buildingId)
            } else {
                repository.getRooms()
            }

            result.fold(
                onSuccess = { rooms ->
                    allRooms = rooms
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = RoomsUiState.Error(
                        error.message ?: "Failed to load rooms"
                    )
                }
            )
        }
    }

    private fun searchRooms(query: String) {
        currentSearch = query
        applyFilters()
    }

    private fun filterRooms(filter: RoomStatusFilter) {
        currentFilter = filter
        applyFilters()
    }

    private fun applyFilters() {
        var filtered = allRooms

        // Apply search filter
        if (currentSearch.isNotEmpty()) {
            filtered = filtered.filter { room ->
                room.roomNumber.contains(currentSearch, ignoreCase = true) ||
                        room.type.contains(currentSearch, ignoreCase = true) ||
                        room.building?.name?.contains(currentSearch, ignoreCase = true) == true
            }
        }

        // Apply status filter
        filtered = when (currentFilter) {
            RoomStatusFilter.ALL -> filtered
            RoomStatusFilter.OCCUPIED -> filtered.filter { it.occupied > 0 }
            RoomStatusFilter.VACANT -> filtered.filter { it.occupied == 0 || it.occupied < it.capacity }
        }

        _uiState.value = if (filtered.isEmpty()) {
            RoomsUiState.Empty(
                message = if (currentSearch.isNotEmpty()) {
                    "No rooms found for \"$currentSearch\""
                } else {
                    "No rooms available"
                }
            )
        } else {
            RoomsUiState.Success(
                rooms = filtered,
                currentFilter = currentFilter
            )
        }
    }

    private fun refreshRooms() {
        loadRooms()
    }

    private fun navigateToDetail(roomId: String) {
        viewModelScope.launch {
            _effect.emit(RoomsEffect.NavigateToDetail(roomId))
        }
    }
}

/**
 * UI State for Rooms Screen
 */
sealed class RoomsUiState {
    object Loading : RoomsUiState()
    data class Success(
        val rooms: List<HostelRoomDto>,
        val currentFilter: RoomStatusFilter
    ) : RoomsUiState()
    data class Empty(val message: String) : RoomsUiState()
    data class Error(val message: String) : RoomsUiState()
}

/**
 * User Intents for Rooms Screen
 */
sealed class RoomsIntent {
    data class LoadRooms(val buildingId: String? = null) : RoomsIntent()
    data class SearchRooms(val query: String) : RoomsIntent()
    data class FilterRooms(val filter: RoomStatusFilter) : RoomsIntent()
    object RefreshRooms : RoomsIntent()
    data class NavigateToDetail(val roomId: String) : RoomsIntent()
}

/**
 * Side Effects for Rooms Screen
 */
sealed class RoomsEffect {
    data class NavigateToDetail(val roomId: String) : RoomsEffect()
    data class ShowToast(val message: String) : RoomsEffect()
}
