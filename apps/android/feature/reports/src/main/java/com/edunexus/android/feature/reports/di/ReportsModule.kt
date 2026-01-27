package com.edunexus.android.feature.reports.di

import com.edunexus.android.feature.reports.data.repository.ReportsRepository
import com.edunexus.android.feature.reports.data.repository.ReportsRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object ReportsModule {

    @Provides
    @Singleton
    fun provideReportsRepository(): ReportsRepository {
        return ReportsRepositoryImpl()
    }
}
