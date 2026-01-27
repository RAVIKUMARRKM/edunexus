package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class FeeType {
    TUITION,
    ADMISSION,
    TRANSPORT,
    HOSTEL,
    LIBRARY,
    LABORATORY,
    SPORTS,
    EXAM,
    OTHER
}
