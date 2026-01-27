package com.edunexus.android.feature.fees.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.fees.data.repository.FeeRepository
import com.edunexus.android.feature.fees.data.repository.FeeRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Fees feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object FeesModule {

    @Provides
    @Singleton
    fun provideFeeRepository(
        apiService: ApiService
    ): FeeRepository {
        return FeeRepositoryImpl(apiService)
    }
}
