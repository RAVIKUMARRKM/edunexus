package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Department DTO for network responses
 */
data class DepartmentDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("code")
    val code: String,
    @SerializedName("description")
    val description: String? = null,
    @SerializedName("hodId")
    val hodId: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("hod")
    val hod: TeacherDto? = null
)
