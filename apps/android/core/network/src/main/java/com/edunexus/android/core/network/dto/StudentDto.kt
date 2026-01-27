package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Student DTO for network responses
 */
data class StudentDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("admissionNumber")
    val admissionNumber: String,
    @SerializedName("rollNo")
    val rollNo: String? = null,
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("dateOfBirth")
    val dateOfBirth: String,
    @SerializedName("gender")
    val gender: String,
    @SerializedName("bloodGroup")
    val bloodGroup: String? = null,
    @SerializedName("religion")
    val religion: String? = null,
    @SerializedName("caste")
    val caste: String? = null,
    @SerializedName("nationality")
    val nationality: String? = "Indian",
    @SerializedName("motherTongue")
    val motherTongue: String? = null,
    @SerializedName("photo")
    val photo: String? = null,
    @SerializedName("email")
    val email: String? = null,
    @SerializedName("phone")
    val phone: String? = null,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("city")
    val city: String? = null,
    @SerializedName("state")
    val state: String? = null,
    @SerializedName("pincode")
    val pincode: String? = null,
    @SerializedName("classId")
    val classId: String,
    @SerializedName("sectionId")
    val sectionId: String,
    @SerializedName("admissionDate")
    val admissionDate: String? = null,
    @SerializedName("previousSchool")
    val previousSchool: String? = null,
    @SerializedName("medicalConditions")
    val medicalConditions: String? = null,
    @SerializedName("allergies")
    val allergies: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("leftDate")
    val leftDate: String? = null,
    @SerializedName("leftReason")
    val leftReason: String? = null,
    @SerializedName("parentId")
    val parentId: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("class")
    val classInfo: ClassDto? = null,
    @SerializedName("section")
    val section: SectionDto? = null,
    @SerializedName("parent")
    val parent: ParentDto? = null
)

/**
 * Create/Update student request DTO
 */
data class StudentRequest(
    @SerializedName("admissionNumber")
    val admissionNumber: String,
    @SerializedName("rollNo")
    val rollNo: String? = null,
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("dateOfBirth")
    val dateOfBirth: String,
    @SerializedName("gender")
    val gender: String,
    @SerializedName("bloodGroup")
    val bloodGroup: String? = null,
    @SerializedName("religion")
    val religion: String? = null,
    @SerializedName("caste")
    val caste: String? = null,
    @SerializedName("nationality")
    val nationality: String? = "Indian",
    @SerializedName("motherTongue")
    val motherTongue: String? = null,
    @SerializedName("photo")
    val photo: String? = null,
    @SerializedName("email")
    val email: String? = null,
    @SerializedName("phone")
    val phone: String? = null,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("city")
    val city: String? = null,
    @SerializedName("state")
    val state: String? = null,
    @SerializedName("pincode")
    val pincode: String? = null,
    @SerializedName("classId")
    val classId: String,
    @SerializedName("sectionId")
    val sectionId: String,
    @SerializedName("admissionDate")
    val admissionDate: String? = null,
    @SerializedName("previousSchool")
    val previousSchool: String? = null,
    @SerializedName("medicalConditions")
    val medicalConditions: String? = null,
    @SerializedName("allergies")
    val allergies: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("leftDate")
    val leftDate: String? = null,
    @SerializedName("leftReason")
    val leftReason: String? = null,
    @SerializedName("parentId")
    val parentId: String? = null
)
