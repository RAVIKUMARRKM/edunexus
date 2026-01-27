package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class RouteStop(
    val id: String,
    val routeId: String,
    val name: String,
    val pickupTime: String,
    val dropTime: String,
    val fare: Double,
    val sequence: Int,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val createdAt: String
)
