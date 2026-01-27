package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class PasswordResetToken(
    val id: String,
    val userId: String,
    val token: String,
    val expiresAt: String,
    val createdAt: String,
    val used: Boolean = false
)
