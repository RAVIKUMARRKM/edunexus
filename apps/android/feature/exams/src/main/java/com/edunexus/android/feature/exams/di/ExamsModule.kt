package com.edunexus.android.feature.exams.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.exams.data.repository.ExamRepository
import com.edunexus.android.feature.exams.data.repository.ExamRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Exams feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object ExamsModule {

    @Provides
    @Singleton
    fun provideExamRepository(
        apiService: ApiService
    ): ExamRepository {
        return ExamRepositoryImpl(apiService)
    }
}
