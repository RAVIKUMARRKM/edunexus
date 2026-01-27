package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Parent(
    val id: String,
    val userId: String,

    // Father Details
    val fatherName: String? = null,
    val fatherPhone: String? = null,
    val fatherEmail: String? = null,
    val fatherOccupation: String? = null,

    // Mother Details
    val motherName: String? = null,
    val motherPhone: String? = null,
    val motherEmail: String? = null,
    val motherOccupation: String? = null,

    // Guardian Details
    val guardianName: String? = null,
    val guardianPhone: String? = null,
    val guardianRelation: String? = null,

    // Address
    val address: String? = null,
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null,

    val createdAt: String,
    val updatedAt: String
)
