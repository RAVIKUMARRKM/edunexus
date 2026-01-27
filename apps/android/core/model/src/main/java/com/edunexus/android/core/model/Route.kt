package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Route(
    val id: String,
    val name: String,
    val routeNo: String,
    val vehicleId: String,
    val startPoint: String,
    val endPoint: String,
    val distance: Double? = null,
    val createdAt: String,
    val updatedAt: String
)
