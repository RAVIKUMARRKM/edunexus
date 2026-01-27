package com.edunexus.android.core.datastore.di

import android.content.Context
import com.edunexus.android.core.datastore.PreferencesDataSource
import com.edunexus.android.core.common.auth.TokenProvider
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DataStoreModule {

    @Provides
    @Singleton
    fun providePreferencesDataSource(
        @ApplicationContext context: Context
    ): PreferencesDataSource {
        return PreferencesDataSource(context)
    }
}

@Module
@InstallIn(SingletonComponent::class)
abstract class DataStoreBindsModule {

    @Binds
    @Singleton
    abstract fun bindTokenProvider(
        preferencesDataSource: PreferencesDataSource
    ): TokenProvider
}
