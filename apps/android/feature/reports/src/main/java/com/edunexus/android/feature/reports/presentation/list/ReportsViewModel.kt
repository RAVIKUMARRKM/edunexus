package com.edunexus.android.feature.reports.presentation.list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ReportDto
import com.edunexus.android.core.network.dto.ReportType
import com.edunexus.android.feature.reports.data.repository.ReportsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ReportsViewModel @Inject constructor(
    private val repository: ReportsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ReportsUiState>(ReportsUiState.Loading)
    val uiState: StateFlow<ReportsUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ReportsEffect>()
    val effect = _effect.asSharedFlow()

    private var allReports: List<ReportDto> = emptyList()
    private var currentSearch: String = ""
    private var currentFilter: ReportType? = null

    init {
        loadReports()
    }

    fun handleIntent(intent: ReportsIntent) {
        when (intent) {
            is ReportsIntent.LoadReports -> loadReports()
            is ReportsIntent.SearchReports -> searchReports(intent.query)
            is ReportsIntent.FilterByType -> filterByType(intent.type)
            is ReportsIntent.RefreshReports -> refreshReports()
            is ReportsIntent.NavigateToDetail -> navigateToDetail(intent.reportId)
        }
    }

    private fun loadReports() {
        viewModelScope.launch {
            _uiState.value = ReportsUiState.Loading

            repository.getReports().fold(
                onSuccess = { reports ->
                    allReports = reports
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = ReportsUiState.Error(
                        error.message ?: "Failed to load reports"
                    )
                }
            )
        }
    }

    private fun searchReports(query: String) {
        currentSearch = query
        applyFilters()
    }

    private fun filterByType(type: ReportType?) {
        currentFilter = type
        applyFilters()
    }

    private fun applyFilters() {
        var filtered = allReports

        if (currentFilter != null) {
            filtered = filtered.filter { it.type == currentFilter }
        }

        if (currentSearch.isNotEmpty()) {
            filtered = filtered.filter { report ->
                report.title.contains(currentSearch, ignoreCase = true) ||
                        (report.description?.contains(currentSearch, ignoreCase = true) == true) ||
                        report.type.name.contains(currentSearch, ignoreCase = true)
            }
        }

        _uiState.value = if (filtered.isEmpty()) {
            ReportsUiState.Empty(
                message = if (currentSearch.isNotEmpty() || currentFilter != null) {
                    "No reports found matching your criteria"
                } else {
                    "No reports available"
                }
            )
        } else {
            ReportsUiState.Success(filtered)
        }
    }

    private fun refreshReports() {
        loadReports()
    }

    private fun navigateToDetail(reportId: String) {
        viewModelScope.launch {
            _effect.emit(ReportsEffect.NavigateToDetail(reportId))
        }
    }
}

sealed class ReportsUiState {
    object Loading : ReportsUiState()
    data class Success(val reports: List<ReportDto>) : ReportsUiState()
    data class Empty(val message: String) : ReportsUiState()
    data class Error(val message: String) : ReportsUiState()
}

sealed class ReportsIntent {
    object LoadReports : ReportsIntent()
    data class SearchReports(val query: String) : ReportsIntent()
    data class FilterByType(val type: ReportType?) : ReportsIntent()
    object RefreshReports : ReportsIntent()
    data class NavigateToDetail(val reportId: String) : ReportsIntent()
}

sealed class ReportsEffect {
    data class NavigateToDetail(val reportId: String) : ReportsEffect()
    data class ShowToast(val message: String) : ReportsEffect()
}
