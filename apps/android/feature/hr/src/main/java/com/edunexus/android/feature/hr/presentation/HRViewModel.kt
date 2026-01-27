package com.edunexus.android.feature.hr.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.EmployeeDto
import com.edunexus.android.core.network.dto.EmployeeStatus
import com.edunexus.android.feature.hr.data.repository.HRRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HRViewModel @Inject constructor(
    private val repository: HRRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<HRUiState>(HRUiState.Loading)
    val uiState: StateFlow<HRUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<HREffect>()
    val effect = _effect.asSharedFlow()

    private var allEmployees: List<EmployeeDto> = emptyList()
    private var currentSearch: String = ""
    private var currentFilter: EmployeeStatus? = null

    init {
        loadEmployees()
    }

    fun handleIntent(intent: HRIntent) {
        when (intent) {
            is HRIntent.LoadEmployees -> loadEmployees()
            is HRIntent.SearchEmployees -> searchEmployees(intent.query)
            is HRIntent.FilterByStatus -> filterByStatus(intent.status)
            is HRIntent.RefreshEmployees -> refreshEmployees()
            is HRIntent.NavigateToDetail -> navigateToDetail(intent.employeeId)
        }
    }

    private fun loadEmployees() {
        viewModelScope.launch {
            _uiState.value = HRUiState.Loading

            repository.getEmployees().fold(
                onSuccess = { employees ->
                    allEmployees = employees
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = HRUiState.Error(error.message ?: "Failed to load employees")
                }
            )
        }
    }

    private fun searchEmployees(query: String) {
        currentSearch = query
        applyFilters()
    }

    private fun filterByStatus(status: EmployeeStatus?) {
        currentFilter = status
        applyFilters()
    }

    private fun applyFilters() {
        var filtered = allEmployees

        if (currentFilter != null) {
            filtered = filtered.filter { it.status == currentFilter }
        }

        if (currentSearch.isNotEmpty()) {
            filtered = filtered.filter { employee ->
                employee.name.contains(currentSearch, ignoreCase = true) ||
                employee.employeeId.contains(currentSearch, ignoreCase = true) ||
                employee.designation.contains(currentSearch, ignoreCase = true) ||
                employee.department.contains(currentSearch, ignoreCase = true)
            }
        }

        _uiState.value = if (filtered.isEmpty()) {
            HRUiState.Empty(
                message = if (currentSearch.isNotEmpty()) {
                    "No employees found"
                } else if (currentFilter != null) {
                    "No employees with this status"
                } else {
                    "No employees available"
                }
            )
        } else {
            HRUiState.Success(filtered)
        }
    }

    private fun refreshEmployees() {
        loadEmployees()
    }

    private fun navigateToDetail(employeeId: String) {
        viewModelScope.launch {
            _effect.emit(HREffect.NavigateToDetail(employeeId))
        }
    }
}

sealed class HRUiState {
    object Loading : HRUiState()
    data class Success(val employees: List<EmployeeDto>) : HRUiState()
    data class Empty(val message: String) : HRUiState()
    data class Error(val message: String) : HRUiState()
}

sealed class HRIntent {
    object LoadEmployees : HRIntent()
    data class SearchEmployees(val query: String) : HRIntent()
    data class FilterByStatus(val status: EmployeeStatus?) : HRIntent()
    object RefreshEmployees : HRIntent()
    data class NavigateToDetail(val employeeId: String) : HRIntent()
}

sealed class HREffect {
    data class NavigateToDetail(val employeeId: String) : HREffect()
    data class ShowToast(val message: String) : HREffect()
}
