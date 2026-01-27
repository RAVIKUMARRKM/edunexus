package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Teacher DTO for network responses
 */
data class TeacherDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("employeeId")
    val employeeId: String,
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("phone")
    val phone: String? = null,
    @SerializedName("dateOfBirth")
    val dateOfBirth: String? = null,
    @SerializedName("gender")
    val gender: String,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("photo")
    val photo: String? = null,
    @SerializedName("qualification")
    val qualification: String? = null,
    @SerializedName("experience")
    val experience: Int? = null,
    @SerializedName("joiningDate")
    val joiningDate: String? = null,
    @SerializedName("departmentId")
    val departmentId: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("department")
    val department: DepartmentDto? = null
)
