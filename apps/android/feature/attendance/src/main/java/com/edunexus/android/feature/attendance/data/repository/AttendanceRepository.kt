package com.edunexus.android.feature.attendance.data.repository

import com.edunexus.android.core.network.dto.AttendanceDto
import com.edunexus.android.core.network.dto.MarkAttendanceRequest

/**
 * Repository interface for Attendance operations
 */
interface AttendanceRepository {
    /**
     * Get attendance records with optional filters
     * @param date Filter by date (YYYY-MM-DD)
     * @param classId Filter by class ID
     * @param sectionId Filter by section ID
     * @param studentId Filter by student ID
     */
    suspend fun getAttendance(
        date: String? = null,
        classId: String? = null,
        sectionId: String? = null,
        studentId: String? = null
    ): Result<List<AttendanceDto>>

    /**
     * Mark attendance for a class
     */
    suspend fun markAttendance(request: MarkAttendanceRequest): Result<Unit>
}
