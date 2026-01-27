package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class NoticeType {
    GENERAL,
    ACADEMIC,
    EXAM,
    EVENT,
    HOLIDAY,
    EMERGENCY,
    FEE_REMINDER
}
