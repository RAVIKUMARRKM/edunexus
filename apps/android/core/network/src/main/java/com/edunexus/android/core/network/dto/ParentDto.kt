package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Parent DTO for network responses
 */
data class ParentDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("fatherName")
    val fatherName: String? = null,
    @SerializedName("motherName")
    val motherName: String? = null,
    @SerializedName("guardianName")
    val guardianName: String? = null,
    @SerializedName("relationship")
    val relationship: String? = null,
    @SerializedName("email")
    val email: String? = null,
    @SerializedName("phone")
    val phone: String,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("occupation")
    val occupation: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Create/Update parent request DTO
 */
data class ParentRequest(
    @SerializedName("fatherName")
    val fatherName: String? = null,
    @SerializedName("motherName")
    val motherName: String? = null,
    @SerializedName("guardianName")
    val guardianName: String? = null,
    @SerializedName("relationship")
    val relationship: String? = null,
    @SerializedName("email")
    val email: String? = null,
    @SerializedName("phone")
    val phone: String,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("occupation")
    val occupation: String? = null
)
