package com.edunexus.android.feature.dashboard.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.dashboard.data.repository.DashboardRepository
import com.edunexus.android.feature.dashboard.data.repository.DashboardRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Dashboard feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object DashboardModule {

    @Provides
    @Singleton
    fun provideDashboardRepository(
        apiService: ApiService
    ): DashboardRepository {
        return DashboardRepositoryImpl(apiService)
    }
}
