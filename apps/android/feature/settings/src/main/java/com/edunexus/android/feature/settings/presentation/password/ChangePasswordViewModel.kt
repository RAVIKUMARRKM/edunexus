package com.edunexus.android.feature.settings.presentation.password

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
 * ViewModel for Change Password Screen (MVI pattern)
 */
@HiltViewModel
class ChangePasswordViewModel @Inject constructor(
    private val repository: ProfileRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ChangePasswordUiState())
    val uiState: StateFlow<ChangePasswordUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<ChangePasswordEffect>()
    val effect = _effect.asSharedFlow()

    fun handleIntent(intent: ChangePasswordIntent) {
        when (intent) {
            is ChangePasswordIntent.CurrentPasswordChanged -> {
                _uiState.value = _uiState.value.copy(
                    currentPassword = intent.password,
                    currentPasswordError = null
                )
            }
            is ChangePasswordIntent.NewPasswordChanged -> {
                _uiState.value = _uiState.value.copy(
                    newPassword = intent.password,
                    newPasswordError = null
                )
                validateNewPassword(intent.password)
            }
            is ChangePasswordIntent.ConfirmPasswordChanged -> {
                _uiState.value = _uiState.value.copy(
                    confirmPassword = intent.password,
                    confirmPasswordError = null
                )
            }
            is ChangePasswordIntent.ChangePassword -> changePassword()
        }
    }

    private fun validateNewPassword(password: String) {
        val hasMinLength = password.length >= 8
        val hasUppercase = password.any { it.isUpperCase() }
        val hasNumber = password.any { it.isDigit() }

        _uiState.value = _uiState.value.copy(
            passwordRequirements = PasswordRequirements(
                hasMinLength = hasMinLength,
                hasUppercase = hasUppercase,
                hasNumber = hasNumber
            )
        )
    }

    private fun changePassword() {
        val state = _uiState.value

        // Validate current password
        if (state.currentPassword.isBlank()) {
            _uiState.value = state.copy(
                currentPasswordError = "Current password is required"
            )
            return
        }

        // Validate new password
        if (state.newPassword.isBlank()) {
            _uiState.value = state.copy(
                newPasswordError = "New password is required"
            )
            return
        }

        // Check password requirements
        if (!state.passwordRequirements.isValid()) {
            _uiState.value = state.copy(
                newPasswordError = "Password does not meet requirements"
            )
            return
        }

        // Validate confirm password
        if (state.confirmPassword.isBlank()) {
            _uiState.value = state.copy(
                confirmPasswordError = "Please confirm your new password"
            )
            return
        }

        // Check if passwords match
        if (state.newPassword != state.confirmPassword) {
            _uiState.value = state.copy(
                confirmPasswordError = "Passwords do not match"
            )
            return
        }

        // Check if new password is same as current
        if (state.currentPassword == state.newPassword) {
            _uiState.value = state.copy(
                newPasswordError = "New password must be different from current password"
            )
            return
        }

        // All validations passed, proceed with password change
        viewModelScope.launch {
            _uiState.value = state.copy(isLoading = true)

            repository.changePassword(state.currentPassword, state.newPassword)
                .onSuccess {
                    _uiState.value = state.copy(isLoading = false)
                    _effect.emit(ChangePasswordEffect.ShowToast("Password changed successfully"))
                    // Logout user and navigate to login
                    repository.logout()
                    _effect.emit(ChangePasswordEffect.NavigateToLogin)
                }
                .onFailure { error ->
                    _uiState.value = state.copy(
                        isLoading = false,
                        currentPasswordError = error.message ?: "Failed to change password"
                    )
                }
        }
    }
}

/**
 * UI State for Change Password Screen
 */
data class ChangePasswordUiState(
    val currentPassword: String = "",
    val newPassword: String = "",
    val confirmPassword: String = "",
    val currentPasswordError: String? = null,
    val newPasswordError: String? = null,
    val confirmPasswordError: String? = null,
    val passwordRequirements: PasswordRequirements = PasswordRequirements(),
    val isLoading: Boolean = false
)

/**
 * Password Requirements validation state
 */
data class PasswordRequirements(
    val hasMinLength: Boolean = false,
    val hasUppercase: Boolean = false,
    val hasNumber: Boolean = false
) {
    fun isValid(): Boolean = hasMinLength && hasUppercase && hasNumber
}

/**
 * User Intents for Change Password Screen
 */
sealed class ChangePasswordIntent {
    data class CurrentPasswordChanged(val password: String) : ChangePasswordIntent()
    data class NewPasswordChanged(val password: String) : ChangePasswordIntent()
    data class ConfirmPasswordChanged(val password: String) : ChangePasswordIntent()
    object ChangePassword : ChangePasswordIntent()
}

/**
 * Side Effects for Change Password Screen
 */
sealed class ChangePasswordEffect {
    object NavigateToLogin : ChangePasswordEffect()
    data class ShowToast(val message: String) : ChangePasswordEffect()
}
