package com.edunexus.android.feature.library.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.BookDto
import com.edunexus.android.core.network.dto.BookIssueDto
import com.edunexus.android.feature.library.data.repository.LibraryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Library Module (MVI Pattern)
 */
@HiltViewModel
class LibraryViewModel @Inject constructor(
    private val repository: LibraryRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<LibraryUiState>(LibraryUiState.Loading)
    val uiState: StateFlow<LibraryUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<LibraryEffect>()
    val effect = _effect.asSharedFlow()

    private var allBooks: List<BookDto> = emptyList()
    private var currentSearch: String = ""
    private var currentFilter: BookFilter = BookFilter.ALL

    init {
        loadBooks()
    }

    fun handleIntent(intent: LibraryIntent) {
        when (intent) {
            is LibraryIntent.LoadBooks -> loadBooks()
            is LibraryIntent.SearchBooks -> searchBooks(intent.query)
            is LibraryIntent.FilterBooks -> filterBooks(intent.filter)
            is LibraryIntent.RefreshBooks -> refreshBooks()
            is LibraryIntent.NavigateToDetail -> navigateToDetail(intent.bookId)
            is LibraryIntent.NavigateToIssueBook -> navigateToIssueBook(intent.bookId)
        }
    }

    private fun loadBooks() {
        viewModelScope.launch {
            _uiState.value = LibraryUiState.Loading

            repository.getBooks().fold(
                onSuccess = { books ->
                    allBooks = books
                    applyFilters()
                },
                onFailure = { error ->
                    _uiState.value = LibraryUiState.Error(
                        error.message ?: "Failed to load books"
                    )
                }
            )
        }
    }

    private fun searchBooks(query: String) {
        currentSearch = query
        applyFilters()
    }

    private fun filterBooks(filter: BookFilter) {
        currentFilter = filter
        applyFilters()
    }

    private fun applyFilters() {
        var filtered = allBooks

        // Apply status filter
        filtered = when (currentFilter) {
            BookFilter.ALL -> filtered
            BookFilter.AVAILABLE -> filtered.filter { it.available > 0 }
            BookFilter.ISSUED -> filtered.filter { it.available < it.quantity }
        }

        // Apply search filter
        if (currentSearch.isNotEmpty()) {
            filtered = filtered.filter { book ->
                book.title.contains(currentSearch, ignoreCase = true) ||
                        book.author.contains(currentSearch, ignoreCase = true) ||
                        book.isbn.contains(currentSearch, ignoreCase = true) ||
                        (book.category?.contains(currentSearch, ignoreCase = true) == true)
            }
        }

        _uiState.value = if (filtered.isEmpty()) {
            LibraryUiState.Empty(
                message = if (currentSearch.isNotEmpty()) {
                    "No books found for \"$currentSearch\""
                } else {
                    "No books available"
                }
            )
        } else {
            LibraryUiState.Success(filtered, currentFilter)
        }
    }

    private fun refreshBooks() {
        loadBooks()
    }

    private fun navigateToDetail(bookId: String) {
        viewModelScope.launch {
            _effect.emit(LibraryEffect.NavigateToDetail(bookId))
        }
    }

    private fun navigateToIssueBook(bookId: String) {
        viewModelScope.launch {
            _effect.emit(LibraryEffect.NavigateToIssueBook(bookId))
        }
    }

    fun getBook(bookId: String): BookDto? {
        return allBooks.find { it.id == bookId }
    }

    fun issueBook(bookId: String, studentId: String?, teacherId: String?, dueDate: String) {
        viewModelScope.launch {
            repository.issueBook(bookId, studentId, teacherId, dueDate).fold(
                onSuccess = {
                    _effect.emit(LibraryEffect.ShowToast("Book issued successfully"))
                    _effect.emit(LibraryEffect.NavigateBack)
                    loadBooks() // Refresh the list
                },
                onFailure = { error ->
                    _effect.emit(
                        LibraryEffect.ShowToast(
                            error.message ?: "Failed to issue book"
                        )
                    )
                }
            )
        }
    }
}

/**
 * UI State for Library
 */
sealed class LibraryUiState {
    object Loading : LibraryUiState()
    data class Success(val books: List<BookDto>, val filter: BookFilter) : LibraryUiState()
    data class Empty(val message: String) : LibraryUiState()
    data class Error(val message: String) : LibraryUiState()
}

/**
 * User Intents for Library
 */
sealed class LibraryIntent {
    object LoadBooks : LibraryIntent()
    data class SearchBooks(val query: String) : LibraryIntent()
    data class FilterBooks(val filter: BookFilter) : LibraryIntent()
    object RefreshBooks : LibraryIntent()
    data class NavigateToDetail(val bookId: String) : LibraryIntent()
    data class NavigateToIssueBook(val bookId: String) : LibraryIntent()
}

/**
 * Side Effects for Library
 */
sealed class LibraryEffect {
    data class NavigateToDetail(val bookId: String) : LibraryEffect()
    data class NavigateToIssueBook(val bookId: String) : LibraryEffect()
    object NavigateBack : LibraryEffect()
    data class ShowToast(val message: String) : LibraryEffect()
}

/**
 * Book Filter enum
 */
enum class BookFilter(val displayName: String) {
    ALL("All Books"),
    AVAILABLE("Available"),
    ISSUED("Issued")
}
