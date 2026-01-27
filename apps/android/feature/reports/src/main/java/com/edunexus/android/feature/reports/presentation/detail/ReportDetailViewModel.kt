package com.edunexus.android.feature.reports.presentation.detail

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ReportDto
import com.edunexus.android.feature.reports.data.repository.ReportsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ReportDetailViewModel @Inject constructor(
    private val repository: ReportsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ReportDetailUiState>(ReportDetailUiState.Loading)
    val uiState: StateFlow<ReportDetailUiState> = _uiState.asStateFlow()

    fun handleIntent(intent: ReportDetailIntent) {
        when (intent) {
            is ReportDetailIntent.LoadReport -> loadReport(intent.reportId)
        }
    }

    private fun loadReport(reportId: String) {
        viewModelScope.launch {
            _uiState.value = ReportDetailUiState.Loading

            repository.getReport(reportId).fold(
                onSuccess = { report ->
                    _uiState.value = ReportDetailUiState.Success(report)
                },
                onFailure = { error ->
                    _uiState.value = ReportDetailUiState.Error(
                        error.message ?: "Failed to load report"
                    )
                }
            )
        }
    }
}

sealed class ReportDetailUiState {
    object Loading : ReportDetailUiState()
    data class Success(val report: ReportDto) : ReportDetailUiState()
    data class Error(val message: String) : ReportDetailUiState()
}

sealed class ReportDetailIntent {
    data class LoadReport(val reportId: String) : ReportDetailIntent()
}
