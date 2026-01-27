package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.PickupType
import kotlinx.serialization.Serializable

@Serializable
data class TransportAllocation(
    val id: String,
    val studentId: String,
    val routeId: String,
    val stopId: String,
    val pickupType: PickupType = PickupType.BOTH,
    val validFrom: String,
    val validTo: String? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)
