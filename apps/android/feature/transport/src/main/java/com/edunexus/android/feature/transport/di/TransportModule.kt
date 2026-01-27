package com.edunexus.android.feature.transport.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.transport.data.repository.TransportRepository
import com.edunexus.android.feature.transport.data.repository.TransportRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Transport feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object TransportModule {

    @Provides
    @Singleton
    fun provideTransportRepository(
        apiService: ApiService
    ): TransportRepository {
        return TransportRepositoryImpl(apiService)
    }
}
