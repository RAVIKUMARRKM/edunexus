package com.edunexus.android.feature.classes.presentation.list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.ClassDto
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
 * ViewModel for Classes List Screen (MVI Pattern)
 */
@HiltViewModel
class ClassesViewModel @Inject constructor(
    private val repository: ClassRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ClassesUiState>(ClassesUiState.Loading)
    val uiState: StateFlow<ClassesUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ClassesEffect>()
    val effect = _effect.asSharedFlow()

    private var allClasses: List<ClassDto> = emptyList()
    private var currentSearch: String = ""

    init {
        loadClasses()
    }

    fun handleIntent(intent: ClassesIntent) {
        when (intent) {
            is ClassesIntent.LoadClasses -> loadClasses()
            is ClassesIntent.SearchClasses -> searchClasses(intent.query)
            is ClassesIntent.RefreshClasses -> refreshClasses()
            is ClassesIntent.NavigateToDetail -> navigateToDetail(intent.classId)
        }
    }

    private fun loadClasses() {
        viewModelScope.launch {
            _uiState.value = ClassesUiState.Loading

            repository.getClasses().fold(
                onSuccess = { classes ->
                    allClasses = classes
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = ClassesUiState.Error(
                        error.message ?: "Failed to load classes"
                    )
                }
            )
        }
    }

    private fun searchClasses(query: String) {
        currentSearch = query
        applyFilters()
    }

    private fun applyFilters() {
        val filtered = if (currentSearch.isEmpty()) {
            allClasses
        } else {
            allClasses.filter { classItem ->
                classItem.name.contains(currentSearch, ignoreCase = true) ||
                        classItem.grade.toString().contains(currentSearch) ||
                        (classItem.description?.contains(currentSearch, ignoreCase = true) == true)
            }
        }

        _uiState.value = if (filtered.isEmpty()) {
            ClassesUiState.Empty(
                message = if (currentSearch.isNotEmpty()) {
                    "No classes found for \"$currentSearch\""
                } else {
                    "No classes available"
                }
            )
        } else {
            ClassesUiState.Success(filtered)
        }
    }

    private fun refreshClasses() {
        loadClasses()
    }

    private fun navigateToDetail(classId: String) {
        viewModelScope.launch {
            _effect.emit(ClassesEffect.NavigateToDetail(classId))
        }
    }
}

/**
 * UI State for Classes List
 */
sealed class ClassesUiState {
    object Loading : ClassesUiState()
    data class Success(val classes: List<ClassDto>) : ClassesUiState()
    data class Empty(val message: String) : ClassesUiState()
    data class Error(val message: String) : ClassesUiState()
}

/**
 * User Intents for Classes List
 */
sealed class ClassesIntent {
    object LoadClasses : ClassesIntent()
    data class SearchClasses(val query: String) : ClassesIntent()
    object RefreshClasses : ClassesIntent()
    data class NavigateToDetail(val classId: String) : ClassesIntent()
}

/**
 * Side Effects for Classes List
 */
sealed class ClassesEffect {
    data class NavigateToDetail(val classId: String) : ClassesEffect()
    data class ShowToast(val message: String) : ClassesEffect()
}
