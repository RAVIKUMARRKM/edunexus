package com.edunexus.android.feature.students.presentation.list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.StudentDto
import com.edunexus.android.feature.students.data.repository.StudentRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Students List Screen (MVI Pattern)
 */
@HiltViewModel
class StudentsViewModel @Inject constructor(
    private val repository: StudentRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<StudentsUiState>(StudentsUiState.Loading)
    val uiState: StateFlow<StudentsUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<StudentsEffect>()
    val effect = _effect.asSharedFlow()

    private var allStudents: List<StudentDto> = emptyList()
    private var currentStatus: String? = null
    private var currentSearch: String = ""

    init {
        loadStudents()
    }

    fun handleIntent(intent: StudentsIntent) {
        when (intent) {
            is StudentsIntent.LoadStudents -> loadStudents()
            is StudentsIntent.SearchStudents -> searchStudents(intent.query)
            is StudentsIntent.FilterByStatus -> filterByStatus(intent.status)
            is StudentsIntent.RefreshStudents -> refreshStudents()
            is StudentsIntent.DeleteStudent -> deleteStudent(intent.studentId)
            is StudentsIntent.NavigateToDetail -> navigateToDetail(intent.studentId)
            is StudentsIntent.NavigateToAdd -> navigateToAdd()
            is StudentsIntent.NavigateToEdit -> navigateToEdit(intent.studentId)
        }
    }

    private fun loadStudents() {
        viewModelScope.launch {
            _uiState.value = StudentsUiState.Loading

            repository.getStudents(
                status = currentStatus,
                search = currentSearch.ifEmpty { null }
            ).fold(
                onSuccess = { students ->
                    allStudents = students
                    _uiState.value = if (students.isEmpty()) {
                        StudentsUiState.Empty(
                            message = if (currentSearch.isNotEmpty()) {
                                "No students found for \"$currentSearch\""
                            } else if (currentStatus != null) {
                                "No $currentStatus students found"
                            } else {
                                "No students added yet"
                            }
                        )
                    } else {
                        StudentsUiState.Success(students)
                    }
                },
                onFailure = { error ->
                    _uiState.value = StudentsUiState.Error(
                        error.message ?: "Failed to load students"
                    )
                }
            )
        }
    }

    private fun searchStudents(query: String) {
        currentSearch = query
        loadStudents()
    }

    private fun filterByStatus(status: String?) {
        currentStatus = status
        loadStudents()
    }

    private fun refreshStudents() {
        loadStudents()
    }

    private fun deleteStudent(studentId: String) {
        viewModelScope.launch {
            repository.deleteStudent(studentId).fold(
                onSuccess = {
                    _effect.emit(StudentsEffect.ShowToast("Student deleted successfully"))
                    loadStudents() // Reload the list
                },
                onFailure = { error ->
                    _effect.emit(
                        StudentsEffect.ShowToast(
                            error.message ?: "Failed to delete student"
                        )
                    )
                }
            )
        }
    }

    private fun navigateToDetail(studentId: String) {
        viewModelScope.launch {
            _effect.emit(StudentsEffect.NavigateToDetail(studentId))
        }
    }

    private fun navigateToAdd() {
        viewModelScope.launch {
            _effect.emit(StudentsEffect.NavigateToAdd)
        }
    }

    private fun navigateToEdit(studentId: String) {
        viewModelScope.launch {
            _effect.emit(StudentsEffect.NavigateToEdit(studentId))
        }
    }
}

/**
 * UI State for Students List
 */
sealed class StudentsUiState {
    object Loading : StudentsUiState()
    data class Success(val students: List<StudentDto>) : StudentsUiState()
    data class Empty(val message: String) : StudentsUiState()
    data class Error(val message: String) : StudentsUiState()
}

/**
 * User Intents for Students List
 */
sealed class StudentsIntent {
    object LoadStudents : StudentsIntent()
    data class SearchStudents(val query: String) : StudentsIntent()
    data class FilterByStatus(val status: String?) : StudentsIntent()
    object RefreshStudents : StudentsIntent()
    data class DeleteStudent(val studentId: String) : StudentsIntent()
    data class NavigateToDetail(val studentId: String) : StudentsIntent()
    object NavigateToAdd : StudentsIntent()
    data class NavigateToEdit(val studentId: String) : StudentsIntent()
}

/**
 * Side Effects for Students List
 */
sealed class StudentsEffect {
    data class NavigateToDetail(val studentId: String) : StudentsEffect()
    object NavigateToAdd : StudentsEffect()
    data class NavigateToEdit(val studentId: String) : StudentsEffect()
    data class ShowToast(val message: String) : StudentsEffect()
}
