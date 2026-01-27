package com.edunexus.android.feature.library.presentation.books

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LibraryBooks
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
import com.edunexus.android.feature.library.presentation.*
import com.edunexus.android.feature.library.presentation.components.BookCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BooksScreen(
    onNavigateToDetail: (String) -> Unit,
    onNavigateToIssueBook: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: LibraryViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf(BookFilter.ALL) }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is LibraryEffect.NavigateToDetail -> onNavigateToDetail(effect.bookId)
                is LibraryEffect.NavigateToIssueBook -> onNavigateToIssueBook(effect.bookId)
                is LibraryEffect.ShowToast -> Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                is LibraryEffect.NavigateBack -> {}
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Library") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(LibraryIntent.RefreshBooks) }) {
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
        Column(modifier = Modifier.fillMaxSize().padding(paddingValues)) {
            SearchBar(
                value = searchQuery,
                onValueChange = { searchQuery = it; viewModel.handleIntent(LibraryIntent.SearchBooks(it)) },
                placeholder = "Search by title, author, ISBN...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                BookFilter.values().forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter; viewModel.handleIntent(LibraryIntent.FilterBooks(filter)) },
                        label = { Text(filter.displayName) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is LibraryUiState.Loading -> Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
                    is LibraryUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items = state.books, key = { it.id }) { book ->
                                BookCard(
                                    book = book,
                                    onClick = { viewModel.handleIntent(LibraryIntent.NavigateToDetail(book.id)) },
                                    onIssueClick = { viewModel.handleIntent(LibraryIntent.NavigateToIssueBook(book.id)) }
                                )
                            }
                        }
                    }
                    is LibraryUiState.Empty -> EmptyState(title = "No Books Found", description = state.message, icon = Icons.Default.LibraryBooks, actionLabel = null, onActionClick = null)
                    is LibraryUiState.Error -> EmptyState(title = "Error", description = state.message, icon = null, actionLabel = "Retry", onActionClick = { viewModel.handleIntent(LibraryIntent.RefreshBooks) })
                }
            }
        }
    }
}
