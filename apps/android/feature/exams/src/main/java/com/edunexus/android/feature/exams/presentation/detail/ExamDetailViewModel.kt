package com.edunexus.android.feature.exams.presentation.detail

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ExamDto
import com.edunexus.android.feature.exams.data.repository.ExamRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExamDetailViewModel @Inject constructor(
    private val repository: ExamRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ExamDetailUiState>(ExamDetailUiState.Loading)
    val uiState: StateFlow<ExamDetailUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ExamDetailEffect>()
    val effect = _effect.asSharedFlow()

    fun handleIntent(intent: ExamDetailIntent) {
        when (intent) {
            is ExamDetailIntent.LoadExam -> loadExam(intent.examId)
            is ExamDetailIntent.NavigateBack -> navigateBack()
            is ExamDetailIntent.NavigateToResults -> navigateToResults(intent.examId)
        }
    }

    private fun loadExam(examId: String) {
        viewModelScope.launch {
            _uiState.value = ExamDetailUiState.Loading
            repository.getExam(examId).fold(
                onSuccess = { _uiState.value = ExamDetailUiState.Success(it) },
                onFailure = { _uiState.value = ExamDetailUiState.Error(it.message ?: "Failed to load exam") }
            )
        }
    }

    private fun navigateBack() {
        viewModelScope.launch { _effect.emit(ExamDetailEffect.NavigateBack) }
    }

    private fun navigateToResults(examId: String) {
        viewModelScope.launch { _effect.emit(ExamDetailEffect.NavigateToResults(examId)) }
    }
}

sealed class ExamDetailUiState {
    object Loading : ExamDetailUiState()
    data class Success(val exam: ExamDto) : ExamDetailUiState()
    data class Error(val message: String) : ExamDetailUiState()
}

sealed class ExamDetailIntent {
    data class LoadExam(val examId: String) : ExamDetailIntent()
    object NavigateBack : ExamDetailIntent()
    data class NavigateToResults(val examId: String) : ExamDetailIntent()
}

sealed class ExamDetailEffect {
    object NavigateBack : ExamDetailEffect()
    data class NavigateToResults(val examId: String) : ExamDetailEffect()
    data class ShowToast(val message: String) : ExamDetailEffect()
}
