package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Message(
    val id: String,
    val senderId: String,
    val receiverId: String,
    val subject: String? = null,
    val content: String,
    val isRead: Boolean = false,
    val readAt: String? = null,
    val attachmentUrl: String? = null,
    val createdAt: String
)
