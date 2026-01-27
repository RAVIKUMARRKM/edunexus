package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.Gender
import com.edunexus.android.core.model.enums.StudentStatus
import kotlinx.serialization.Serializable

@Serializable
data class Student(
    val id: String,
    val admissionNo: String,
    val rollNo: String? = null,
    val userId: String,

    // Personal Details
    val firstName: String,
    val lastName: String,
    val dateOfBirth: String,
    val gender: Gender,
    val bloodGroup: String? = null,
    val religion: String? = null,
    val caste: String? = null,
    val nationality: String = "Indian",
    val motherTongue: String? = null,
    val photo: String? = null,

    // Contact Details
    val address: String? = null,
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null,

    // Academic Details
    val classId: String? = null,
    val sectionId: String? = null,
    val admissionDate: String,
    val previousSchool: String? = null,

    // Medical Details
    val medicalConditions: String? = null,
    val allergies: String? = null,

    // Status
    val status: StudentStatus = StudentStatus.ACTIVE,
    val leftDate: String? = null,
    val leftReason: String? = null,

    val createdAt: String,
    val updatedAt: String
)
