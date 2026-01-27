package com.edunexus.android.feature.library.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.library.data.repository.LibraryRepository
import com.edunexus.android.feature.library.data.repository.LibraryRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Library feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object LibraryModule {

    @Provides
    @Singleton
    fun provideLibraryRepository(
        apiService: ApiService
    ): LibraryRepository {
        return LibraryRepositoryImpl(apiService)
    }
}
