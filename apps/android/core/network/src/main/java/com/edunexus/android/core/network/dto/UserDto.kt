package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * User DTO for network responses
 */
data class UserDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("role")
    val role: String,
    @SerializedName("phone")
    val phone: String? = null,
    @SerializedName("avatar")
    val avatar: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Update profile request DTO
 */
data class UpdateProfileRequest(
    @SerializedName("name")
    val name: String? = null,
    @SerializedName("phone")
    val phone: String? = null,
    @SerializedName("avatar")
    val avatar: String? = null
)
