package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class PickupType {
    PICKUP_ONLY,
    DROP_ONLY,
    BOTH
}
