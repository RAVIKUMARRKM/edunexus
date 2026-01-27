package com.edunexus.android.feature.hostel.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
 * Main ViewModel for Hostel Module (MVI Pattern)
 * Coordinates between Buildings and Rooms screens
 */
@HiltViewModel
class HostelViewModel @Inject constructor(
    private val repository: HostelRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<HostelUiState>(HostelUiState.Idle)
    val uiState: StateFlow<HostelUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<HostelEffect>()
    val effect = _effect.asSharedFlow()

    fun handleIntent(intent: HostelIntent) {
        when (intent) {
            is HostelIntent.NavigateToBuildings -> navigateToBuildings()
            is HostelIntent.NavigateToRooms -> navigateToRooms(intent.buildingId)
        }
    }

    private fun navigateToBuildings() {
        viewModelScope.launch {
            _effect.emit(HostelEffect.NavigateToBuildings)
        }
    }

    private fun navigateToRooms(buildingId: String?) {
        viewModelScope.launch {
            _effect.emit(HostelEffect.NavigateToRooms(buildingId))
        }
    }
}

/**
 * UI State for Hostel Module
 */
sealed class HostelUiState {
    object Idle : HostelUiState()
}

/**
 * User Intents for Hostel Module
 */
sealed class HostelIntent {
    object NavigateToBuildings : HostelIntent()
    data class NavigateToRooms(val buildingId: String?) : HostelIntent()
}

/**
 * Side Effects for Hostel Module
 */
sealed class HostelEffect {
    object NavigateToBuildings : HostelEffect()
    data class NavigateToRooms(val buildingId: String?) : HostelEffect()
    data class ShowToast(val message: String) : HostelEffect()
}
