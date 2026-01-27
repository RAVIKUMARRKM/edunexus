package com.edunexus.android.feature.classes.data.repository

import com.edunexus.android.core.network.dto.ClassDto
import com.edunexus.android.core.network.dto.SectionDto

/**
 * Repository interface for Class operations
 */
interface ClassRepository {
    /**
     * Get all classes
     */
    suspend fun getClasses(): Result<List<ClassDto>>

    /**
     * Get sections for a specific class
     */
    suspend fun getSections(classId: String): Result<List<SectionDto>>

    /**
     * Get a single class by ID (from cached list)
     */
    suspend fun getClass(id: String): Result<ClassDto>
}
