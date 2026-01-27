package com.edunexus.android.feature.students.presentation.addedit

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.edunexus.android.core.network.dto.StudentRequest
import com.edunexus.android.feature.students.data.repository.StudentRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Add/Edit Student Screen (MVI Pattern)
 */
@HiltViewModel
class AddEditStudentViewModel @Inject constructor(
    private val repository: StudentRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val studentId: String? = savedStateHandle.get<String>("studentId")

    private val _uiState = MutableStateFlow(AddEditStudentUiState())
    val uiState: StateFlow<AddEditStudentUiState> = _uiState.asStateFlow()

    private val _effect = MutableSharedFlow<AddEditStudentEffect>()
    val effect = _effect.asSharedFlow()

    init {
        if (studentId != null) {
            loadStudent(studentId)
        }
    }

    fun handleIntent(intent: AddEditStudentIntent) {
        when (intent) {
            is AddEditStudentIntent.UpdateField -> updateField(intent.field, intent.value)
            is AddEditStudentIntent.SaveStudent -> saveStudent()
            is AddEditStudentIntent.Cancel -> cancel()
        }
    }

    private fun loadStudent(id: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            repository.getStudent(id).fold(
                onSuccess = { student ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isEditMode = true,
                        admissionNumber = student.admissionNumber,
                        rollNo = student.rollNo ?: "",
                        firstName = student.firstName,
                        lastName = student.lastName,
                        dateOfBirth = student.dateOfBirth,
                        gender = student.gender,
                        bloodGroup = student.bloodGroup ?: "",
                        religion = student.religion ?: "",
                        caste = student.caste ?: "",
                        nationality = student.nationality ?: "Indian",
                        motherTongue = student.motherTongue ?: "",
                        email = student.email ?: "",
                        phone = student.phone ?: "",
                        address = student.address ?: "",
                        city = student.city ?: "",
                        state = student.state ?: "",
                        pincode = student.pincode ?: "",
                        photo = student.photo ?: "",
                        classId = student.classId,
                        sectionId = student.sectionId,
                        status = student.status,
                        admissionDate = student.admissionDate ?: "",
                        previousSchool = student.previousSchool ?: "",
                        medicalConditions = student.medicalConditions ?: "",
                        allergies = student.allergies ?: "",
                        parentId = student.parentId ?: ""
                    )
                },
                onFailure = { error ->
                    _effect.emit(
                        AddEditStudentEffect.ShowError(
                            error.message ?: "Failed to load student"
                        )
                    )
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
            )
        }
    }

    private fun updateField(field: StudentField, value: String) {
        _uiState.value = when (field) {
            StudentField.ADMISSION_NUMBER -> _uiState.value.copy(admissionNumber = value)
            StudentField.ROLL_NO -> _uiState.value.copy(rollNo = value)
            StudentField.FIRST_NAME -> _uiState.value.copy(firstName = value)
            StudentField.LAST_NAME -> _uiState.value.copy(lastName = value)
            StudentField.DATE_OF_BIRTH -> _uiState.value.copy(dateOfBirth = value)
            StudentField.GENDER -> _uiState.value.copy(gender = value)
            StudentField.BLOOD_GROUP -> _uiState.value.copy(bloodGroup = value)
            StudentField.RELIGION -> _uiState.value.copy(religion = value)
            StudentField.CASTE -> _uiState.value.copy(caste = value)
            StudentField.NATIONALITY -> _uiState.value.copy(nationality = value)
            StudentField.MOTHER_TONGUE -> _uiState.value.copy(motherTongue = value)
            StudentField.EMAIL -> _uiState.value.copy(email = value)
            StudentField.PHONE -> _uiState.value.copy(phone = value)
            StudentField.ADDRESS -> _uiState.value.copy(address = value)
            StudentField.CITY -> _uiState.value.copy(city = value)
            StudentField.STATE -> _uiState.value.copy(state = value)
            StudentField.PINCODE -> _uiState.value.copy(pincode = value)
            StudentField.PHOTO -> _uiState.value.copy(photo = value)
            StudentField.CLASS_ID -> _uiState.value.copy(classId = value)
            StudentField.SECTION_ID -> _uiState.value.copy(sectionId = value)
            StudentField.STATUS -> _uiState.value.copy(status = value)
            StudentField.ADMISSION_DATE -> _uiState.value.copy(admissionDate = value)
            StudentField.PREVIOUS_SCHOOL -> _uiState.value.copy(previousSchool = value)
            StudentField.MEDICAL_CONDITIONS -> _uiState.value.copy(medicalConditions = value)
            StudentField.ALLERGIES -> _uiState.value.copy(allergies = value)
            StudentField.PARENT_ID -> _uiState.value.copy(parentId = value)
        }
    }

    private fun saveStudent() {
        val state = _uiState.value

        // Validate required fields
        val errors = mutableMapOf<StudentField, String>()
        if (state.admissionNumber.isBlank()) {
            errors[StudentField.ADMISSION_NUMBER] = "Admission number is required"
        }
        if (state.firstName.isBlank()) {
            errors[StudentField.FIRST_NAME] = "First name is required"
        }
        if (state.lastName.isBlank()) {
            errors[StudentField.LAST_NAME] = "Last name is required"
        }
        if (state.dateOfBirth.isBlank()) {
            errors[StudentField.DATE_OF_BIRTH] = "Date of birth is required"
        }
        if (state.gender.isBlank()) {
            errors[StudentField.GENDER] = "Gender is required"
        }
        if (state.classId.isBlank()) {
            errors[StudentField.CLASS_ID] = "Class is required"
        }
        if (state.sectionId.isBlank()) {
            errors[StudentField.SECTION_ID] = "Section is required"
        }

        if (errors.isNotEmpty()) {
            _uiState.value = _uiState.value.copy(errors = errors)
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errors = emptyMap())

            val request = StudentRequest(
                admissionNumber = state.admissionNumber,
                rollNo = state.rollNo.ifBlank { null },
                firstName = state.firstName,
                lastName = state.lastName,
                dateOfBirth = state.dateOfBirth,
                gender = state.gender,
                bloodGroup = state.bloodGroup.ifBlank { null },
                religion = state.religion.ifBlank { null },
                caste = state.caste.ifBlank { null },
                nationality = state.nationality.ifBlank { "Indian" },
                motherTongue = state.motherTongue.ifBlank { null },
                email = state.email.ifBlank { null },
                phone = state.phone.ifBlank { null },
                address = state.address.ifBlank { null },
                city = state.city.ifBlank { null },
                state = state.state.ifBlank { null },
                pincode = state.pincode.ifBlank { null },
                photo = state.photo.ifBlank { null },
                classId = state.classId,
                sectionId = state.sectionId,
                status = state.status,
                admissionDate = state.admissionDate.ifBlank { null },
                previousSchool = state.previousSchool.ifBlank { null },
                medicalConditions = state.medicalConditions.ifBlank { null },
                allergies = state.allergies.ifBlank { null },
                parentId = state.parentId.ifBlank { null }
            )

            val result = if (studentId != null) {
                repository.updateStudent(studentId, request)
            } else {
                repository.createStudent(request)
            }

            result.fold(
                onSuccess = {
                    _effect.emit(
                        AddEditStudentEffect.ShowSuccess(
                            if (studentId != null) "Student updated successfully"
                            else "Student created successfully"
                        )
                    )
                    _effect.emit(AddEditStudentEffect.NavigateBack)
                },
                onFailure = { error ->
                    _effect.emit(
                        AddEditStudentEffect.ShowError(
                            error.message ?: "Failed to save student"
                        )
                    )
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
            )
        }
    }

    private fun cancel() {
        viewModelScope.launch {
            _effect.emit(AddEditStudentEffect.NavigateBack)
        }
    }
}

