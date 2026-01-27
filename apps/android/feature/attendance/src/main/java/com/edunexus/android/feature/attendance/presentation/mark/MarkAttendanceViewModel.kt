package com.edunexus.android.feature.attendance.presentation.mark

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.AttendanceRecord
import com.edunexus.android.core.network.dto.MarkAttendanceRequest
import com.edunexus.android.core.network.dto.StudentDto
import com.edunexus.android.feature.attendance.data.repository.AttendanceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MarkAttendanceViewModel @Inject constructor(
    private val repository: AttendanceRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<MarkAttendanceUiState>(MarkAttendanceUiState.Loading)
    val uiState: StateFlow<MarkAttendanceUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<MarkAttendanceEffect>()
    val effect = _effect.asSharedFlow()

    private val attendanceMap = mutableMapOf<String, String>()
    private var selectedClassId: String? = null
    private var selectedSectionId: String? = null
    private var selectedDate: String? = null

    fun handleIntent(intent: MarkAttendanceIntent) {
        when (intent) {
            is MarkAttendanceIntent.LoadStudents -> loadStudents(intent.classId, intent.sectionId)
            is MarkAttendanceIntent.UpdateStudentStatus -> updateStudentStatus(intent.studentId, intent.status)
            is MarkAttendanceIntent.SubmitAttendance -> submitAttendance()
        }
    }

    private fun loadStudents(classId: String, sectionId: String) {
        selectedClassId = classId
        selectedSectionId = sectionId
        viewModelScope.launch {
            _uiState.value = MarkAttendanceUiState.Loading
            // For demo: using empty list. In real app, fetch from repository
            val students = emptyList<StudentDto>()
            students.forEach { student -> attendanceMap[student.id] = "PRESENT" }
            _uiState.value = MarkAttendanceUiState.Ready(students, attendanceMap.toMap())
        }
    }

    private fun updateStudentStatus(studentId: String, status: String) {
        attendanceMap[studentId] = status
        val currentState = _uiState.value
        if (currentState is MarkAttendanceUiState.Ready) {
            _uiState.value = currentState.copy(attendanceMap = attendanceMap.toMap())
        }
    }

    private fun submitAttendance() {
        viewModelScope.launch {
            _uiState.value = MarkAttendanceUiState.Submitting
            val records = attendanceMap.map { (studentId, status) -> AttendanceRecord(studentId, status, null) }
            val request = MarkAttendanceRequest(
                date = selectedDate ?: java.time.LocalDate.now().toString(),
                classId = selectedClassId ?: "",
                sectionId = selectedSectionId ?: "",
                attendance = records
            )
            repository.markAttendance(request).fold(
                onSuccess = {
                    _effect.emit(MarkAttendanceEffect.ShowToast("Attendance marked successfully"))
                    _effect.emit(MarkAttendanceEffect.NavigateBack)
                },
                onFailure = { error ->
                    _uiState.value = MarkAttendanceUiState.Error(error.message ?: "Failed to mark attendance")
                }
            )
        }
    }
}

sealed class MarkAttendanceUiState {
    object Loading : MarkAttendanceUiState()
    data class Ready(val students: List<StudentDto>, val attendanceMap: Map<String, String>) : MarkAttendanceUiState()
    object Submitting : MarkAttendanceUiState()
    data class Error(val message: String) : MarkAttendanceUiState()
}

sealed class MarkAttendanceIntent {
    data class LoadStudents(val classId: String, val sectionId: String) : MarkAttendanceIntent()
    data class UpdateStudentStatus(val studentId: String, val status: String) : MarkAttendanceIntent()
    object SubmitAttendance : MarkAttendanceIntent()
}

sealed class MarkAttendanceEffect {
    object NavigateBack : MarkAttendanceEffect()
    data class ShowToast(val message: String) : MarkAttendanceEffect()
}
