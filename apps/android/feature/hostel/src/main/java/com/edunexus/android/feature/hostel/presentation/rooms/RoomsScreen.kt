package com.edunexus.android.feature.hostel.presentation.rooms

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MeetingRoom
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
import com.edunexus.android.feature.hostel.presentation.components.RoomCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoomsScreen(
    buildingId: String? = null,
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: RoomsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(buildingId) {
        if (buildingId != null) {
            viewModel.handleIntent(RoomsIntent.LoadRooms(buildingId))
        }
    }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is RoomsEffect.NavigateToDetail -> onNavigateToDetail(effect.roomId)
                is RoomsEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Hostel Rooms") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(RoomsIntent.RefreshRooms) }) {
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
                    viewModel.handleIntent(RoomsIntent.SearchRooms(it))
                },
                placeholder = "Search rooms...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            if (uiState is RoomsUiState.Success) {
                val currentFilter = (uiState as RoomsUiState.Success).currentFilter
                FilterChips(
                    currentFilter = currentFilter,
                    onFilterSelected = { filter ->
                        viewModel.handleIntent(RoomsIntent.FilterRooms(filter))
                    },
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is RoomsUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }
                    is RoomsUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items = state.rooms, key = { it.id }) { room ->
                                RoomCard(
                                    room = room,
                                    onClick = {
                                        viewModel.handleIntent(RoomsIntent.NavigateToDetail(room.id))
                                    }
                                )
                            }
                        }
                    }
                    is RoomsUiState.Empty -> {
                        EmptyState(
                            title = "No Rooms Found",
                            description = state.message,
                            icon = Icons.Default.MeetingRoom,
                            actionLabel = null,
                            onActionClick = null
                        )
                    }
                    is RoomsUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = {
                                viewModel.handleIntent(RoomsIntent.RefreshRooms)
                            }
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilterChips(
    currentFilter: RoomStatusFilter,
    onFilterSelected: (RoomStatusFilter) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        FilterChip(
            selected = currentFilter == RoomStatusFilter.ALL,
            onClick = { onFilterSelected(RoomStatusFilter.ALL) },
            label = { Text("All") }
        )
        FilterChip(
            selected = currentFilter == RoomStatusFilter.VACANT,
            onClick = { onFilterSelected(RoomStatusFilter.VACANT) },
            label = { Text("Vacant") }
        )
        FilterChip(
            selected = currentFilter == RoomStatusFilter.OCCUPIED,
            onClick = { onFilterSelected(RoomStatusFilter.OCCUPIED) },
            label = { Text("Occupied") }
        )
    }
}
