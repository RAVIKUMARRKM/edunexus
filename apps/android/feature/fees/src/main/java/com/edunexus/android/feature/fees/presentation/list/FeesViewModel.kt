package com.edunexus.android.feature.fees.presentation.list
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.FeeStatusDto
import com.edunexus.android.feature.fees.data.repository.FeeRepository
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
class FeesViewModel @Inject constructor(
    private val repository: FeeRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<FeesUiState>(FeesUiState.Loading)
    val uiState: StateFlow<FeesUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<FeesEffect>()
    val effect = _effect.asSharedFlow()

    private var allFeeStatuses: List<FeeStatusDto> = emptyList()
    private var currentStatus: String? = null
    private var currentSearch: String = ""

    init {
        loadFees()
    }

    fun handleIntent(intent: FeesIntent) {
        when (intent) {
            is FeesIntent.LoadFees -> loadFees()
            is FeesIntent.SearchFees -> searchFees(intent.query)
            is FeesIntent.FilterByStatus -> filterByStatus(intent.status)
            is FeesIntent.RefreshFees -> refreshFees()
            is FeesIntent.DeleteFee -> deleteFee(intent.studentId)
            is FeesIntent.NavigateToDetail -> navigateToDetail(intent.studentId)
            is FeesIntent.NavigateToPayment(studentId) -> navigateToAdd()
            is FeesIntent.NavigateToHistory -> navigateToEdit(intent.studentId)
        }
    }

    private fun loadFees() {
        viewModelScope.launch {
            _uiState.value = FeesUiState.Loading

            repository.getAllFeeStatuses(
                status = currentStatus,
                search = currentSearch.ifEmpty { null }
            ).fold(
                onSuccess = { students ->
                    allFeeStatuses = students
                    _uiState.value = if (students.isEmpty()) {
                        FeesUiState.Empty(
                            message = if (currentSearch.isNotEmpty()) {
                                "No fee records found for \"$currentSearch\""
                            } else if (currentStatus != null) {
                                "No $currentStatus fee records found"
                            } else {
                                "No fee records added yet"
                            }
                        )
                    } else {
                        FeesUiState.Success(students)
                    }
                },
                onFailure = { error ->
                    _uiState.value = FeesUiState.Error(
                        error.message ?: "Failed to load fees"
                    )
                }
            )
        }
    }

    private fun searchFees(query: String) {
        currentSearch = query
        loadFees()
    }

    private fun filterByStatus(status: String?) {
        currentStatus = status
        loadFees()
    }

    private fun refreshFees() {
        loadFees()
    }

    private fun deleteFee(studentId: String) {
        viewModelScope.launch {
            repository.deleteFee(studentId).fold(
                onSuccess = {
                    _effect.emit(FeesEffect.ShowToast("Fee deleted successfully"))
                    loadFees() // Reload the list
                },
                onFailure = { error ->
                    _effect.emit(
                        FeesEffect.ShowToast(
                            error.message ?: "Failed to delete fee"
                        )
                    )
                }
            )
        }
    }

    private fun navigateToDetail(studentId: String) {
        viewModelScope.launch {
            _effect.emit(FeesEffect.NavigateToDetail(studentId))
        }
    }

    private fun navigateToPayment(studentId: String) {
        viewModelScope.launch {
            _effect.emit(FeesEffect.NavigateToPayment(studentId))
        }
    }

    private fun navigateToHistory(studentId: String) {
        viewModelScope.launch {
            _effect.emit(FeesEffect.NavigateToHistory(studentId))
        }
    }
}

/**
 * UI State for Students List
 */
sealed class FeesUiState {
    object Loading : FeesUiState()
    data class Success(val feeStatuses: List<FeeStatusDto>) : FeesUiState()
    data class Empty(val message: String) : FeesUiState()
    data class Error(val message: String) : FeesUiState()
}

/**
 * User Intents for Students List
 */
sealed class FeesIntent {
    object LoadFees : FeesIntent()
    data class SearchFees(val query: String) : FeesIntent()
    data class FilterByStatus(val status: String?) : FeesIntent()
    object RefreshFees : FeesIntent()
    data class DeleteFee(val studentId: String) : FeesIntent()
    data class NavigateToDetail(val studentId: String) : FeesIntent()
    data class NavigateToPayment(val studentId: String) : FeesIntent()
    data class NavigateToHistory(val studentId: String) : FeesIntent()
}

/**
 * Side Effects for Students List
 */
sealed class FeesEffect {
    data class NavigateToDetail(val studentId: String) : FeesEffect()
    data class NavigateToPayment(val studentId: String) : FeesEffect()
    data class NavigateToHistory(val studentId: String) : FeesEffect()
    data class ShowToast(val message: String) : FeesEffect()
}
