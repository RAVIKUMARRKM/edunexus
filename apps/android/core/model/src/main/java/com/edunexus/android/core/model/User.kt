package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.Role
import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String,
    val email: String,
    val password: String? = null,
    val name: String,
    val phone: String? = null,
    val avatar: String? = null,
    val role: Role = Role.STAFF,
    val isActive: Boolean = true,
    val emailVerified: String? = null,
    val forcePasswordChange: Boolean = true,
    val lastPasswordChange: String? = null,
    val createdAt: String,
    val updatedAt: String
)
