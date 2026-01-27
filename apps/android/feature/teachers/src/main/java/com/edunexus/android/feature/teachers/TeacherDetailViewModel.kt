package com.edunexus.android.feature.teachers

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.model.Teacher
import com.edunexus.android.feature.teachers.data.repository.TeacherRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Teacher Detail Screen (MVI Pattern)
 */
@HiltViewModel
class TeacherDetailViewModel @Inject constructor(
    private val repository: TeacherRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val teacherId: String = checkNotNull(savedStateHandle["teacherId"])

    private val _uiState = MutableStateFlow(TeacherDetailUiState())
    val uiState: StateFlow<TeacherDetailUiState> = _uiState.asStateFlow()

    init {
        loadTeacher()
    }

    fun onEvent(event: TeacherDetailEvent) {
        when (event) {
            is TeacherDetailEvent.LoadTeacher -> loadTeacher()
            is TeacherDetailEvent.DeleteTeacher -> deleteTeacher()
        }
    }

    private fun loadTeacher() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            val result = repository.getTeacher(teacherId)

            result.fold(
                onSuccess = { teacher ->
                    _uiState.update {
                        it.copy(
                            teacher = teacher,
                            isLoading = false
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = error.message ?: "Failed to load teacher"
                        )
                    }
                }
            )
        }
    }

    private fun deleteTeacher() {
        viewModelScope.launch {
            _uiState.update { it.copy(isDeleting = true, error = null) }

            val result = repository.deleteTeacher(teacherId)

            result.fold(
                onSuccess = {
                    _uiState.update {
                        it.copy(
                            isDeleting = false,
                            isDeleted = true
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isDeleting = false,
                            error = error.message ?: "Failed to delete teacher"
                        )
                    }
                }
            )
        }
    }
}

/**
 * UI State for Teacher Detail Screen
 */
data class TeacherDetailUiState(
    val teacher: Teacher? = null,
    val isLoading: Boolean = false,
    val isDeleting: Boolean = false,
    val isDeleted: Boolean = false,
    val error: String? = null
)

/**
 * Events for Teacher Detail Screen
 */
sealed class TeacherDetailEvent {
    object LoadTeacher : TeacherDetailEvent()
    object DeleteTeacher : TeacherDetailEvent()
}
