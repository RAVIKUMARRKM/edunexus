package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Message DTO for network responses
 */
data class MessageDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("subject")
    val subject: String,
    @SerializedName("content")
    val content: String,
    @SerializedName("senderId")
    val senderId: String,
    @SerializedName("recipientId")
    val recipientId: String,
    @SerializedName("read")
    val read: Boolean,
    @SerializedName("readAt")
    val readAt: String? = null,
    @SerializedName("attachments")
    val attachments: List<String>? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("sender")
    val sender: UserDto? = null,
    @SerializedName("recipient")
    val recipient: UserDto? = null
)

/**
 * Send message request DTO
 */
data class SendMessageRequest(
    @SerializedName("subject")
    val subject: String,
    @SerializedName("content")
    val content: String,
    @SerializedName("recipientId")
    val recipientId: String,
    @SerializedName("attachments")
    val attachments: List<String>? = null
)
