package com.edunexus.android.feature.students.presentation.detail

import androidx.lifecycle.SavedStateHandle
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
 * ViewModel for Student Detail Screen (MVI Pattern)
 */
@HiltViewModel
class StudentDetailViewModel @Inject constructor(
    private val repository: StudentRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val studentId: String = savedStateHandle.get<String>("studentId")
        ?: throw IllegalArgumentException("Student ID is required")

    private val _uiState = MutableStateFlow<StudentDetailUiState>(StudentDetailUiState.Loading)
    val uiState: StateFlow<StudentDetailUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<StudentDetailEffect>()
    val effect = _effect.asSharedFlow()

    init {
        loadStudent()
    }

    fun handleIntent(intent: StudentDetailIntent) {
        when (intent) {
            is StudentDetailIntent.LoadStudent -> loadStudent()
            is StudentDetailIntent.DeleteStudent -> deleteStudent()
            is StudentDetailIntent.NavigateToEdit -> navigateToEdit()
            is StudentDetailIntent.NavigateBack -> navigateBack()
        }
    }

    private fun loadStudent() {
        viewModelScope.launch {
            _uiState.value = StudentDetailUiState.Loading

            repository.getStudent(studentId).fold(
                onSuccess = { student ->
                    _uiState.value = StudentDetailUiState.Success(student)
                },
                onFailure = { error ->
                    _uiState.value = StudentDetailUiState.Error(
                        error.message ?: "Failed to load student details"
                    )
                }
            )
        }
    }

    private fun deleteStudent() {
        viewModelScope.launch {
            repository.deleteStudent(studentId).fold(
                onSuccess = {
                    _effect.emit(StudentDetailEffect.ShowToast("Student deleted successfully"))
                    _effect.emit(StudentDetailEffect.NavigateBack)
                },
                onFailure = { error ->
                    _effect.emit(
                        StudentDetailEffect.ShowToast(
                            error.message ?: "Failed to delete student"
                        )
                    )
                }
            )
        }
    }

    private fun navigateToEdit() {
        viewModelScope.launch {
            _effect.emit(StudentDetailEffect.NavigateToEdit(studentId))
        }
    }

    private fun navigateBack() {
        viewModelScope.launch {
            _effect.emit(StudentDetailEffect.NavigateBack)
        }
    }
}

/**
 * UI State for Student Detail
 */
sealed class StudentDetailUiState {
    object Loading : StudentDetailUiState()
    data class Success(val student: StudentDto) : StudentDetailUiState()
    data class Error(val message: String) : StudentDetailUiState()
}

/**
 * User Intents for Student Detail
 */
sealed class StudentDetailIntent {
    object LoadStudent : StudentDetailIntent()
    object DeleteStudent : StudentDetailIntent()
    object NavigateToEdit : StudentDetailIntent()
    object NavigateBack : StudentDetailIntent()
}

/**
 * Side Effects for Student Detail
 */
sealed class StudentDetailEffect {
    data class NavigateToEdit(val studentId: String) : StudentDetailEffect()
    object NavigateBack : StudentDetailEffect()
    data class ShowToast(val message: String) : StudentDetailEffect()
}
