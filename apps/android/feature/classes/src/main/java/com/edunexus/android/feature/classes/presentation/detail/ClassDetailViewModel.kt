package com.edunexus.android.feature.classes.presentation.detail

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ClassDto
import com.edunexus.android.core.network.dto.SectionDto
import com.edunexus.android.feature.classes.data.repository.ClassRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Class Detail Screen (MVI Pattern)
 */
@HiltViewModel
class ClassDetailViewModel @Inject constructor(
    private val repository: ClassRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val classId: String = savedStateHandle.get<String>("classId")
        ?: throw IllegalArgumentException("Class ID is required")

    private val _uiState = MutableStateFlow<ClassDetailUiState>(ClassDetailUiState.Loading)
    val uiState: StateFlow<ClassDetailUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ClassDetailEffect>()
    val effect = _effect.asSharedFlow()

    init {
        loadClassDetails()
    }

    fun handleIntent(intent: ClassDetailIntent) {
        when (intent) {
            is ClassDetailIntent.LoadClass -> loadClassDetails()
            is ClassDetailIntent.NavigateBack -> navigateBack()
        }
    }

    private fun loadClassDetails() {
        viewModelScope.launch {
            _uiState.value = ClassDetailUiState.Loading

            // Load class details
            repository.getClass(classId).fold(
                onSuccess = { classDto ->
                    // Load sections for this class
                    repository.getSections(classId).fold(
                        onSuccess = { sections ->
                            _uiState.value = ClassDetailUiState.Success(
                                classItem = classDto,
                                sections = sections
                            )
                        },
                        onFailure = { error ->
                            // Show class details even if sections fail to load
                            _uiState.value = ClassDetailUiState.Success(
                                classItem = classDto,
                                sections = emptyList()
                            )
                            _effect.emit(
                                ClassDetailEffect.ShowToast(
                                    "Failed to load sections: ${error.message}"
                                )
                            )
                        }
                    )
                },
                onFailure = { error ->
                    _uiState.value = ClassDetailUiState.Error(
                        error.message ?: "Failed to load class details"
                    )
                }
            )
        }
    }

    private fun navigateBack() {
        viewModelScope.launch {
            _effect.emit(ClassDetailEffect.NavigateBack)
        }
    }
}

/**
 * UI State for Class Detail
 */
sealed class ClassDetailUiState {
    object Loading : ClassDetailUiState()
    data class Success(
        val classItem: ClassDto,
        val sections: List<SectionDto>
    ) : ClassDetailUiState()
    data class Error(val message: String) : ClassDetailUiState()
}

/**
 * User Intents for Class Detail
 */
sealed class ClassDetailIntent {
    object LoadClass : ClassDetailIntent()
    object NavigateBack : ClassDetailIntent()
}

/**
 * Side Effects for Class Detail
 */
sealed class ClassDetailEffect {
    object NavigateBack : ClassDetailEffect()
    data class ShowToast(val message: String) : ClassDetailEffect()
}
