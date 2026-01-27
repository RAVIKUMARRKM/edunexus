package com.edunexus.android.feature.communication.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.communication.data.repository.CommunicationRepository
import com.edunexus.android.feature.communication.data.repository.CommunicationRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Communication feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object CommunicationModule {

    @Provides
    @Singleton
    fun provideCommunicationRepository(
        apiService: ApiService
    ): CommunicationRepository {
        return CommunicationRepositoryImpl(apiService)
    }
}
