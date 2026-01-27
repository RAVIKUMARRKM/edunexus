package com.edunexus.android.feature.attendance.presentation.list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.AttendanceDto
import com.edunexus.android.feature.attendance.data.repository.AttendanceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AttendanceListViewModel @Inject constructor(
    private val repository: AttendanceRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AttendanceListUiState>(AttendanceListUiState.Loading)
    val uiState: StateFlow<AttendanceListUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<AttendanceListEffect>()
    val effect = _effect.asSharedFlow()

    private var currentDate: String? = null
    private var currentStatus: String? = null

    init {
        loadAttendance()
    }

    fun handleIntent(intent: AttendanceListIntent) {
        when (intent) {
            is AttendanceListIntent.LoadAttendance -> loadAttendance()
            is AttendanceListIntent.FilterByDate -> filterByDate(intent.date)
            is AttendanceListIntent.FilterByStatus -> filterByStatus(intent.status)
            is AttendanceListIntent.RefreshAttendance -> refreshAttendance()
            is AttendanceListIntent.NavigateToMark -> navigateToMark()
            is AttendanceListIntent.NavigateToReport -> navigateToReport()
        }
    }

    private fun loadAttendance() {
        viewModelScope.launch {
            _uiState.value = AttendanceListUiState.Loading
            repository.getAttendance(
                date = currentDate,
                status = currentStatus
            ).fold(
                onSuccess = { attendance ->
                    _uiState.value = if (attendance.isEmpty()) {
                        AttendanceListUiState.Empty("No attendance records found")
                    } else {
                        AttendanceListUiState.Success(attendance)
                    }
                },
                onFailure = { error ->
                    _uiState.value = AttendanceListUiState.Error(error.message ?: "Failed to load attendance")
                }
            )
        }
    }

    private fun filterByDate(date: String?) {
        currentDate = date
        loadAttendance()
    }

    private fun filterByStatus(status: String?) {
        currentStatus = status
        loadAttendance()
    }

    private fun refreshAttendance() {
        loadAttendance()
    }

    private fun navigateToMark() {
        viewModelScope.launch {
            _effect.emit(AttendanceListEffect.NavigateToMark)
        }
    }

    private fun navigateToReport() {
        viewModelScope.launch {
            _effect.emit(AttendanceListEffect.NavigateToReport)
        }
    }
}

sealed class AttendanceListUiState {
    object Loading : AttendanceListUiState()
    data class Success(val attendanceList: List<AttendanceDto>) : AttendanceListUiState()
    data class Empty(val message: String) : AttendanceListUiState()
    data class Error(val message: String) : AttendanceListUiState()
}

sealed class AttendanceListIntent {
    object LoadAttendance : AttendanceListIntent()
    data class FilterByDate(val date: String?) : AttendanceListIntent()
    data class FilterByStatus(val status: String?) : AttendanceListIntent()
    object RefreshAttendance : AttendanceListIntent()
    object NavigateToMark : AttendanceListIntent()
    object NavigateToReport : AttendanceListIntent()
}

sealed class AttendanceListEffect {
    object NavigateToMark : AttendanceListEffect()
    object NavigateToReport : AttendanceListEffect()
    data class ShowToast(val message: String) : AttendanceListEffect()
}
