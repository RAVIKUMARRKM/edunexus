package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.core.model.enums.Gender
import kotlinx.serialization.Serializable

@Serializable
data class Teacher(
    val id: String,
    val employeeId: String,
    val userId: String,

    // Personal Details
    val firstName: String,
    val lastName: String,
    val dateOfBirth: String,
    val gender: Gender,
    val bloodGroup: String? = null,
    val photo: String? = null,

    // Contact
    val address: String? = null,
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null,
    val emergencyContact: String? = null,

    // Professional Details
    val qualification: String,
    val specialization: String? = null,
    val experience: Int = 0,
    val joiningDate: String,
    val departmentId: String? = null,
    val designation: String? = null,

    // Salary Details
    val basicSalary: Double,

    // Status
    val status: EmployeeStatus = EmployeeStatus.ACTIVE,
    val leftDate: String? = null,

    val createdAt: String,
    val updatedAt: String
)
