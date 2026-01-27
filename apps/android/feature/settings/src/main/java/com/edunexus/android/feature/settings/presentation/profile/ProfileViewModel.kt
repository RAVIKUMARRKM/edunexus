package com.edunexus.android.feature.settings.presentation.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.model.User
import com.edunexus.android.feature.settings.data.repository.ProfileRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Profile Screen (MVI pattern)
 */
@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val repository: ProfileRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ProfileUiState>(ProfileUiState.Loading)
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ProfileEffect>()
    val effect = _effect.asSharedFlow()

    init {
        handleIntent(ProfileIntent.LoadProfile)
    }

    fun handleIntent(intent: ProfileIntent) {
        when (intent) {
            is ProfileIntent.LoadProfile -> loadProfile()
            is ProfileIntent.UpdateProfile -> updateProfile(intent.name, intent.phone, intent.avatar)
            is ProfileIntent.Logout -> logout()
        }
    }

    private fun loadProfile() {
        viewModelScope.launch {
            _uiState.value = ProfileUiState.Loading

            // First, load cached user data
            val cachedUser = repository.getCachedUser()
            if (cachedUser != null) {
                _uiState.value = ProfileUiState.Success(cachedUser)
            }

            // Then fetch fresh data from API
            repository.getProfile()
                .onSuccess { user ->
                    _uiState.value = ProfileUiState.Success(user)
                }
                .onFailure { error ->
                    // Only show error if we don't have cached data
                    if (cachedUser == null) {
                        _uiState.value = ProfileUiState.Error(
                            error.message ?: "Failed to load profile"
                        )
                    } else {
                        // Still show cached data but emit a toast
                        _effect.emit(ProfileEffect.ShowToast("Unable to refresh profile"))
                    }
                }
        }
    }

    private fun updateProfile(name: String?, phone: String?, avatar: String?) {
        viewModelScope.launch {
            val currentState = _uiState.value
            if (currentState !is ProfileUiState.Success) return@launch

            _uiState.value = ProfileUiState.Loading

            repository.updateProfile(name, phone, avatar)
                .onSuccess { user ->
                    _uiState.value = ProfileUiState.Success(user)
                    _effect.emit(ProfileEffect.ShowToast("Profile updated successfully"))
                    _effect.emit(ProfileEffect.NavigateBack)
                }
                .onFailure { error ->
                    _uiState.value = ProfileUiState.Success(currentState.user)
                    _effect.emit(ProfileEffect.ShowToast(
                        error.message ?: "Failed to update profile"
                    ))
                }
        }
    }

    private fun logout() {
        viewModelScope.launch {
            repository.logout()
            _effect.emit(ProfileEffect.NavigateToLogin)
        }
    }
}

/**
 * UI State for Profile Screen
 */
sealed class ProfileUiState {
    object Loading : ProfileUiState()
    data class Success(val user: User) : ProfileUiState()
    data class Error(val message: String) : ProfileUiState()
}

/**
 * User Intents for Profile Screen
 */
sealed class ProfileIntent {
    object LoadProfile : ProfileIntent()
    data class UpdateProfile(
        val name: String?,
        val phone: String?,
        val avatar: String?
    ) : ProfileIntent()
    object Logout : ProfileIntent()
}

/**
 * Side Effects for Profile Screen
 */
sealed class ProfileEffect {
    object NavigateToLogin : ProfileEffect()
    object NavigateBack : ProfileEffect()
    data class ShowToast(val message: String) : ProfileEffect()
}
