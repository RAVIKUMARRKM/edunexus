package com.edunexus.android.feature.hostel.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.hostel.data.repository.HostelRepository
import com.edunexus.android.feature.hostel.data.repository.HostelRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Hostel feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object HostelModule {

    @Provides
    @Singleton
    fun provideHostelRepository(
        apiService: ApiService
    ): HostelRepository {
        return HostelRepositoryImpl(apiService)
    }
}
