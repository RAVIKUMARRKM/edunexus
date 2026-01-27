package com.edunexus.android.feature.exams.presentation.results

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ExamResultDto
import com.edunexus.android.feature.exams.data.repository.ExamRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExamResultsViewModel @Inject constructor(
    private val repository: ExamRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ExamResultsUiState>(ExamResultsUiState.Loading)
    val uiState: StateFlow<ExamResultsUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ExamResultsEffect>()
    val effect = _effect.asSharedFlow()

    fun handleIntent(intent: ExamResultsIntent) {
        when (intent) {
            is ExamResultsIntent.LoadResults -> loadResults(intent.examId)
            is ExamResultsIntent.RefreshResults -> loadResults(intent.examId)
            is ExamResultsIntent.NavigateBack -> navigateBack()
        }
    }

    private fun loadResults(examId: String) {
        viewModelScope.launch {
            _uiState.value = ExamResultsUiState.Loading
            repository.getExamResults(examId).fold(
                onSuccess { results ->
                    _uiState.value = if (results.isEmpty()) {
                        ExamResultsUiState.Empty("No results available for this exam")
                    } else {
                        ExamResultsUiState.Success(results)
                    }
                },
                onFailure { _uiState.value = ExamResultsUiState.Error(it.message ?: "Failed to load results") }
            )
        }
    }

    private fun navigateBack() {
        viewModelScope.launch { _effect.emit(ExamResultsEffect.NavigateBack) }
    }
}

sealed class ExamResultsUiState {
    object Loading : ExamResultsUiState()
    data class Success(val results: List<ExamResultDto>) : ExamResultsUiState()
    data class Empty(val message: String) : ExamResultsUiState()
    data class Error(val message: String) : ExamResultsUiState()
}

sealed class ExamResultsIntent {
    data class LoadResults(val examId: String) : ExamResultsIntent()
    data class RefreshResults(val examId: String) : ExamResultsIntent()
    object NavigateBack : ExamResultsIntent()
}

sealed class ExamResultsEffect {
    object NavigateBack : ExamResultsEffect()
    data class ShowToast(val message: String) : ExamResultsEffect()
}
