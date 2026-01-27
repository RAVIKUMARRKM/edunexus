package com.edunexus.android.feature.teachers

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.LoadingIndicator
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.feature.teachers.components.TeacherCard

/**
 * Teachers List Screen
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TeachersScreen(
    onNavigateToDetail: (String) -> Unit,
    onNavigateToAdd: () -> Unit,
    viewModel: TeachersViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Teachers") },
                actions = {
                    // Refresh button
                    IconButton(onClick = { viewModel.onEvent(TeachersEvent.RefreshTeachers) }) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh"
                        )
                    }
                }
            )
        },
        floatingActionButton = {
            // Show FAB for ADMIN/PRINCIPAL only (role-based access)
            FloatingActionButton(
                onClick = onNavigateToAdd
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Teacher")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Search Bar
            SearchBar(
                value = uiState.searchQuery,
                onValueChange = { viewModel.onEvent(TeachersEvent.SearchQueryChanged(it)) },
                placeholder = "Search by name or employee ID",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Filter Chips
            FilterChipsRow(
                selectedFilter = uiState.selectedFilter,
                onFilterSelected = { viewModel.onEvent(TeachersEvent.FilterChanged(it)) },
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Content
            Box(modifier = Modifier.fillMaxSize()) {
                when {
                    uiState.isLoading -> {
                        LoadingIndicator(
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    uiState.error != null -> {
                        EmptyState(
                            title = uiState.error ?: "An error occurred",
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    uiState.filteredTeachers.isEmpty() -> {
                        EmptyState(
                            title = if (uiState.searchQuery.isNotBlank() || uiState.selectedFilter != null) {
                                "No teachers found matching your criteria"
                            } else {
                                "No teachers available"
                            },
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    else -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(
                                items = uiState.filteredTeachers,
                                key = { it.id }
                            ) { teacher ->
                                TeacherCard(
                                    teacher = teacher,
                                    onClick = { onNavigateToDetail(teacher.id) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FilterChipsRow(
    selectedFilter: EmployeeStatus?,
    onFilterSelected: (EmployeeStatus?) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        FilterChip(
            selected = selectedFilter == null,
            onClick = { onFilterSelected(null) },
            label = { Text("ALL") }
        )

        FilterChip(
            selected = selectedFilter == EmployeeStatus.ACTIVE,
            onClick = { onFilterSelected(EmployeeStatus.ACTIVE) },
            label = { Text("ACTIVE") }
        )

        FilterChip(
            selected = selectedFilter == EmployeeStatus.ON_LEAVE,
            onClick = { onFilterSelected(EmployeeStatus.ON_LEAVE) },
            label = { Text("ON LEAVE") }
        )

        FilterChip(
            selected = selectedFilter == EmployeeStatus.RESIGNED,
            onClick = { onFilterSelected(EmployeeStatus.RESIGNED) },
            label = { Text("RESIGNED") }
        )
    }
}
