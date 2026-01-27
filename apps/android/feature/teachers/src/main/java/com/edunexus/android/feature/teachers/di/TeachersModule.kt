package com.edunexus.android.feature.teachers.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.teachers.data.repository.TeacherRepository
import com.edunexus.android.feature.teachers.data.repository.TeacherRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Dagger Hilt module for Teachers feature
 */
@Module
@InstallIn(SingletonComponent::class)
object TeachersModule {

    @Provides
    @Singleton
    fun provideTeacherRepository(
        apiService: ApiService
    ): TeacherRepository {
        return TeacherRepositoryImpl(apiService)
    }
}
