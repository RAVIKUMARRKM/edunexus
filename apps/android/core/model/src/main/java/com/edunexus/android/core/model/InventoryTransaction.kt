package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.TransactionType
import kotlinx.serialization.Serializable

@Serializable
data class InventoryTransaction(
    val id: String,
    val itemId: String,
    val type: TransactionType,
    val quantity: Int,
    val previousQty: Int,
    val newQty: Int,
    val reference: String? = null,
    val remarks: String? = null,
    val createdBy: String,
    val createdAt: String
)
