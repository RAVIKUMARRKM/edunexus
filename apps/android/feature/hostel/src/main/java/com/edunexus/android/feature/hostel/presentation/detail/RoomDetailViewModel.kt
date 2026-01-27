package com.edunexus.android.feature.hostel.presentation.detail

import androidx.lifecycle.SavedStateHandle
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

@HiltViewModel
class RoomDetailViewModel @Inject constructor(
    private val repository: HostelRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val roomId: String = checkNotNull(savedStateHandle.get<String>("roomId"))

    private val _uiState = MutableStateFlow<RoomDetailUiState>(RoomDetailUiState.Loading)
    val uiState: StateFlow<RoomDetailUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<RoomDetailEffect>()
    val effect = _effect.asSharedFlow()

    init {
        loadRoomDetail()
    }

    fun handleIntent(intent: RoomDetailIntent) {
        when (intent) {
            is RoomDetailIntent.LoadRoomDetail -> loadRoomDetail()
            is RoomDetailIntent.RefreshRoomDetail -> refreshRoomDetail()
        }
    }

    private fun loadRoomDetail() {
        viewModelScope.launch {
            _uiState.value = RoomDetailUiState.Loading

            repository.getRoom(roomId).fold(
                onSuccess = { room ->
                    _uiState.value = RoomDetailUiState.Success(room)
                },
                onFailure = { error ->
                    _uiState.value = RoomDetailUiState.Error(
                        error.message ?: "Failed to load room details"
                    )
                }
            )
        }
    }

    private fun refreshRoomDetail() {
        loadRoomDetail()
    }
}

sealed class RoomDetailUiState {
    object Loading : RoomDetailUiState()
    data class Success(val room: HostelRoomDto) : RoomDetailUiState()
    data class Error(val message: String) : RoomDetailUiState()
}

sealed class RoomDetailIntent {
    object LoadRoomDetail : RoomDetailIntent()
    object RefreshRoomDetail : RoomDetailIntent()
}

sealed class RoomDetailEffect {
    data class ShowToast(val message: String) : RoomDetailEffect()
}
