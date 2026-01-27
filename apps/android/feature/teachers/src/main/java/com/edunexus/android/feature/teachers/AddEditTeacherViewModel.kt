package com.edunexus.android.feature.teachers

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.model.Department
import com.edunexus.android.core.model.Teacher
import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.core.model.enums.Gender
import com.edunexus.android.feature.teachers.data.repository.TeacherRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Add/Edit Teacher Screen (MVI Pattern)
 */
@HiltViewModel
class AddEditTeacherViewModel @Inject constructor(
    private val repository: TeacherRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val teacherId: String? = savedStateHandle["teacherId"]

    private val _uiState = MutableStateFlow(AddEditTeacherUiState())
    val uiState: StateFlow<AddEditTeacherUiState> = _uiState.asStateFlow()

    init {
        loadDepartments()
        teacherId?.let { loadTeacher(it) }
    }

    fun onEvent(event: AddEditTeacherEvent) {
        when (event) {
            is AddEditTeacherEvent.FirstNameChanged -> updateFirstName(event.value)
            is AddEditTeacherEvent.LastNameChanged -> updateLastName(event.value)
            is AddEditTeacherEvent.EmployeeIdChanged -> updateEmployeeId(event.value)
            is AddEditTeacherEvent.DateOfBirthChanged -> updateDateOfBirth(event.value)
            is AddEditTeacherEvent.GenderChanged -> updateGender(event.value)
            is AddEditTeacherEvent.BloodGroupChanged -> updateBloodGroup(event.value)
            is AddEditTeacherEvent.AddressChanged -> updateAddress(event.value)
            is AddEditTeacherEvent.CityChanged -> updateCity(event.value)
            is AddEditTeacherEvent.StateChanged -> updateState(event.value)
            is AddEditTeacherEvent.PincodeChanged -> updatePincode(event.value)
            is AddEditTeacherEvent.EmergencyContactChanged -> updateEmergencyContact(event.value)
            is AddEditTeacherEvent.QualificationChanged -> updateQualification(event.value)
            is AddEditTeacherEvent.SpecializationChanged -> updateSpecialization(event.value)
            is AddEditTeacherEvent.ExperienceChanged -> updateExperience(event.value)
            is AddEditTeacherEvent.JoiningDateChanged -> updateJoiningDate(event.value)
            is AddEditTeacherEvent.DepartmentChanged -> updateDepartment(event.value)
            is AddEditTeacherEvent.DesignationChanged -> updateDesignation(event.value)
            is AddEditTeacherEvent.BasicSalaryChanged -> updateBasicSalary(event.value)
            is AddEditTeacherEvent.StatusChanged -> updateStatus(event.value)
            is AddEditTeacherEvent.SaveTeacher -> saveTeacher()
        }
    }

    private fun loadTeacher(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            val result = repository.getTeacher(id)

            result.fold(
                onSuccess = { teacher ->
                    _uiState.update {
                        it.copy(
                            firstName = teacher.firstName,
                            lastName = teacher.lastName,
                            employeeId = teacher.employeeId,
                            dateOfBirth = teacher.dateOfBirth,
                            gender = teacher.gender,
                            bloodGroup = teacher.bloodGroup ?: "",
                            address = teacher.address ?: "",
                            city = teacher.city ?: "",
                            state = teacher.state ?: "",
                            pincode = teacher.pincode ?: "",
                            emergencyContact = teacher.emergencyContact ?: "",
                            qualification = teacher.qualification,
                            specialization = teacher.specialization ?: "",
                            experience = teacher.experience.toString(),
                            joiningDate = teacher.joiningDate,
                            departmentId = teacher.departmentId,
                            designation = teacher.designation ?: "",
                            basicSalary = teacher.basicSalary.toString(),
                            status = teacher.status,
                            isLoading = false,
                            isEditMode = true
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = error.message ?: "Failed to load teacher"
                        )
                    }
                }
            )
        }
    }

    private fun loadDepartments() {
        viewModelScope.launch {
            val result = repository.getDepartments()
            result.fold(
                onSuccess = { departments ->
                    _uiState.update { it.copy(departments = departments) }
                },
                onFailure = { /* Silently fail, departments will be empty */ }
            )
        }
    }

    private fun updateFirstName(value: String) {
        _uiState.update { it.copy(firstName = value) }
    }

    private fun updateLastName(value: String) {
        _uiState.update { it.copy(lastName = value) }
    }

    private fun updateEmployeeId(value: String) {
        _uiState.update { it.copy(employeeId = value) }
    }

    private fun updateDateOfBirth(value: String) {
        _uiState.update { it.copy(dateOfBirth = value) }
    }

    private fun updateGender(value: Gender) {
        _uiState.update { it.copy(gender = value) }
    }

    private fun updateBloodGroup(value: String) {
        _uiState.update { it.copy(bloodGroup = value) }
    }

    private fun updateAddress(value: String) {
        _uiState.update { it.copy(address = value) }
    }

    private fun updateCity(value: String) {
        _uiState.update { it.copy(city = value) }
    }

    private fun updateState(value: String) {
        _uiState.update { it.copy(state = value) }
    }

    private fun updatePincode(value: String) {
        _uiState.update { it.copy(pincode = value) }
    }

    private fun updateEmergencyContact(value: String) {
        _uiState.update { it.copy(emergencyContact = value) }
    }

    private fun updateQualification(value: String) {
        _uiState.update { it.copy(qualification = value) }
    }

    private fun updateSpecialization(value: String) {
        _uiState.update { it.copy(specialization = value) }
    }

    private fun updateExperience(value: String) {
        _uiState.update { it.copy(experience = value) }
    }

    private fun updateJoiningDate(value: String) {
        _uiState.update { it.copy(joiningDate = value) }
    }

    private fun updateDepartment(value: String?) {
        _uiState.update { it.copy(departmentId = value) }
    }

    private fun updateDesignation(value: String) {
        _uiState.update { it.copy(designation = value) }
    }

    private fun updateBasicSalary(value: String) {
        _uiState.update { it.copy(basicSalary = value) }
    }

    private fun updateStatus(value: EmployeeStatus) {
        _uiState.update { it.copy(status = value) }
    }

    private fun saveTeacher() {
        val state = _uiState.value

        // Validate required fields
        val validationErrors = mutableListOf<String>()
        if (state.firstName.isBlank()) validationErrors.add("First name is required")
        if (state.lastName.isBlank()) validationErrors.add("Last name is required")
        if (state.employeeId.isBlank()) validationErrors.add("Employee ID is required")
        if (state.qualification.isBlank()) validationErrors.add("Qualification is required")
        if (state.joiningDate.isBlank()) validationErrors.add("Joining date is required")
        if (state.basicSalary.isBlank()) validationErrors.add("Basic salary is required")

        if (validationErrors.isNotEmpty()) {
            _uiState.update { it.copy(error = validationErrors.joinToString("\n")) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, error = null) }

            val teacher = Teacher(
                id = teacherId ?: "",
                employeeId = state.employeeId,
                userId = "", // Will be set by backend
                firstName = state.firstName,
                lastName = state.lastName,
                dateOfBirth = state.dateOfBirth,
                gender = state.gender,
                bloodGroup = state.bloodGroup.takeIf { it.isNotBlank() },
                photo = null,
                address = state.address.takeIf { it.isNotBlank() },
                city = state.city.takeIf { it.isNotBlank() },
                state = state.state.takeIf { it.isNotBlank() },
                pincode = state.pincode.takeIf { it.isNotBlank() },
                emergencyContact = state.emergencyContact.takeIf { it.isNotBlank() },
                qualification = state.qualification,
                specialization = state.specialization.takeIf { it.isNotBlank() },
                experience = state.experience.toIntOrNull() ?: 0,
                joiningDate = state.joiningDate,
                departmentId = state.departmentId,
                designation = state.designation.takeIf { it.isNotBlank() },
                basicSalary = state.basicSalary.toDoubleOrNull() ?: 0.0,
                status = state.status,
                leftDate = null,
                createdAt = "",
                updatedAt = ""
            )

            val result = if (state.isEditMode && teacherId != null) {
                repository.updateTeacher(teacherId, teacher)
            } else {
                repository.createTeacher(teacher)
            }

            result.fold(
                onSuccess = {
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            isSaved = true
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            error = error.message ?: "Failed to save teacher"
                        )
                    }
                }
            )
        }
    }
}

