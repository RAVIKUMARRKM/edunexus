package com.edunexus.android.feature.hr.presentation.employees

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.network.dto.EmployeeStatus
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.feature.hr.presentation.HREffect
import com.edunexus.android.feature.hr.presentation.HRIntent
import com.edunexus.android.feature.hr.presentation.HRUiState
import com.edunexus.android.feature.hr.presentation.HRViewModel
import com.edunexus.android.feature.hr.presentation.components.EmployeeCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmployeesScreen(
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: HRViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf<EmployeeStatus?>(null) }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is HREffect.NavigateToDetail -> onNavigateToDetail(effect.employeeId)
                is HREffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Employees") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(HRIntent.RefreshEmployees) }) {
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
                    viewModel.handleIntent(HRIntent.SearchEmployees(it))
                },
                placeholder = "Search employees...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            FilterChips(
                selectedFilter = selectedFilter,
                onFilterSelected = {
                    selectedFilter = it
                    viewModel.handleIntent(HRIntent.FilterByStatus(it))
                }
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is HRUiState.Loading -> {
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator()
                        }
                    }
                    is HRUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items = state.employees, key = { it.id }) { employee ->
                                EmployeeCard(
                                    employee = employee,
                                    onClick = {
                                        viewModel.handleIntent(HRIntent.NavigateToDetail(employee.id))
                                    }
                                )
                            }
                        }
                    }
                    is HRUiState.Empty -> {
                        EmptyState(
                            title = "No Employees Found",
                            description = state.message,
                            icon = Icons.Default.Person,
                            actionLabel = null,
                            onActionClick = null
                        )
                    }
                    is HRUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = { viewModel.handleIntent(HRIntent.RefreshEmployees) }
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
    selectedFilter: EmployeeStatus?,
    onFilterSelected: (EmployeeStatus?) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
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
            selected = selectedFilter == EmployeeStatus.TERMINATED,
            onClick = { onFilterSelected(EmployeeStatus.TERMINATED) },
            label = { Text("TERMINATED") }
        )
    }
}
