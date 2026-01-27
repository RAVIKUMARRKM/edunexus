package com.edunexus.android.feature.exams.presentation.list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ExamDto
import com.edunexus.android.feature.exams.data.repository.ExamRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Exams List Screen (MVI Pattern)
 */
@HiltViewModel
class ExamsViewModel @Inject constructor(
    private val repository: ExamRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ExamsUiState>(ExamsUiState.Loading)
    val uiState: StateFlow<ExamsUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ExamsEffect>()
    val effect = _effect.asSharedFlow()

    private var allExams: List<ExamDto> = emptyList()
    private var currentStatus: String? = null
    private var currentSearch: String = ""

    init {
        loadExams()
    }

    fun handleIntent(intent: ExamsIntent) {
        when (intent) {
            is ExamsIntent.LoadExams -> loadExams()
            is ExamsIntent.SearchExams -> searchExams(intent.query)
            is ExamsIntent.FilterByStatus -> filterByStatus(intent.status)
            is ExamsIntent.RefreshExams -> refreshExams()
            is ExamsIntent.NavigateToDetail -> navigateToDetail(intent.examId)
            is ExamsIntent.NavigateToResults -> navigateToResults(intent.examId)
        }
    }

    private fun loadExams() {
        viewModelScope.launch {
            _uiState.value = ExamsUiState.Loading

            repository.getExams(
                status = currentStatus,
                search = currentSearch.ifEmpty { null }
            ).fold(
                onSuccess = { exams ->
                    allExams = exams
                    _uiState.value = if (exams.isEmpty()) {
                        ExamsUiState.Empty(
                            message = if (currentSearch.isNotEmpty()) {
                                "No exams found for \"$currentSearch\""
                            } else if (currentStatus != null) {
                                "No $currentStatus exams found"
                            } else {
                                "No exams scheduled yet"
                            }
                        )
                    } else {
                        ExamsUiState.Success(exams)
                    }
                },
                onFailure = { error ->
                    _uiState.value = ExamsUiState.Error(
                        error.message ?: "Failed to load exams"
                    )
                }
            )
        }
    }

    private fun searchExams(query: String) {
        currentSearch = query
        loadExams()
    }

    private fun filterByStatus(status: String?) {
        currentStatus = status
        loadExams()
    }

    private fun refreshExams() {
        loadExams()
    }

    private fun navigateToDetail(examId: String) {
        viewModelScope.launch {
            _effect.emit(ExamsEffect.NavigateToDetail(examId))
        }
    }

    private fun navigateToResults(examId: String) {
        viewModelScope.launch {
            _effect.emit(ExamsEffect.NavigateToResults(examId))
        }
    }
}

/**
 * UI State for Exams List
 */
sealed class ExamsUiState {
    object Loading : ExamsUiState()
    data class Success(val exams: List<ExamDto>) : ExamsUiState()
    data class Empty(val message: String) : ExamsUiState()
    data class Error(val message: String) : ExamsUiState()
}

/**
 * User Intents for Exams List
 */
sealed class ExamsIntent {
    object LoadExams : ExamsIntent()
    data class SearchExams(val query: String) : ExamsIntent()
    data class FilterByStatus(val status: String?) : ExamsIntent()
    object RefreshExams : ExamsIntent()
    data class NavigateToDetail(val examId: String) : ExamsIntent()
    data class NavigateToResults(val examId: String) : ExamsIntent()
}

/**
 * Side Effects for Exams List
 */
sealed class ExamsEffect {
    data class NavigateToDetail(val examId: String) : ExamsEffect()
    data class NavigateToResults(val examId: String) : ExamsEffect()
    data class ShowToast(val message: String) : ExamsEffect()
}
