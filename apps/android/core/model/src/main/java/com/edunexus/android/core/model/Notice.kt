package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.NoticeType
import com.edunexus.android.core.model.enums.Role
import kotlinx.serialization.Serializable

@Serializable
data class Notice(
    val id: String,
    val title: String,
    val content: String,
    val type: NoticeType,
    val targetRoles: List<Role>,
    val targetClasses: List<String>,
    val attachmentUrl: String? = null,
    val isPublished: Boolean = false,
    val publishedAt: String? = null,
    val expiresAt: String? = null,
    val createdBy: String,
    val createdAt: String,
    val updatedAt: String
)
