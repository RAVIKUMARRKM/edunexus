package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class Role {
    SUPER_ADMIN,
    ADMIN,
    PRINCIPAL,
    TEACHER,
    STUDENT,
    PARENT,
    STAFF,
    ACCOUNTANT,
    LIBRARIAN,
    TRANSPORT_MANAGER,
    HOSTEL_WARDEN
}
