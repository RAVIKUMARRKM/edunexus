package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Inventory Item DTO
 */
data class InventoryItemDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("itemCode")
    val itemCode: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String?,
    
    @SerializedName("category")
    val category: String,
    
    @SerializedName("unit")
    val unit: String,
    
    @SerializedName("quantity")
    val quantity: Int,
    
    @SerializedName("minStockLevel")
    val minStockLevel: Int,
    
    @SerializedName("maxStockLevel")
    val maxStockLevel: Int?,
    
    @SerializedName("unitPrice")
    val unitPrice: Double,
    
    @SerializedName("supplier")
    val supplier: String?,
    
    @SerializedName("location")
    val location: String?,
    
    @SerializedName("status")
    val status: String,
    
    @SerializedName("lastRestockDate")
    val lastRestockDate: String?,
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String
) {
    val stockStatus: StockStatus
        get() = when {
            quantity == 0 -> StockStatus.OUT_OF_STOCK
            quantity < minStockLevel -> StockStatus.LOW_STOCK
            else -> StockStatus.IN_STOCK
        }
    
    val totalValue: Double
        get() = quantity * unitPrice
}

/**
 * Stock Status Enum
 */
enum class StockStatus {
    IN_STOCK,
    LOW_STOCK,
    OUT_OF_STOCK
}

/**
 * Purchase Order DTO
 */
data class PurchaseOrderDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("orderNumber")
    val orderNumber: String,
    
    @SerializedName("supplier")
    val supplier: String,
    
    @SerializedName("items")
    val items: List<PurchaseOrderItemDto>,
    
    @SerializedName("totalAmount")
    val totalAmount: Double,
    
    @SerializedName("status")
    val status: String,
    
    @SerializedName("orderDate")
    val orderDate: String,
    
    @SerializedName("expectedDeliveryDate")
    val expectedDeliveryDate: String?,
    
    @SerializedName("actualDeliveryDate")
    val actualDeliveryDate: String?,
    
    @SerializedName("notes")
    val notes: String?,
    
    @SerializedName("createdBy")
    val createdBy: String,
    
    @SerializedName("createdAt")
    val createdAt: String,
    
    @SerializedName("updatedAt")
    val updatedAt: String
)

/**
 * Purchase Order Item DTO
 */
data class PurchaseOrderItemDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("itemId")
    val itemId: String,
    
    @SerializedName("itemName")
    val itemName: String,
    
    @SerializedName("quantity")
    val quantity: Int,
    
    @SerializedName("unitPrice")
    val unitPrice: Double,
    
    @SerializedName("totalPrice")
    val totalPrice: Double
)

/**
 * Inventory Category DTO
 */
data class InventoryCategoryDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String?,
    
    @SerializedName("itemCount")
    val itemCount: Int = 0
)

/**
 * Stock Transaction DTO
 */
data class StockTransactionDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("itemId")
    val itemId: String,
    
    @SerializedName("itemName")
    val itemName: String,
    
    @SerializedName("type")
    val type: String, // IN, OUT, ADJUSTMENT
    
    @SerializedName("quantity")
    val quantity: Int,
    
    @SerializedName("reason")
    val reason: String,
    
    @SerializedName("referenceNumber")
    val referenceNumber: String?,
    
    @SerializedName("performedBy")
    val performedBy: String,
    
    @SerializedName("date")
    val date: String,
    
    @SerializedName("createdAt")
    val createdAt: String
)
