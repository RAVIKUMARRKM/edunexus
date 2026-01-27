package com.edunexus.android.feature.hr.di

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.hr.data.repository.HRRepository
import com.edunexus.android.feature.hr.data.repository.HRRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object HRModule {

    @Provides
    @Singleton
    fun provideHRRepository(apiService: ApiService): HRRepository {
        return HRRepositoryImpl(apiService)
    }
}
