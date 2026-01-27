package com.edunexus.android.core.network.dto

/**
 * Inventory Request Models
 */

data class InventoryItemRequest(
    val itemCode: String,
    val name: String,
    val description: String?,
    val category: String,
    val unit: String,
    val quantity: Int,
    val minStockLevel: Int,
    val maxStockLevel: Int?,
    val unitPrice: Double,
    val supplier: String?,
    val location: String?
)

data class PurchaseOrderRequest(
    val supplier: String,
    val items: List<PurchaseOrderItemRequest>,
    val expectedDeliveryDate: String?,
    val notes: String?
)

data class PurchaseOrderItemRequest(
    val itemId: String,
    val quantity: Int,
    val unitPrice: Double
)

data class UpdateOrderStatusRequest(
    val status: String,
    val actualDeliveryDate: String?,
    val notes: String?
)

data class StockTransactionRequest(
    val itemId: String,
    val type: String,
    val quantity: Int,
    val reason: String,
    val referenceNumber: String?
)
