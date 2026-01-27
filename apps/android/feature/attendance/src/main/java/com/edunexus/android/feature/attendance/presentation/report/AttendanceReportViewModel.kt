package com.edunexus.android.feature.attendance.presentation.report

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.feature.attendance.data.repository.AttendanceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AttendanceReportViewModel @Inject constructor(
    private val repository: AttendanceRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AttendanceReportUiState>(AttendanceReportUiState.Loading)
    val uiState: StateFlow<AttendanceReportUiState> = _uiState.asStateFlow()

    init {
        loadReport()
    }

    private fun loadReport() {
        viewModelScope.launch {
            _uiState.value = AttendanceReportUiState.Loading
            // Demo data - in real app, fetch from repository
            val stats = AttendanceStatistics(
                totalDays = 100,
                presentDays = 85,
                absentDays = 15,
                percentage = 85.0f
            )
            val reportData = listOf(
                ReportItem("John Doe", 90, 10, 90.0f),
                ReportItem("Jane Smith", 85, 15, 85.0f),
                ReportItem("Bob Johnson", 70, 30, 70.0f)
            )
            _uiState.value = AttendanceReportUiState.Success(stats, reportData)
        }
    }
}

sealed class AttendanceReportUiState {
    object Loading : AttendanceReportUiState()
    data class Success(val statistics: AttendanceStatistics, val reportData: List<ReportItem>) : AttendanceReportUiState()
    data class Error(val message: String) : AttendanceReportUiState()
}

data class AttendanceStatistics(
    val totalDays: Int,
    val presentDays: Int,
    val absentDays: Int,
    val percentage: Float
)

data class ReportItem(
    val studentName: String,
    val presentDays: Int,
    val absentDays: Int,
    val percentage: Float
)
