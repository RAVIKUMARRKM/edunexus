package com.edunexus.android.feature.classes.presentation.list

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Class
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.feature.classes.presentation.components.ClassCard

/**
 * Classes List Screen
 * Displays all classes with search and view operations
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClassesScreen(
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ClassesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    var searchQuery by remember { mutableStateOf("") }

    // Handle side effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is ClassesEffect.NavigateToDetail -> onNavigateToDetail(effect.classId)
                is ClassesEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Classes") },
                actions = {
                    // Refresh button
                    IconButton(onClick = { viewModel.handleIntent(ClassesIntent.RefreshClasses) }) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Search Bar
            SearchBar(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    viewModel.handleIntent(ClassesIntent.SearchClasses(it))
                },
                placeholder = "Search classes...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Content based on state
            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is ClassesUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }

                    is ClassesUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(
                                items = state.classes,
                                key = { it.id }
                            ) { classItem ->
                                ClassCard(
                                    classItem = classItem,
                                    onClick = {
                                        viewModel.handleIntent(
                                            ClassesIntent.NavigateToDetail(classItem.id)
                                        )
                                    }
                                )
                            }
                        }
                    }

                    is ClassesUiState.Empty -> {
                        EmptyState(
                            title = "No Classes Found",
                            description = state.message,
                            icon = Icons.Default.Class,
                            actionLabel = null,
                            onActionClick = null
                        )
                    }

                    is ClassesUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = {
                                viewModel.handleIntent(ClassesIntent.RefreshClasses)
                            }
                        )
                    }
                }
            }
        }
    }
}
