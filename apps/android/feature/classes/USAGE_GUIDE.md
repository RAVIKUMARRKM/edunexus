# Classes Module - Usage Guide

## Integration with Navigation

### 1. Add to Navigation Graph

```kotlin
// In your navigation setup
composable("classes") {
    ClassesScreen(
        onNavigateToDetail = { classId ->
            navController.navigate("classes/$classId")
        }
    )
}

composable(
    route = "classes/{classId}",
    arguments = listOf(navArgument("classId") { type = NavType.StringType })
) {
    ClassDetailScreen(
        onNavigateBack = { navController.popBackStack() }
    )
}
```

### 2. Navigate to Classes from Main Menu

```kotlin
// From any screen
navController.navigate("classes")
```

## Screen Parameters

### ClassesScreen
```kotlin
ClassesScreen(
    onNavigateToDetail: (String) -> Unit,  // Called when class card is clicked
    modifier: Modifier = Modifier,          // Optional modifier
    viewModel: ClassesViewModel = hiltViewModel()  // Auto-injected
)
```

### ClassDetailScreen
```kotlin
ClassDetailScreen(
    onNavigateBack: () -> Unit,             // Called when back is pressed
    modifier: Modifier = Modifier,          // Optional modifier
    viewModel: ClassDetailViewModel = hiltViewModel()  // Auto-injected
)
```

## ViewModel Usage

### ClassesViewModel

**Intents (User Actions)**:
```kotlin
// Load or refresh classes
viewModel.handleIntent(ClassesIntent.LoadClasses)
viewModel.handleIntent(ClassesIntent.RefreshClasses)

// Search classes
viewModel.handleIntent(ClassesIntent.SearchClasses("Grade 10"))

// Navigate to detail
viewModel.handleIntent(ClassesIntent.NavigateToDetail("class-id-123"))
```

**Observing State**:
```kotlin
val uiState by viewModel.uiState.collectAsStateWithLifecycle()

when (uiState) {
    is ClassesUiState.Loading -> ShowLoadingIndicator()
    is ClassesUiState.Success -> ShowClasses(uiState.classes)
    is ClassesUiState.Empty -> ShowEmptyState(uiState.message)
    is ClassesUiState.Error -> ShowError(uiState.message)
}
```

**Handling Effects**:
```kotlin
LaunchedEffect(Unit) {
    viewModel.effect.collect { effect ->
        when (effect) {
            is ClassesEffect.NavigateToDetail -> navigate(effect.classId)
            is ClassesEffect.ShowToast -> showToast(effect.message)
        }
    }
}
```

### ClassDetailViewModel

**Intents**:
```kotlin
// Load class details
viewModel.handleIntent(ClassDetailIntent.LoadClass)

// Navigate back
viewModel.handleIntent(ClassDetailIntent.NavigateBack)
```

**State**:
```kotlin
when (uiState) {
    is ClassDetailUiState.Loading -> ShowLoading()
    is ClassDetailUiState.Success -> {
        ShowClassDetails(uiState.classItem)
        ShowSections(uiState.sections)
    }
    is ClassDetailUiState.Error -> ShowError(uiState.message)
}
```

## Repository Usage

### Direct Repository Access (if needed)

```kotlin
@HiltViewModel
class MyViewModel @Inject constructor(
    private val classRepository: ClassRepository
) : ViewModel() {

    fun loadClasses() {
        viewModelScope.launch {
            classRepository.getClasses().fold(
                onSuccess = { classes ->
                    // Handle success
                },
                onFailure = { error ->
                    // Handle error
                }
            )
        }
    }

    fun loadSections(classId: String) {
        viewModelScope.launch {
            classRepository.getSections(classId).fold(
                onSuccess = { sections ->
                    // Handle success
                },
                onFailure = { error ->
                    // Handle error
                }
            )
        }
    }
}
```

## Components Usage

### ClassCard

```kotlin
ClassCard(
    classItem = classDto,
    onClick = { /* Handle click */ }
)
```

## Search Functionality

The search feature filters classes by:
- Class name (e.g., "Class 10A")
- Grade level (e.g., "10")
- Description

```kotlin
// User types in search bar
SearchBar(
    value = searchQuery,
    onValueChange = { query ->
        viewModel.handleIntent(ClassesIntent.SearchClasses(query))
    }
)
```

## Error Handling

All API calls return `Result<T>` which handles both success and failure:

```kotlin
repository.getClasses().fold(
    onSuccess = { classes -> /* Use data */ },
    onFailure = { error -> /* Handle error */ }
)
```

Common errors:
- Network connectivity issues
- API server errors
- Data parsing errors
- Class not found (404)

## State Management

### Loading State
- Shown when data is being fetched
- Displays a centered CircularProgressIndicator

### Success State
- Shown when data is successfully loaded
- Displays list of classes or class details

### Empty State
- Shown when no classes match search criteria
- Provides helpful message to user

### Error State
- Shown when an error occurs
- Provides retry action
- Displays error message

## Caching

The repository implements basic caching:
- Classes list is cached after first fetch
- Cache is used for `getClass(id)` to avoid redundant API calls
- Cache is refreshed on explicit refresh action

## Testing Tips

1. **Test Search**: Enter various search terms
2. **Test Empty State**: Search for non-existent class
3. **Test Error State**: Disconnect network and try loading
4. **Test Navigation**: Click on class cards, navigate back
5. **Test Sections**: Verify sections load correctly

## Customization

### Modify Search Behavior

Edit `ClassesViewModel.applyFilters()`:
```kotlin
private fun applyFilters() {
    val filtered = allClasses.filter { classItem ->
        // Add custom filter logic here
    }
    // ...
}
```

### Add New Fields to Display

1. Update `ClassCard.kt` to show new fields
2. Update `ClassDetailScreen.kt` to display in detail view
3. Ensure `ClassDto` contains the required fields

### Change UI Theme

All components use MaterialTheme, so changing the app theme automatically updates:
- Colors
- Typography
- Shapes
- Elevation

## Performance Considerations

- **Lazy Loading**: Uses LazyColumn for efficient list rendering
- **Caching**: Reduces unnecessary API calls
- **State Hoisting**: Composables are stateless, state managed by ViewModel
- **Recomposition**: Optimized with stable parameters and keys

## Troubleshooting

### Classes not loading
- Check API connectivity
- Verify API endpoint configuration
- Check network permissions

### Section information missing
- Verify API returns sections in ClassDto
- Check teacher information in SectionDto

### Navigation not working
- Ensure navigation graph is properly configured
- Verify classId is being passed correctly
- Check SavedStateHandle in ViewModel

## Best Practices

1. Always handle loading and error states
2. Provide feedback for user actions (toasts)
3. Use proper error messages
4. Test with various data scenarios
5. Follow Material Design guidelines
6. Keep ViewModels testable
7. Use sealed classes for type-safe states

## Additional Resources

- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
- [MVI Architecture Guide](https://proandroiddev.com/mvi-architecture-with-kotlin-flows-and-channels-d36820b2028d)
- [Hilt Dependency Injection](https://developer.android.com/training/dependency-injection/hilt-android)
- [Material Design 3](https://m3.material.io/)