/**
 * UI State for Add/Edit Teacher Screen
 */
data class AddEditTeacherUiState(
    val firstName: String = "",
    val lastName: String = "",
    val employeeId: String = "",
    val dateOfBirth: String = "",
    val gender: Gender = Gender.MALE,
    val bloodGroup: String = "",
    val address: String = "",
    val city: String = "",
    val state: String = "",
    val pincode: String = "",
    val emergencyContact: String = "",
    val qualification: String = "",
    val specialization: String = "",
    val experience: String = "0",
    val joiningDate: String = "",
    val departmentId: String? = null,
    val designation: String = "",
    val basicSalary: String = "",
    val status: EmployeeStatus = EmployeeStatus.ACTIVE,
    val departments: List<Department> = emptyList(),
    val isLoading: Boolean = false,
    val isSaving: Boolean = false,
    val isSaved: Boolean = false,
    val isEditMode: Boolean = false,
    val error: String? = null
)

/**
 * Events for Add/Edit Teacher Screen
 */
sealed class AddEditTeacherEvent {
    data class FirstNameChanged(val value: String) : AddEditTeacherEvent()
    data class LastNameChanged(val value: String) : AddEditTeacherEvent()
    data class EmployeeIdChanged(val value: String) : AddEditTeacherEvent()
    data class DateOfBirthChanged(val value: String) : AddEditTeacherEvent()
    data class GenderChanged(val value: Gender) : AddEditTeacherEvent()
    data class BloodGroupChanged(val value: String) : AddEditTeacherEvent()
    data class AddressChanged(val value: String) : AddEditTeacherEvent()
    data class CityChanged(val value: String) : AddEditTeacherEvent()
    data class StateChanged(val value: String) : AddEditTeacherEvent()
    data class PincodeChanged(val value: String) : AddEditTeacherEvent()
    data class EmergencyContactChanged(val value: String) : AddEditTeacherEvent()
    data class QualificationChanged(val value: String) : AddEditTeacherEvent()
    data class SpecializationChanged(val value: String) : AddEditTeacherEvent()
    data class ExperienceChanged(val value: String) : AddEditTeacherEvent()
    data class JoiningDateChanged(val value: String) : AddEditTeacherEvent()
    data class DepartmentChanged(val value: String?) : AddEditTeacherEvent()
    data class DesignationChanged(val value: String) : AddEditTeacherEvent()
    data class BasicSalaryChanged(val value: String) : AddEditTeacherEvent()
    data class StatusChanged(val value: EmployeeStatus) : AddEditTeacherEvent()
    object SaveTeacher : AddEditTeacherEvent()
}
