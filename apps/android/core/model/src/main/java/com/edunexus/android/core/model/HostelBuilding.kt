package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.HostelType
import kotlinx.serialization.Serializable

@Serializable
data class HostelBuilding(
    val id: String,
    val name: String,
    val code: String,
    val type: HostelType,
    val wardenName: String? = null,
    val wardenPhone: String? = null,
    val capacity: Int,
    val address: String? = null,
    val createdAt: String,
    val updatedAt: String
)
