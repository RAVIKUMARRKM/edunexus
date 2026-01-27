package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Login request DTO
 */
data class LoginRequest(
    @SerializedName("email")
    val email: String,
    @SerializedName("password")
    val password: String
)

/**
 * Auth response DTO
 */
data class AuthResponse(
    @SerializedName("token")
    val token: String,
    @SerializedName("user")
    val user: UserDto
)

/**
 * Change password request DTO
 */
data class ChangePasswordRequest(
    @SerializedName("currentPassword")
    val currentPassword: String,
    @SerializedName("newPassword")
    val newPassword: String
)
