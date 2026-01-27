package com.edunexus.android.feature.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.model.enums.Role
import com.edunexus.android.feature.dashboard.data.model.DashboardStats
import com.edunexus.android.feature.dashboard.data.repository.DashboardRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Dashboard screen following MVI pattern
 */
@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: DashboardRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<DashboardUiState>(DashboardUiState.Loading)
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    private val _effect = Channel<DashboardEffect>(Channel.BUFFERED)
    val effect = _effect.receiveAsFlow()

    init {
        handleIntent(DashboardIntent.LoadStats)
    }

    /**
     * Handle user intents
     */
    fun handleIntent(intent: DashboardIntent) {
        when (intent) {
            is DashboardIntent.LoadStats -> loadStats()
            is DashboardIntent.RefreshStats -> refreshStats()
            is DashboardIntent.NavigateToModule -> navigateToModule(intent.module)
        }
    }

    /**
     * Load dashboard stats
     */
    private fun loadStats() {
        viewModelScope.launch {
            _uiState.value = DashboardUiState.Loading

            repository.getDashboardStats()
                .onSuccess { stats ->
                    _uiState.value = DashboardUiState.Success(stats)
                }
                .onFailure { error ->
                    _uiState.value = DashboardUiState.Error(
                        error.message ?: "Failed to load dashboard stats"
                    )
                }
        }
    }

    /**
     * Refresh dashboard stats
     */
    private fun refreshStats() {
        viewModelScope.launch {
            repository.getDashboardStats()
                .onSuccess { stats ->
                    _uiState.value = DashboardUiState.Success(stats)
                    _effect.send(DashboardEffect.ShowToast("Dashboard refreshed"))
                }
                .onFailure { error ->
                    _effect.send(
                        DashboardEffect.ShowToast(
                            error.message ?: "Failed to refresh dashboard"
                        )
                    )
                }
        }
    }

    /**
     * Navigate to a specific module
     */
    private fun navigateToModule(module: String) {
        viewModelScope.launch {
            _effect.send(DashboardEffect.NavigateToScreen(module))
        }
    }

    /**
     * Get filtered quick actions based on user role
     */
    fun getFilteredQuickActions(userRole: Role): List<QuickAction> {
        return quickActions.filter { action ->
            action.allowedRoles.contains(userRole)
        }
    }

    companion object {
        /**
         * Quick actions available on dashboard
         */
        val quickActions = listOf(
            QuickAction(
                icon = "school",
                label = "Students",
                route = "students",
                color = 0xFF3B82F6,
                allowedRoles = listOf(Role.ADMIN, Role.TEACHER, Role.PRINCIPAL)
            ),
            QuickAction(
                icon = "person",
                label = "Teachers",
                route = "teachers",
                color = 0xFF10B981,
                allowedRoles = listOf(Role.ADMIN, Role.PRINCIPAL)
            ),
            QuickAction(
                icon = "class",
                label = "Classes",
                route = "classes",
                color = 0xFF8B5CF6,
                allowedRoles = listOf(Role.ADMIN, Role.TEACHER, Role.PRINCIPAL)
            ),
            QuickAction(
                icon = "assignment",
                label = "Exams",
                route = "exams",
                color = 0xFFF59E0B,
                allowedRoles = listOf(
                    Role.ADMIN,
                    Role.TEACHER,
                    Role.STUDENT,
                    Role.PARENT,
                    Role.PRINCIPAL
                )
            ),
            QuickAction(
                icon = "payments",
                label = "Fees",
                route = "fees",
                color = 0xFFEF4444,
                allowedRoles = listOf(
                    Role.ADMIN,
                    Role.ACCOUNTANT,
                    Role.STUDENT,
                    Role.PARENT
                )
            ),
            QuickAction(
                icon = "library_books",
                label = "Library",
                route = "library",
                color = 0xFF6366F1,
                allowedRoles = listOf(
                    Role.ADMIN,
                    Role.LIBRARIAN,
                    Role.STUDENT,
                    Role.TEACHER
                )
            ),
            QuickAction(
                icon = "directions_bus",
                label = "Transport",
                route = "transport",
                color = 0xFF06B6D4,
                allowedRoles = listOf(
                    Role.ADMIN,
                    Role.TRANSPORT_MANAGER,
                    Role.STUDENT,
                    Role.PARENT
                )
            ),
            QuickAction(
                icon = "notifications",
                label = "Notices",
                route = "notices",
                color = 0xFFEC4899,
                allowedRoles = Role.values().toList() // All roles
            )
        )
    }
}

/**
 * UI State for Dashboard
 */
sealed class DashboardUiState {
    object Loading : DashboardUiState()
    data class Success(val stats: DashboardStats) : DashboardUiState()
    data class Error(val message: String) : DashboardUiState()
}

/**
 * User Intents for Dashboard
 */
sealed class DashboardIntent {
    object LoadStats : DashboardIntent()
    object RefreshStats : DashboardIntent()
    data class NavigateToModule(val module: String) : DashboardIntent()
}

/**
 * Side Effects for Dashboard
 */
sealed class DashboardEffect {
    data class NavigateToScreen(val route: String) : DashboardEffect()
    data class ShowToast(val message: String) : DashboardEffect()
}

/**
 * Quick Action data model
 */
data class QuickAction(
    val icon: String,
    val label: String,
    val route: String,
    val color: Long,
    val allowedRoles: List<Role>
)
