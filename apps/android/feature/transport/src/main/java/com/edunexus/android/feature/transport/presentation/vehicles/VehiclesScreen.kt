package com.edunexus.android.feature.transport.presentation.vehicles

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
import androidx.compose.material.icons.filled.DirectionsBus
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
import com.edunexus.android.core.ui.component.FilterChipItem
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.core.ui.component.SingleSelectFilterChips
import com.edunexus.android.feature.transport.presentation.components.VehicleCard

/**
 * Vehicles List Screen
 * Displays all vehicles with search, filter operations
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VehiclesScreen(
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: VehiclesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    var searchQuery by remember { mutableStateOf("") }
    var selectedStatusFilter by remember { mutableStateOf<String?>(null) }
    var selectedTypeFilter by remember { mutableStateOf<String?>(null) }

    // Handle side effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is VehiclesEffect.NavigateToDetail -> onNavigateToDetail(effect.vehicleId)
                is VehiclesEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Vehicles") },
                actions = {
                    // Refresh button
                    IconButton(onClick = { viewModel.handleIntent(VehiclesIntent.RefreshVehicles) }) {
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
                    viewModel.handleIntent(VehiclesIntent.SearchVehicles(it))
                },
                placeholder = "Search vehicles...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Status Filter Chips
            val statusFilterChips = listOf(
                FilterChipItem("all", "ALL", selected = selectedStatusFilter == null),
                FilterChipItem("active", "ACTIVE", selected = selectedStatusFilter == "ACTIVE"),
                FilterChipItem("inactive", "INACTIVE", selected = selectedStatusFilter == "INACTIVE"),
                FilterChipItem("maintenance", "MAINTENANCE", selected = selectedStatusFilter == "MAINTENANCE"),
                FilterChipItem("out_of_service", "OUT OF SERVICE", selected = selectedStatusFilter == "OUT_OF_SERVICE")
            )

            SingleSelectFilterChips(
                chips = statusFilterChips,
                selectedId = selectedStatusFilter,
                onChipSelected = { chip ->
                    val newFilter = if (chip.id == "all") null else chip.label
                    selectedStatusFilter = newFilter
                    viewModel.handleIntent(VehiclesIntent.FilterByStatus(newFilter))
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Type Filter Chips
            val typeFilterChips = listOf(
                FilterChipItem("all_types", "ALL TYPES", selected = selectedTypeFilter == null),
                FilterChipItem("bus", "BUS", selected = selectedTypeFilter == "BUS"),
                FilterChipItem("van", "VAN", selected = selectedTypeFilter == "VAN"),
                FilterChipItem("car", "CAR", selected = selectedTypeFilter == "CAR")
            )

            SingleSelectFilterChips(
                chips = typeFilterChips,
                selectedId = selectedTypeFilter,
                onChipSelected = { chip ->
                    val newFilter = if (chip.id == "all_types") null else chip.label
                    selectedTypeFilter = newFilter
                    viewModel.handleIntent(VehiclesIntent.FilterByType(newFilter))
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Content based on state
            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is VehiclesUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }

                    is VehiclesUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(
                                items = state.vehicles,
                                key = { it.id }
                            ) { vehicle ->
                                VehicleCard(
                                    vehicle = vehicle,
                                    onClick = {
                                        viewModel.handleIntent(
                                            VehiclesIntent.NavigateToDetail(vehicle.id)
                                        )
                                    }
                                )
                            }
                        }
                    }

                    is VehiclesUiState.Empty -> {
                        EmptyState(
                            title = "No Vehicles Found",
                            description = state.message,
                            icon = Icons.Default.DirectionsBus,
                            actionLabel = null,
                            onActionClick = null
                        )
                    }

                    is VehiclesUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = {
                                viewModel.handleIntent(VehiclesIntent.RefreshVehicles)
                            }
                        )
                    }
                }
            }
        }
    }
}
