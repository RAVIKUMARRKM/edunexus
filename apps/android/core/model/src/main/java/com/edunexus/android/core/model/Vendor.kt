package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Vendor(
    val id: String,
    val name: String,
    val code: String,
    val contactPerson: String? = null,
    val email: String? = null,
    val phone: String,
    val address: String? = null,
    val gstNo: String? = null,
    val panNo: String? = null,
    val bankDetails: String? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)
