package com.edunexus.android.feature.inventory.data.repository

import com.edunexus.android.core.network.dto.InventoryCategoryDto
import com.edunexus.android.core.network.dto.InventoryItemDto
import com.edunexus.android.core.network.dto.PurchaseOrderDto
import com.edunexus.android.core.network.dto.StockTransactionDto

/**
 * Repository interface for Inventory operations
 */
interface InventoryRepository {
    /**
     * Get all inventory items
     */
    suspend fun getItems(): Result<List<InventoryItemDto>>

    /**
     * Get a single inventory item by ID
     */
    suspend fun getItem(id: String): Result<InventoryItemDto>

    /**
     * Get all inventory categories
     */
    suspend fun getCategories(): Result<List<InventoryCategoryDto>>

    /**
     * Get all purchase orders
     */
    suspend fun getPurchaseOrders(): Result<List<PurchaseOrderDto>>

    /**
     * Get a single purchase order by ID
     */
    suspend fun getPurchaseOrder(id: String): Result<PurchaseOrderDto>

    /**
     * Get stock transactions
     */
    suspend fun getStockTransactions(): Result<List<StockTransactionDto>>
}
