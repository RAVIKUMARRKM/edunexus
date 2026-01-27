package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Employee DTO
 */
data class EmployeeDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("employeeId")
    val employeeId: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("department")
    val department: String,
    
    @SerializedName("designation")
    val designation: String,
    
    @SerializedName("joiningDate")
    val joiningDate: String,
    
    @SerializedName("status")
    val status: EmployeeStatus,
    
    @SerializedName("salary")
    val salary: Double? = null,
    
    @SerializedName("address")
    val address: String? = null,
    
    @SerializedName("dateOfBirth")
    val dateOfBirth: String? = null,
    
    @SerializedName("bloodGroup")
    val bloodGroup: String? = null,
    
    @SerializedName("emergencyContact")
    val emergencyContact: String? = null,
    
    @SerializedName("profileImage")
    val profileImage: String? = null
)

/**
 * Employee Status Enum
 */
enum class EmployeeStatus {
    @SerializedName("ACTIVE")
    ACTIVE,
    
    @SerializedName("ON_LEAVE")
    ON_LEAVE,
    
    @SerializedName("TERMINATED")
    TERMINATED
}

/**
 * Payroll DTO
 */
data class PayrollDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("employeeId")
    val employeeId: String,
    
    @SerializedName("employeeName")
    val employeeName: String,
    
    @SerializedName("month")
    val month: String,
    
    @SerializedName("year")
    val year: Int,
    
    @SerializedName("basicSalary")
    val basicSalary: Double,
    
    @SerializedName("allowances")
    val allowances: Double,
    
    @SerializedName("deductions")
    val deductions: Double,
    
    @SerializedName("netSalary")
    val netSalary: Double,
    
    @SerializedName("status")
    val status: PayrollStatus,
    
    @SerializedName("paidDate")
    val paidDate: String? = null
)

/**
 * Payroll Status Enum
 */
enum class PayrollStatus {
    @SerializedName("PENDING")
    PENDING,
    
    @SerializedName("PAID")
    PAID,
    
    @SerializedName("FAILED")
    FAILED
}

/**
 * Leave Application DTO
 */
data class LeaveApplicationDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("employeeId")
    val employeeId: String,
    
    @SerializedName("employeeName")
    val employeeName: String,
    
    @SerializedName("leaveType")
    val leaveType: LeaveType,
    
    @SerializedName("startDate")
    val startDate: String,
    
    @SerializedName("endDate")
    val endDate: String,
    
    @SerializedName("days")
    val days: Int,
    
    @SerializedName("reason")
    val reason: String,
    
    @SerializedName("status")
    val status: LeaveStatus,
    
    @SerializedName("appliedDate")
    val appliedDate: String,
    
    @SerializedName("approvedBy")
    val approvedBy: String? = null,
    
    @SerializedName("approvedDate")
    val approvedDate: String? = null,
    
    @SerializedName("remarks")
    val remarks: String? = null
)

/**
 * Leave Type Enum
 */
enum class LeaveType {
    @SerializedName("SICK")
    SICK,
    
    @SerializedName("CASUAL")
    CASUAL,
    
    @SerializedName("EARNED")
    EARNED,
    
    @SerializedName("MATERNITY")
    MATERNITY,
    
    @SerializedName("PATERNITY")
    PATERNITY
}

/**
 * Leave Status Enum
 */
enum class LeaveStatus {
    @SerializedName("PENDING")
    PENDING,
    
    @SerializedName("APPROVED")
    APPROVED,
    
    @SerializedName("REJECTED")
    REJECTED,
    
    @SerializedName("CANCELLED")
    CANCELLED
}

/**
 * Request DTOs
 */
data class EmployeeRequest(
    @SerializedName("employeeId")
    val employeeId: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("phone")
    val phone: String? = null,
    
    @SerializedName("department")
    val department: String,
    
    @SerializedName("designation")
    val designation: String,
    
    @SerializedName("joiningDate")
    val joiningDate: String,
    
    @SerializedName("salary")
    val salary: Double? = null
)

data class PayrollRequest(
    @SerializedName("employeeId")
    val employeeId: String,
    
    @SerializedName("month")
    val month: String,
    
    @SerializedName("year")
    val year: Int,
    
    @SerializedName("basicSalary")
    val basicSalary: Double,
    
    @SerializedName("allowances")
    val allowances: Double,
    
    @SerializedName("deductions")
    val deductions: Double
)

data class LeaveApplicationRequest(
    @SerializedName("employeeId")
    val employeeId: String,
    
    @SerializedName("leaveType")
    val leaveType: LeaveType,
    
    @SerializedName("startDate")
    val startDate: String,
    
    @SerializedName("endDate")
    val endDate: String,
    
    @SerializedName("reason")
    val reason: String
)
