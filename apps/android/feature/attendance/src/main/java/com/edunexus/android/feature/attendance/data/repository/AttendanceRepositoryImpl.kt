package com.edunexus.android.feature.attendance.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.AttendanceDto
import com.edunexus.android.core.network.dto.MarkAttendanceRequest
import javax.inject.Inject

/**
 * Implementation of AttendanceRepository using ApiService
 */
class AttendanceRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : AttendanceRepository {

    override suspend fun getAttendance(
        date: String?,
        classId: String?,
        sectionId: String?,
        studentId: String?
    ): Result<List<AttendanceDto>> {
        return try {
            val params = buildMap {
                date?.let { put("date", it) }
                classId?.let { put("classId", it) }
                sectionId?.let { put("sectionId", it) }
                studentId?.let { put("studentId", it) }
            }

            val response = apiService.getAttendance(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch attendance: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun markAttendance(request: MarkAttendanceRequest): Result<Unit> {
        return try {
            val response = apiService.markAttendance(request)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to mark attendance: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
