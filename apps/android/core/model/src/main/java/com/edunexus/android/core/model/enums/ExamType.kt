package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class ExamType {
    UNIT_TEST,
    MID_TERM,
    FINAL,
    PRACTICAL,
    ASSIGNMENT
}
