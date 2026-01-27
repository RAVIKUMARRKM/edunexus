package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Notice DTO for network responses
 */
data class NoticeDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("title")
    val title: String,
    @SerializedName("content")
    val content: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("priority")
    val priority: String,
    @SerializedName("publishDate")
    val publishDate: String,
    @SerializedName("expiryDate")
    val expiryDate: String? = null,
    @SerializedName("targetAudience")
    val targetAudience: String,
    @SerializedName("attachments")
    val attachments: List<String>? = null,
    @SerializedName("authorId")
    val authorId: String,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("author")
    val author: UserDto? = null
)
