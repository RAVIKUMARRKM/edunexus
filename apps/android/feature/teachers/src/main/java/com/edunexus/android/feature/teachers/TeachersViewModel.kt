package com.edunexus.android.feature.teachers

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.model.Teacher
import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.feature.teachers.data.repository.TeacherRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Teachers List Screen (MVI Pattern)
 */
@HiltViewModel
class TeachersViewModel @Inject constructor(
    private val repository: TeacherRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TeachersUiState())
    val uiState: StateFlow<TeachersUiState> = _uiState.asStateFlow()

    init {
        loadTeachers()
    }

    fun onEvent(event: TeachersEvent) {
        when (event) {
            is TeachersEvent.LoadTeachers -> loadTeachers()
            is TeachersEvent.SearchQueryChanged -> updateSearchQuery(event.query)
            is TeachersEvent.FilterChanged -> updateFilter(event.filter)
            is TeachersEvent.RefreshTeachers -> refreshTeachers()
            is TeachersEvent.DeleteTeacher -> deleteTeacher(event.id)
        }
    }

    private fun loadTeachers() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            val result = repository.getTeachers(
                status = _uiState.value.selectedFilter.takeIf { it != EmployeeStatus.ACTIVE },
                search = _uiState.value.searchQuery.takeIf { it.isNotBlank() }
            )

            result.fold(
                onSuccess = { teachers ->
                    _uiState.update {
                        it.copy(
                            teachers = teachers,
                            filteredTeachers = filterTeachers(teachers, it.searchQuery, it.selectedFilter),
                            isLoading = false
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = error.message ?: "Failed to load teachers"
                        )
                    }
                }
            )
        }
    }

    private fun refreshTeachers() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true, error = null) }

            val result = repository.getTeachers(
                status = _uiState.value.selectedFilter.takeIf { it != EmployeeStatus.ACTIVE },
                search = _uiState.value.searchQuery.takeIf { it.isNotBlank() }
            )

            result.fold(
                onSuccess = { teachers ->
                    _uiState.update {
                        it.copy(
                            teachers = teachers,
                            filteredTeachers = filterTeachers(teachers, it.searchQuery, it.selectedFilter),
                            isRefreshing = false
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isRefreshing = false,
                            error = error.message ?: "Failed to refresh teachers"
                        )
                    }
                }
            )
        }
    }

    private fun updateSearchQuery(query: String) {
        _uiState.update {
            it.copy(
                searchQuery = query,
                filteredTeachers = filterTeachers(it.teachers, query, it.selectedFilter)
            )
        }
    }

    private fun updateFilter(filter: EmployeeStatus?) {
        _uiState.update {
            it.copy(
                selectedFilter = filter,
                filteredTeachers = filterTeachers(it.teachers, it.searchQuery, filter)
            )
        }
        loadTeachers() // Reload with new filter
    }

    private fun deleteTeacher(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            val result = repository.deleteTeacher(id)

            result.fold(
                onSuccess = {
                    loadTeachers() // Reload list after deletion
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = error.message ?: "Failed to delete teacher"
                        )
                    }
                }
            )
        }
    }

    private fun filterTeachers(
        teachers: List<Teacher>,
        query: String,
        filter: EmployeeStatus?
    ): List<Teacher> {
        var filtered = teachers

        // Apply status filter
        if (filter != null) {
            filtered = filtered.filter { it.status == filter }
        }

        // Apply search query
        if (query.isNotBlank()) {
            filtered = filtered.filter {
                it.firstName.contains(query, ignoreCase = true) ||
                it.lastName.contains(query, ignoreCase = true) ||
                it.employeeId.contains(query, ignoreCase = true)
            }
        }

        return filtered
    }
}

/**
 * UI State for Teachers Screen
 */
data class TeachersUiState(
    val teachers: List<Teacher> = emptyList(),
    val filteredTeachers: List<Teacher> = emptyList(),
    val searchQuery: String = "",
    val selectedFilter: EmployeeStatus? = null,
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val error: String? = null
)

/**
 * Events for Teachers Screen
 */
sealed class TeachersEvent {
    object LoadTeachers : TeachersEvent()
    object RefreshTeachers : TeachersEvent()
    data class SearchQueryChanged(val query: String) : TeachersEvent()
    data class FilterChanged(val filter: EmployeeStatus?) : TeachersEvent()
    data class DeleteTeacher(val id: String) : TeachersEvent()
}
