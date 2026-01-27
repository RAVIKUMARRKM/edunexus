package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class PurchaseOrderItem(
    val id: String,
    val purchaseOrderId: String,
    val itemId: String,
    val quantity: Int,
    val unitPrice: Double,
    val totalPrice: Double,
    val receivedQty: Int = 0,
    val createdAt: String
)
