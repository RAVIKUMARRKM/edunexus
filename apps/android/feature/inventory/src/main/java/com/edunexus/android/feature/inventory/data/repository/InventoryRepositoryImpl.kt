package com.edunexus.android.feature.inventory.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.InventoryCategoryDto
import com.edunexus.android.core.network.dto.InventoryItemDto
import com.edunexus.android.core.network.dto.PurchaseOrderDto
import com.edunexus.android.core.network.dto.StockTransactionDto
import javax.inject.Inject

/**
 * Implementation of InventoryRepository using ApiService
 */
class InventoryRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : InventoryRepository {

    private var cachedItems: List<InventoryItemDto>? = null
    private var cachedCategories: List<InventoryCategoryDto>? = null
    private var cachedPurchaseOrders: List<PurchaseOrderDto>? = null

    override suspend fun getItems(): Result<List<InventoryItemDto>> {
        return try {
            val response = apiService.getInventoryItems()
            if (response.isSuccessful && response.body() != null) {
                cachedItems = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch inventory items: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getItem(id: String): Result<InventoryItemDto> {
        return try {
            // First try to get from cache
            cachedItems?.find { it.id == id }?.let {
                return Result.success(it)
            }

            // If not in cache, fetch from API
            val response = apiService.getInventoryItem(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch inventory item: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCategories(): Result<List<InventoryCategoryDto>> {
        return try {
            val response = apiService.getInventoryCategories()
            if (response.isSuccessful && response.body() != null) {
                cachedCategories = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch categories: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getPurchaseOrders(): Result<List<PurchaseOrderDto>> {
        return try {
            val response = apiService.getPurchaseOrders()
            if (response.isSuccessful && response.body() != null) {
                cachedPurchaseOrders = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch purchase orders: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getPurchaseOrder(id: String): Result<PurchaseOrderDto> {
        return try {
            // First try to get from cache
            cachedPurchaseOrders?.find { it.id == id }?.let {
                return Result.success(it)
            }

            // If not in cache, fetch from API
            val response = apiService.getPurchaseOrder(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch purchase order: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getStockTransactions(): Result<List<StockTransactionDto>> {
        return try {
            val response = apiService.getStockTransactions()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch stock transactions: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
