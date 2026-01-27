package com.edunexus.android.feature.fees.presentation.list
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
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
import com.edunexus.android.feature.fees.presentation.components.FeeCard

/**
 * Students List Screen
 * Displays all students with search, filter, and CRUD operations
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeesScreen(
    onNavigateToDetail: (String) -> Unit,
    onNavigateToPayment: (String) -> Unit,
    onNavigateToHistory: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: FeesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf<String?>(null) }

    // Handle side effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is FeesEffect.NavigateToDetail -> onNavigateToDetail(effect.studentId)
                is FeesEffect.NavigateToPayment(effect.studentId) -> onNavigateToPayment(effect.studentId)
                is FeesEffect.NavigateToHistory(effect.studentId) -> onNavigateToHistory(effect.studentId)
                is FeesEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Fees") },
                actions = {
                    // Refresh button
                    IconButton(onClick = { viewModel.handleIntent(FeesIntent.RefreshFees) }) {
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
        },
        floatingActionButton = {
            // Only show FAB for ADMIN and PRINCIPAL roles
            // TODO: Add role-based check
            FloatingActionButton(
                onClick = { viewModel.handleIntent(FeesIntent.NavigateToDetail(feeStatus.studentId)) },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Process Payment",
                    tint = MaterialTheme.colorScheme.onPrimary
                )
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
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    viewModel.handleIntent(FeesIntent.SearchFees(it))
                },
                placeholder = "Search fees...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Filter Chips
            val filterChips = listOf(
                FilterChipItem("all", "ALL", selected = selectedFilter == null),
                FilterChipItem("paid", "PAID", selected = selectedFilter == "PAID"),
                FilterChipItem("pending", "PENDING", selected = selectedFilter == "PENDING"),
                FilterChipItem("overdue", "OVERDUE", selected = selectedFilter == "OVERDUE")





            )

            SingleSelectFilterChips(
                chips = filterChips,
                selectedId = selectedFilter,
                onChipSelected = { chip ->
                    val newFilter = if (chip.id == "all") null else chip.label
                    selectedFilter = newFilter
                    viewModel.handleIntent(FeesIntent.FilterByStatus(newFilter))
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Content based on state
            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is FeesUiState.Loading -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }

                    is FeesUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(
                                items = state.feeStatuses,
                                key = { it.id }
                            ) { student ->
                                FeeCard(
                                    feeStatus = student,
                                    onClick = {
                                        viewModel.handleIntent(
                                            FeesIntent.NavigateToDetail(student.id)
                                        )
                                    }
                                )
                            }
                        }
                    }

                    is FeesUiState.Empty -> {
                        EmptyState(
                            title = "No Students Found",
                            description = state.message,
                            icon = Icons.Default.Payment,
                            actionLabel = if (searchQuery.isEmpty() && selectedFilter == null) {
                                "Process Payment"
                            } else null,
                            onActionClick = if (searchQuery.isEmpty() && selectedFilter == null) {
                                { viewModel.handleIntent(FeesIntent.NavigateToDetail(feeStatus.studentId)) }
                            } else null
                        )
                    }

                    is FeesUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = {
                                viewModel.handleIntent(FeesIntent.RefreshFees)
                            }
                        )
                    }
                }
            }
        }
    }
}
