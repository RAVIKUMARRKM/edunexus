package com.edunexus.android.feature.settings.data.repository

import com.edunexus.android.core.model.User
import com.edunexus.android.core.network.dto.ChangePasswordRequest
import com.edunexus.android.core.network.dto.UpdateProfileRequest

/**
 * Repository interface for profile operations
 */
interface ProfileRepository {
    /**
     * Get user profile from API
     */
    suspend fun getProfile(): Result<User>

    /**
     * Update user profile
     */
    suspend fun updateProfile(
        name: String?,
        phone: String?,
        avatar: String?
    ): Result<User>

    /**
     * Change user password
     */
    suspend fun changePassword(
        currentPassword: String,
        newPassword: String
    ): Result<Unit>

    /**
     * Get cached user data from DataStore
     */
    suspend fun getCachedUser(): User?

    /**
     * Logout and clear all data
     */
    suspend fun logout()
}
