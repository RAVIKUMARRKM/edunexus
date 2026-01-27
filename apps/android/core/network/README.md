# EduNexus Network Module

This module provides the network layer for the EduNexus Android app using Retrofit, OkHttp, and Hilt dependency injection.

## Overview

The network module contains:
- **API Service Interface** - Retrofit endpoints for all API calls
- **DTOs (Data Transfer Objects)** - Network response/request models
- **Auth Interceptor** - Automatic token injection and 401 handling
- **Network Module** - Hilt DI configuration
- **DTO Mappers** - Extensions to convert DTOs to domain models

## Structure

```
network/
├── ApiService.kt                    # Retrofit API interface (40+ endpoints)
├── di/
│   └── NetworkModule.kt            # Hilt DI module
├── interceptor/
│   └── AuthInterceptor.kt          # Token injection & 401 handling
└── dto/
    ├── ApiResponse.kt              # Generic response wrappers
    ├── AuthDto.kt                  # Auth request/response DTOs
    ├── UserDto.kt                  # User DTOs
    ├── StudentDto.kt               # Student DTOs
    ├── TeacherDto.kt               # Teacher DTOs
    ├── ClassDto.kt                 # Class & Section DTOs
    ├── DepartmentDto.kt            # Department DTOs
    ├── ParentDto.kt                # Parent DTOs
    ├── AttendanceDto.kt            # Attendance DTOs
    ├── ExamDto.kt                  # Exam & Result DTOs
    ├── FeeDto.kt                   # Fee & Payment DTOs
    ├── NoticeDto.kt                # Notice DTOs
    ├── MessageDto.kt               # Message DTOs
    ├── LibraryDto.kt               # Library & Book DTOs
    ├── TransportDto.kt             # Transport DTOs
    ├── HostelDto.kt                # Hostel DTOs
    ├── DashboardDto.kt             # Dashboard stats DTOs
    └── DtoMappers.kt               # DTO to domain model mappers
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `PUT /api/auth/change-password` - Change password

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Students
- `GET /api/students` - Get all students (with query params)
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/{id}` - Get teacher by ID

### Parents
- `GET /api/parents` - Get all parents
- `GET /api/parents/{id}` - Get parent by ID
- `POST /api/parents` - Create parent

### Classes & Sections
- `GET /api/classes` - Get all classes
- `GET /api/classes/{classId}/sections` - Get sections for a class

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/{examId}/results` - Get exam results

### Fees
- `GET /api/fees/status/{studentId}` - Get fee status
- `GET /api/fees/history/{studentId}` - Get payment history
- `POST /api/fees/payment` - Make payment

### Communication
- `GET /api/notices` - Get notices
- `GET /api/messages` - Get messages
- `GET /api/messages/{id}` - Get message by ID
- `POST /api/messages` - Send message
- `PUT /api/messages/{id}/read` - Mark message as read
- `DELETE /api/messages/{id}` - Delete message

### Library
- `GET /api/library/books` - Get all books
- `GET /api/library/books/{id}` - Get book by ID
- `POST /api/library/books` - Add book
- `PUT /api/library/books/{id}` - Update book
- `DELETE /api/library/books/{id}` - Delete book
- `GET /api/library/issues` - Get book issues
- `POST /api/library/issues` - Issue book
- `POST /api/library/issues/{id}/return` - Return book

### Transport
- `GET /api/transport/vehicles` - Get all vehicles
- `GET /api/transport/vehicles/{id}` - Get vehicle by ID
- `POST /api/transport/vehicles` - Add vehicle
- `PUT /api/transport/vehicles/{id}` - Update vehicle
- `GET /api/transport/routes` - Get all routes
- `GET /api/transport/routes/{id}` - Get route by ID
- `POST /api/transport/routes` - Add route
- `GET /api/transport/allocations` - Get allocations
- `POST /api/transport/allocations` - Add allocation

### Hostel
- `GET /api/hostel/buildings` - Get all buildings
- `GET /api/hostel/buildings/{id}` - Get building by ID
- `POST /api/hostel/buildings` - Add building
- `GET /api/hostel/rooms` - Get all rooms
- `GET /api/hostel/rooms/{id}` - Get room by ID
- `POST /api/hostel/rooms` - Add room
- `GET /api/hostel/allocations` - Get allocations
- `POST /api/hostel/allocations` - Add allocation

### Users
- `GET /api/users` - Get all users (for messaging)

### Departments
- `GET /api/departments` - Get all departments

## Usage

### 1. Inject ApiService

```kotlin
@AndroidEntryPoint
class MyViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {
    // Use apiService here
}
```

### 2. Make API Calls

```kotlin
viewModelScope.launch {
    try {
        val response = apiService.getStudents()
        if (response.isSuccessful) {
            val students = response.body()
            // Handle success
        } else {
            // Handle error
        }
    } catch (e: Exception) {
        // Handle exception
    }
}
```

### 3. With DTO Mapping

```kotlin
val response = apiService.getStudent(studentId)
if (response.isSuccessful) {
    val studentDto = response.body()
    val student = studentDto?.toDomainModel()
    // Use domain model
}
```

## Auth Interceptor

The `AuthInterceptor` automatically:
1. Injects the Bearer token from DataStore into all requests
2. Handles 401 (Unauthorized) responses by clearing auth state

**Note**: The `TokenProvider` interface must be implemented in the `:core:datastore` module.

## Configuration

### API URL

The base API URL is configured in `build.gradle.kts`:

```kotlin
buildConfigField("String", "API_URL", "\"http://10.0.2.2:3000\"")
```

- `10.0.2.2` is the Android emulator's host machine
- For physical devices, update to your computer's IP address
- For production, use the production API URL

### Logging

HTTP request/response logging is enabled in DEBUG builds and disabled in RELEASE builds.

## Dependencies

```kotlin
// Retrofit & OkHttp
implementation("com.squareup.retrofit2:retrofit:2.9.0")
implementation("com.squareup.retrofit2:converter-gson:2.9.0")
implementation("com.squareup.okhttp3:okhttp:4.12.0")
implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

// Gson
implementation("com.google.code.gson:gson:2.10.1")

// Hilt
implementation("com.google.dagger:hilt-android:2.48")
ksp("com.google.dagger:hilt-android-compiler:2.48")
```

## Next Steps

1. **Implement TokenProvider** in `:core:datastore` module
2. **Create Domain Models** in `:core:model` module
3. **Update DTO Mappers** to use actual domain models
4. **Create Repository Layer** to abstract API calls
5. **Add Error Handling** with Result/Either patterns

## Notes

- All endpoints use `suspend` functions for coroutines support
- Query parameters use `@QueryMap` for flexibility
- Response types use Retrofit's `Response<T>` wrapper
- DTOs use Gson annotations for JSON serialization
- The module uses Hilt for dependency injection

## API Reference

Based on: `apps/mobile/lib/api.ts`

Total endpoints implemented: **60+ endpoints** covering all modules:
- Authentication (2)
- Profile (2)
- Dashboard (1)
- Students (5)
- Teachers (2)
- Parents (3)
- Classes (2)
- Attendance (2)
- Exams (2)
- Fees (3)
- Notices (1)
- Messages (5)
- Users (1)
- Library (8)
- Transport (8)
- Hostel (7)
- Departments (1)
