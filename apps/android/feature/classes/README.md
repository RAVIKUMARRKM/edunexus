# Classes Feature Module

[![Kotlin](https://img.shields.io/badge/Kotlin-1.9.22-blue.svg)](https://kotlinlang.org)
[![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-1.5.8-green.svg)](https://developer.android.com/jetpack/compose)
[![Material Design 3](https://img.shields.io/badge/Material%20Design-3-orange.svg)](https://m3.material.io/)

## Overview

The Classes feature module provides functionality to view and manage class information in the EduNexus Android application. It follows the MVI (Model-View-Intent) architecture pattern and uses Jetpack Compose for the UI.

## Features

- View list of all classes
- Search classes by name, grade, or description
- View detailed class information
- View sections and teachers for each class
- Material Design 3 UI components
- Offline caching support
- Error handling and retry mechanism

## Architecture

### MVI Pattern

```
User Action → Intent → ViewModel → Repository → API
                ↓
            State Update → UI Recomposition
                ↓
            Side Effects → Navigation/Toasts
```

### Module Structure

```
classes/
├── data/
│   └── repository/
│       ├── ClassRepository.kt          # Repository interface
│       └── ClassRepositoryImpl.kt      # Repository implementation
├── di/
│   └── ClassesModule.kt                # Hilt DI module
└── presentation/
    ├── addedit/
    │   └── AddEditClassScreen.kt       # Add/Edit screen (placeholder)
    ├── components/
    │   └── ClassCard.kt                # Reusable class card component
    ├── detail/
    │   ├── ClassDetailScreen.kt        # Class detail screen
    │   └── ClassDetailViewModel.kt     # Detail screen ViewModel
    └── list/
        ├── ClassesScreen.kt            # Classes list screen
        └── ClassesViewModel.kt         # List screen ViewModel
```

## Key Components

### 1. ClassesScreen
Main screen displaying the list of all classes with search functionality.

**Features:**
- Search bar for filtering classes
- Pull-to-refresh functionality
- Empty and error state handling
- Material Design 3 components

### 2. ClassDetailScreen
Detailed view of a single class showing all information and sections.

**Features:**
- Class information display
- Sections list with teacher details
- Capacity information
- Loading and error states

### 3. ClassCard
Reusable component for displaying class information in a card format.

**Features:**
- Class icon
- Name and grade display
- Description preview
- Section count badge

## Tech Stack

- **UI**: Jetpack Compose
- **Architecture**: MVI (Model-View-Intent)
- **DI**: Hilt
- **Networking**: Retrofit (via core:network)
- **State Management**: Kotlin Flows
- **Navigation**: Compose Navigation

## Dependencies

```kotlin
dependencies {
    // Core modules
    implementation(project(":core:common"))
    implementation(project(":core:model"))
    implementation(project(":core:network"))
    implementation(project(":core:datastore"))
    implementation(project(":core:ui"))

    // Compose
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose")
    implementation("androidx.navigation:navigation-compose")

    // Hilt
    implementation("com.google.dagger:hilt-android")
    implementation("androidx.hilt:hilt-navigation-compose")
    ksp("com.google.dagger:hilt-android-compiler")
}
```

## Usage

### Navigation Setup

```kotlin
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

### ViewModel Usage

```kotlin
// Observe state
val uiState by viewModel.uiState.collectAsStateWithLifecycle()

// Handle intents
viewModel.handleIntent(ClassesIntent.LoadClasses)
viewModel.handleIntent(ClassesIntent.SearchClasses("query"))

// Handle effects
LaunchedEffect(Unit) {
    viewModel.effect.collect { effect ->
        when (effect) {
            is ClassesEffect.NavigateToDetail -> navigate(effect.classId)
            is ClassesEffect.ShowToast -> showToast(effect.message)
        }
    }
}
```

## API Integration

### Endpoints

- `GET /api/classes` - Fetch all classes
- `GET /api/classes/{classId}/sections` - Fetch sections for a class

### DTOs

- `ClassDto` - Class data transfer object
- `SectionDto` - Section data transfer object

## Testing

Run unit tests:
```bash
./gradlew :feature:classes:testDebugUnitTest
```

Run instrumented tests:
```bash
./gradlew :feature:classes:connectedAndroidTest
```

## Screenshots

*TODO: Add screenshots*

## Future Enhancements

- [ ] Add/Edit class functionality (when API supports it)
- [ ] Delete class functionality
- [ ] Sort classes by grade or name
- [ ] Advanced filtering options
- [ ] Export class list
- [ ] Print class information
- [ ] Bulk operations

## Contributing

1. Follow the existing MVI pattern
2. Use sealed classes for states and intents
3. Keep composables stateless
4. Add proper error handling
5. Write unit tests for ViewModels
6. Follow Material Design 3 guidelines

## License

This module is part of the EduNexus project.

## Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: EduNexus Development Team
