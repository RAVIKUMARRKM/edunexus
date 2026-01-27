package com.edunexus.android.feature.classes.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.classes.data.repository.ClassRepository
import com.edunexus.android.feature.classes.data.repository.ClassRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Classes feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object ClassesModule {

    @Provides
    @Singleton
    fun provideClassRepository(
        apiService: ApiService
    ): ClassRepository {
        return ClassRepositoryImpl(apiService)
    }
}
