package com.edunexus.android.feature.hr.data.repository

import com.edunexus.android.core.network.dto.EmployeeDto
import com.edunexus.android.core.network.dto.PayrollDto
import com.edunexus.android.core.network.dto.LeaveApplicationDto

interface HRRepository {
    suspend fun getEmployees(): Result<List<EmployeeDto>>
    suspend fun getEmployee(id: String): Result<EmployeeDto>
    suspend fun getPayroll(): Result<List<PayrollDto>>
    suspend fun getLeaveApplications(): Result<List<LeaveApplicationDto>>
}
