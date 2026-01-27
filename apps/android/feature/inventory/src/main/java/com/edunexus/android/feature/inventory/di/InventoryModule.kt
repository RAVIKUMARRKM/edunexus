package com.edunexus.android.feature.inventory.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.inventory.data.repository.InventoryRepository
import com.edunexus.android.feature.inventory.data.repository.InventoryRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for Inventory feature dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object InventoryModule {

    @Provides
    @Singleton
    fun provideInventoryRepository(
        apiService: ApiService
    ): InventoryRepository {
        return InventoryRepositoryImpl(apiService)
    }
}
