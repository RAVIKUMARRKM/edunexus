package com.edunexus.android.feature.attendance.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.feature.attendance.data.repository.AttendanceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Main ViewModel for Attendance feature (MVI Pattern)
 * Coordinates between list, mark, and report screens
 */
@HiltViewModel
class AttendanceViewModel @Inject constructor(
    private val repository: AttendanceRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AttendanceUiState>(AttendanceUiState.Idle)
    val uiState: StateFlow<AttendanceUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<AttendanceEffect>()
    val effect = _effect.asSharedFlow()

    fun handleIntent(intent: AttendanceIntent) {
        when (intent) {
            is AttendanceIntent.NavigateToList -> navigateToList()
            is AttendanceIntent.NavigateToMark -> navigateToMark()
            is AttendanceIntent.NavigateToReport -> navigateToReport()
        }
    }

    private fun navigateToList() {
        viewModelScope.launch {
            _effect.emit(AttendanceEffect.NavigateToList)
        }
    }

    private fun navigateToMark() {
        viewModelScope.launch {
            _effect.emit(AttendanceEffect.NavigateToMark)
        }
    }

    private fun navigateToReport() {
        viewModelScope.launch {
            _effect.emit(AttendanceEffect.NavigateToReport)
        }
    }
}

/**
 * UI State for Attendance feature
 */
sealed class AttendanceUiState {
    object Idle : AttendanceUiState()
}

/**
 * User Intents for Attendance feature
 */
sealed class AttendanceIntent {
    object NavigateToList : AttendanceIntent()
    object NavigateToMark : AttendanceIntent()
    object NavigateToReport : AttendanceIntent()
}

/**
 * Side Effects for Attendance feature
 */
sealed class AttendanceEffect {
    object NavigateToList : AttendanceEffect()
    object NavigateToMark : AttendanceEffect()
    object NavigateToReport : AttendanceEffect()
}
