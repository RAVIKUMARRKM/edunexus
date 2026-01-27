package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.core.model.enums.Gender
import kotlinx.serialization.Serializable

@Serializable
data class Staff(
    val id: String,
    val employeeId: String,
    val userId: String,

    // Personal Details
    val firstName: String,
    val lastName: String,
    val dateOfBirth: String,
    val gender: Gender,
    val photo: String? = null,

    // Contact
    val address: String? = null,
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null,

    // Professional Details
    val designation: String,
    val departmentId: String? = null,
    val joiningDate: String,

    // Salary
    val basicSalary: Double,

    // Status
    val status: EmployeeStatus = EmployeeStatus.ACTIVE,
    val leftDate: String? = null,

    val createdAt: String,
    val updatedAt: String
)
