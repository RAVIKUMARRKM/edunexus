package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Generic API response wrapper
 */
data class ApiResponse<T>(
    @SerializedName("data")
    val data: T? = null,
    @SerializedName("message")
    val message: String? = null,
    @SerializedName("success")
    val success: Boolean = true,
    @SerializedName("error")
    val error: String? = null
)

/**
 * Paginated response wrapper
 */
data class PaginatedResponse<T>(
    @SerializedName("data")
    val data: List<T>,
    @SerializedName("total")
    val total: Int,
    @SerializedName("page")
    val page: Int,
    @SerializedName("pageSize")
    val pageSize: Int,
    @SerializedName("totalPages")
    val totalPages: Int
)
