package com.edunexus.android.feature.attendance.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.attendance.data.repository.AttendanceRepository
import com.edunexus.android.feature.attendance.data.repository.AttendanceRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Attendance feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object AttendanceModule {

    @Provides
    @Singleton
    fun provideAttendanceRepository(
        apiService: ApiService
    ): AttendanceRepository {
        return AttendanceRepositoryImpl(apiService)
    }
}
