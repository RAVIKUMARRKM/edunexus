package com.edunexus.android.feature.students.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.students.data.repository.StudentRepository
import com.edunexus.android.feature.students.data.repository.StudentRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Students feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object StudentsModule {

    @Provides
    @Singleton
    fun provideStudentRepository(
        apiService: ApiService
    ): StudentRepository {
        return StudentRepositoryImpl(apiService)
    }
}
