package com.edunexus.android.feature.settings.data.repository

import com.edunexus.android.core.datastore.PreferencesDataSource
import com.edunexus.android.core.model.User
import com.edunexus.android.core.model.enums.Role
import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.ChangePasswordRequest
import com.edunexus.android.core.network.dto.UpdateProfileRequest
import kotlinx.coroutines.flow.firstOrNull
import retrofit2.Response
import javax.inject.Inject

/**
 * Implementation of ProfileRepository
 */
class ProfileRepositoryImpl @Inject constructor(
    private val apiService: ApiService,
    private val preferencesDataSource: PreferencesDataSource
) : ProfileRepository {

    override suspend fun getProfile(): Result<User> {
        return try {
            val response = apiService.getProfile()
            if (response.isSuccessful && response.body() != null) {
                val userDto = response.body()!!

                // Update cached user data
                preferencesDataSource.saveUser(
                    id = userDto.id,
                    email = userDto.email,
                    name = userDto.name,
                    role = userDto.role,
                    phone = userDto.phone,
                    avatar = userDto.avatar
                )

                // Convert DTO to domain model
                val user = User(
                    id = userDto.id,
                    email = userDto.email,
                    name = userDto.name,
                    role = Role.valueOf(userDto.role.uppercase()),
                    phone = userDto.phone,
                    avatar = userDto.avatar,
                    isActive = true,
                    emailVerified = userDto.createdAt,
                    forcePasswordChange = false,
                    lastPasswordChange = userDto.updatedAt,
                    createdAt = userDto.createdAt ?: "",
                    updatedAt = userDto.updatedAt ?: ""
                )

                Result.success(user)
            } else {
                Result.failure(Exception("Failed to get profile: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateProfile(
        name: String?,
        phone: String?,
        avatar: String?
    ): Result<User> {
        return try {
            val request = UpdateProfileRequest(
                name = name,
                phone = phone,
                avatar = avatar
            )

            val response = apiService.updateProfile(request)
            if (response.isSuccessful && response.body() != null) {
                val userDto = response.body()!!

                // Update cached user data
                preferencesDataSource.saveUser(
                    id = userDto.id,
                    email = userDto.email,
                    name = userDto.name,
                    role = userDto.role,
                    phone = userDto.phone,
                    avatar = userDto.avatar
                )

                // Convert DTO to domain model
                val user = User(
                    id = userDto.id,
                    email = userDto.email,
                    name = userDto.name,
                    role = Role.valueOf(userDto.role.uppercase()),
                    phone = userDto.phone,
                    avatar = userDto.avatar,
                    isActive = true,
                    emailVerified = userDto.createdAt,
                    forcePasswordChange = false,
                    lastPasswordChange = userDto.updatedAt,
                    createdAt = userDto.createdAt ?: "",
                    updatedAt = userDto.updatedAt ?: ""
                )

                Result.success(user)
            } else {
                Result.failure(Exception("Failed to update profile: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun changePassword(
        currentPassword: String,
        newPassword: String
    ): Result<Unit> {
        return try {
            val request = ChangePasswordRequest(
                currentPassword = currentPassword,
                newPassword = newPassword
            )

            val response = apiService.changePassword(request)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to change password: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCachedUser(): User? {
        return try {
            val id = preferencesDataSource.getUserId().firstOrNull() ?: return null
            val email = preferencesDataSource.getUserEmail().firstOrNull() ?: return null
            val name = preferencesDataSource.getUserName().firstOrNull() ?: return null
            val roleStr = preferencesDataSource.getUserRole().firstOrNull() ?: return null
            val phone = preferencesDataSource.getUserPhone().firstOrNull()
            val avatar = preferencesDataSource.getUserAvatar().firstOrNull()

            User(
                id = id,
                email = email,
                name = name,
                role = Role.valueOf(roleStr.uppercase()),
                phone = phone,
                avatar = avatar,
                isActive = true,
                emailVerified = null,
                forcePasswordChange = false,
                lastPasswordChange = null,
                createdAt = "",
                updatedAt = ""
            )
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun logout() {
        preferencesDataSource.clearAll()
    }
}
