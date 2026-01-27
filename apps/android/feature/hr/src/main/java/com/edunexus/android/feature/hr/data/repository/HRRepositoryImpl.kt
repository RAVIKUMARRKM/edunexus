package com.edunexus.android.feature.hr.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.EmployeeDto
import com.edunexus.android.core.network.dto.PayrollDto
import com.edunexus.android.core.network.dto.LeaveApplicationDto
import javax.inject.Inject

class HRRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : HRRepository {

    private var cachedEmployees: List<EmployeeDto>? = null

    override suspend fun getEmployees(): Result<List<EmployeeDto>> {
        return try {
            val mockEmployees = listOf(
                EmployeeDto(
                    id = "1",
                    employeeId = "EMP001",
                    name = "John Doe",
                    email = "john.doe@edunexus.com",
                    phone = "+1234567890",
                    department = "Computer Science",
                    designation = "Senior Teacher",
                    joiningDate = "2020-01-15",
                    status = com.edunexus.android.core.network.dto.EmployeeStatus.ACTIVE,
                    salary = 50000.0
                ),
                EmployeeDto(
                    id = "2",
                    employeeId = "EMP002",
                    name = "Jane Smith",
                    email = "jane.smith@edunexus.com",
                    phone = "+1234567891",
                    department = "Mathematics",
                    designation = "Department Head",
                    joiningDate = "2019-08-01",
                    status = com.edunexus.android.core.network.dto.EmployeeStatus.ACTIVE,
                    salary = 60000.0
                ),
                EmployeeDto(
                    id = "3",
                    employeeId = "EMP003",
                    name = "Mike Johnson",
                    email = "mike.johnson@edunexus.com",
                    phone = "+1234567892",
                    department = "Physics",
                    designation = "Teacher",
                    joiningDate = "2021-03-10",
                    status = com.edunexus.android.core.network.dto.EmployeeStatus.ON_LEAVE,
                    salary = 45000.0
                ),
                EmployeeDto(
                    id = "4",
                    employeeId = "EMP004",
                    name = "Sarah Williams",
                    email = "sarah.williams@edunexus.com",
                    phone = "+1234567893",
                    department = "Chemistry",
                    designation = "Lab Assistant",
                    joiningDate = "2022-01-05",
                    status = com.edunexus.android.core.network.dto.EmployeeStatus.ACTIVE,
                    salary = 35000.0
                )
            )
            cachedEmployees = mockEmployees
            Result.success(mockEmployees)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getEmployee(id: String): Result<EmployeeDto> {
        return try {
            cachedEmployees?.find { it.id == id }?.let {
                Result.success(it)
            } ?: run {
                val response = getEmployees()
                response.fold(
                    onSuccess = { employees ->
                        employees.find { it.id == id }?.let {
                            Result.success(it)
                        } ?: Result.failure(Exception("Employee not found"))
                    },
                    onFailure = { Result.failure(it) }
                )
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getPayroll(): Result<List<PayrollDto>> {
        return try {
            val mockPayroll = listOf(
                PayrollDto(
                    id = "1",
                    employeeId = "EMP001",
                    employeeName = "John Doe",
                    month = "January",
                    year = 2024,
                    basicSalary = 45000.0,
                    allowances = 5000.0,
                    deductions = 0.0,
                    netSalary = 50000.0,
                    status = com.edunexus.android.core.network.dto.PayrollStatus.PAID,
                    paidDate = "2024-01-31"
                ),
                PayrollDto(
                    id = "2",
                    employeeId = "EMP002",
                    employeeName = "Jane Smith",
                    month = "January",
                    year = 2024,
                    basicSalary = 55000.0,
                    allowances = 5000.0,
                    deductions = 0.0,
                    netSalary = 60000.0,
                    status = com.edunexus.android.core.network.dto.PayrollStatus.PENDING
                )
            )
            Result.success(mockPayroll)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getLeaveApplications(): Result<List<LeaveApplicationDto>> {
        return try {
            val mockLeaves = listOf(
                LeaveApplicationDto(
                    id = "1",
                    employeeId = "EMP003",
                    employeeName = "Mike Johnson",
                    leaveType = com.edunexus.android.core.network.dto.LeaveType.SICK,
                    startDate = "2024-02-01",
                    endDate = "2024-02-03",
                    days = 3,
                    reason = "Medical treatment",
                    status = com.edunexus.android.core.network.dto.LeaveStatus.APPROVED,
                    appliedDate = "2024-01-25",
                    approvedBy = "HR Manager",
                    approvedDate = "2024-01-26"
                ),
                LeaveApplicationDto(
                    id = "2",
                    employeeId = "EMP001",
                    employeeName = "John Doe",
                    leaveType = com.edunexus.android.core.network.dto.LeaveType.CASUAL,
                    startDate = "2024-02-10",
                    endDate = "2024-02-10",
                    days = 1,
                    reason = "Personal work",
                    status = com.edunexus.android.core.network.dto.LeaveStatus.PENDING,
                    appliedDate = "2024-02-05"
                )
            )
            Result.success(mockLeaves)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
