package com.edunexus.android.feature.hostel.presentation.buildings

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.feature.hostel.presentation.components.BuildingCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BuildingsScreen(
    onNavigateToRooms: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: BuildingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is BuildingsEffect.NavigateToRooms -> onNavigateToRooms(effect.buildingId)
                is BuildingsEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Hostel Buildings") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(BuildingsIntent.RefreshBuildings) }) {
                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Refresh")
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
            SearchBar(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    viewModel.handleIntent(BuildingsIntent.SearchBuildings(it))
                },
                placeholder = "Search buildings...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is BuildingsUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }
                    is BuildingsUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items = state.buildings, key = { it.id }) { building ->
                                BuildingCard(
                                    building = building,
                                    onClick = {
                                        viewModel.handleIntent(BuildingsIntent.NavigateToRooms(building.id))
                                    }
                                )
                            }
                        }
                    }
                    is BuildingsUiState.Empty -> {
                        EmptyState(
                            title = "No Buildings Found",
                            description = state.message,
                            icon = Icons.Default.Apartment,
                            actionLabel = null,
                            onActionClick = null
                        )
                    }
                    is BuildingsUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = {
                                viewModel.handleIntent(BuildingsIntent.RefreshBuildings)
                            }
                        )
                    }
                }
            }
        }
    }
}
