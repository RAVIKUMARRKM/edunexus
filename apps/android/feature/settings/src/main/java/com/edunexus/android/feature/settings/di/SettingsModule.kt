package com.edunexus.android.feature.settings.di

import com.edunexus.android.core.datastore.PreferencesDataSource
import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.settings.data.repository.ProfileRepository
import com.edunexus.android.feature.settings.data.repository.ProfileRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object SettingsModule {

    @Provides
    @Singleton
    fun provideProfileRepository(
        apiService: ApiService,
        preferencesDataSource: PreferencesDataSource
    ): ProfileRepository {
        return ProfileRepositoryImpl(apiService, preferencesDataSource)
    }
}
