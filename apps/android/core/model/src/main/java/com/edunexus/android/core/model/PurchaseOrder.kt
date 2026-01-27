package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.POStatus
import kotlinx.serialization.Serializable

@Serializable
data class PurchaseOrder(
    val id: String,
    val poNumber: String,
    val vendorId: String,
    val orderDate: String,
    val expectedDate: String? = null,
    val totalAmount: Double,
    val status: POStatus = POStatus.DRAFT,
    val approvedBy: String? = null,
    val approvedAt: String? = null,
    val remarks: String? = null,
    val createdAt: String,
    val updatedAt: String
)