/**
 * UI State for Add/Edit Student
 */
data class AddEditStudentUiState(
    val isLoading: Boolean = false,
    val isEditMode: Boolean = false,
    val admissionNumber: String = "",
    val rollNo: String = "",
    val firstName: String = "",
    val lastName: String = "",
    val dateOfBirth: String = "",
    val gender: String = "",
    val bloodGroup: String = "",
    val religion: String = "",
    val caste: String = "",
    val nationality: String = "Indian",
    val motherTongue: String = "",
    val photo: String = "",
    val email: String = "",
    val phone: String = "",
    val address: String = "",
    val city: String = "",
    val state: String = "",
    val pincode: String = "",
    val classId: String = "",
    val sectionId: String = "",
    val status: String = "ACTIVE",
    val admissionDate: String = "",
    val previousSchool: String = "",
    val medicalConditions: String = "",
    val allergies: String = "",
    val parentId: String = "",
    val errors: Map<StudentField, String> = emptyMap()
)

/**
 * Student form fields
 */
enum class StudentField {
    ADMISSION_NUMBER,
    ROLL_NO,
    FIRST_NAME,
    LAST_NAME,
    DATE_OF_BIRTH,
    GENDER,
    BLOOD_GROUP,
    RELIGION,
    CASTE,
    NATIONALITY,
    MOTHER_TONGUE,
    EMAIL,
    PHONE,
    ADDRESS,
    CITY,
    STATE,
    PINCODE,
    PHOTO,
    CLASS_ID,
    SECTION_ID,
    STATUS,
    ADMISSION_DATE,
    PREVIOUS_SCHOOL,
    MEDICAL_CONDITIONS,
    ALLERGIES,
    PARENT_ID
}

/**
 * User Intents for Add/Edit Student
 */
sealed class AddEditStudentIntent {
    data class UpdateField(val field: StudentField, val value: String) : AddEditStudentIntent()
    object SaveStudent : AddEditStudentIntent()
    object Cancel : AddEditStudentIntent()
}

/**
 * Side Effects for Add/Edit Student
 */
sealed class AddEditStudentEffect {
    object NavigateBack : AddEditStudentEffect()
    data class ShowSuccess(val message: String) : AddEditStudentEffect()
    data class ShowError(val message: String) : AddEditStudentEffect()
}
