package com.edunexus.android.core.network

import com.edunexus.android.core.network.dto.*
import retrofit2.Response
import retrofit2.http.*

/**
 * EduNexus API Service
 * All endpoints from the React Native API
 */
interface ApiService {

    // ==================== Authentication ====================

    @POST("/api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @PUT("/api/auth/change-password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): Response<ApiResponse<Unit>>

    // ==================== Profile ====================

    @GET("/api/profile")
    suspend fun getProfile(): Response<UserDto>

    @PUT("/api/profile")
    suspend fun updateProfile(@Body request: UpdateProfileRequest): Response<UserDto>

    // ==================== Dashboard ====================

    @GET("/api/dashboard/stats")
    suspend fun getDashboardStats(): Response<DashboardStatsDto>

    // ==================== Students ====================

    @GET("/api/students")
    suspend fun getStudents(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<StudentDto>>

    @GET("/api/students/{id}")
    suspend fun getStudent(@Path("id") id: String): Response<StudentDto>

    @POST("/api/students")
    suspend fun createStudent(@Body request: StudentRequest): Response<StudentDto>

    @PUT("/api/students/{id}")
    suspend fun updateStudent(
        @Path("id") id: String,
        @Body request: StudentRequest
    ): Response<StudentDto>

    @DELETE("/api/students/{id}")
    suspend fun deleteStudent(@Path("id") id: String): Response<ApiResponse<Unit>>

    // ==================== Teachers ====================

    @GET("/api/teachers")
    suspend fun getTeachers(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<TeacherDto>>

    @GET("/api/teachers/{id}")
    suspend fun getTeacher(@Path("id") id: String): Response<TeacherDto>

    // ==================== Parents ====================

    @GET("/api/parents")
    suspend fun getParents(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<ParentDto>>

    @GET("/api/parents/{id}")
    suspend fun getParent(@Path("id") id: String): Response<ParentDto>

    @POST("/api/parents")
    suspend fun createParent(@Body request: ParentRequest): Response<ParentDto>

    // ==================== Departments ====================

    @GET("/api/departments")
    suspend fun getDepartments(): Response<List<DepartmentDto>>

    // ==================== Classes & Sections ====================

    @GET("/api/classes")
    suspend fun getClasses(): Response<List<ClassDto>>

    @GET("/api/classes/{classId}/sections")
    suspend fun getSections(@Path("classId") classId: String): Response<List<SectionDto>>

    // ==================== Attendance ====================

    @GET("/api/attendance")
    suspend fun getAttendance(
        @Query("classId") classId: String,
        @Query("sectionId") sectionId: String,
        @Query("date") date: String
    ): Response<List<AttendanceDto>>

    @POST("/api/attendance")
    suspend fun markAttendance(@Body request: MarkAttendanceRequest): Response<ApiResponse<Unit>>

    // ==================== Exams ====================

    @GET("/api/exams")
    suspend fun getExams(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<ExamDto>>

    @GET("/api/exams/{id}")
    suspend fun getExam(
        @Path("id") id: String
    ): Response<ExamDto>

    @GET("/api/exams/{examId}/results")
    suspend fun getExamResults(
        @Path("examId") examId: String,
        @Query("studentId") studentId: String? = null
    ): Response<List<ExamResultDto>>

    @GET("/api/students/{studentId}/exam-results")
    suspend fun getStudentExamResults(
        @Path("studentId") studentId: String
    ): Response<List<ExamResultDto>>

    // ==================== Fees ====================

    @GET("/api/fees/status/{studentId}")
    suspend fun getFeeStatus(@Path("studentId") studentId: String): Response<FeeStatusDto>

    @GET("/api/fees/history/{studentId}")
    suspend fun getPaymentHistory(@Path("studentId") studentId: String): Response<List<FeePaymentDto>>

    @POST("/api/fees/payment")
    suspend fun makePayment(@Body request: MakePaymentRequest): Response<FeePaymentDto>

    // ==================== Notices ====================

    @GET("/api/notices")
    suspend fun getNotices(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<NoticeDto>>

    // ==================== Messages ====================

    @GET("/api/messages")
    suspend fun getMessages(
        @Query("type") type: String? = null,
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<MessageDto>>

    @GET("/api/messages/{id}")
    suspend fun getMessage(@Path("id") id: String): Response<MessageDto>

    @POST("/api/messages")
    suspend fun sendMessage(@Body request: SendMessageRequest): Response<MessageDto>

    @PUT("/api/messages/{id}/read")
    suspend fun markMessageRead(@Path("id") id: String): Response<ApiResponse<Unit>>

    @DELETE("/api/messages/{id}")
    suspend fun deleteMessage(@Path("id") id: String): Response<ApiResponse<Unit>>

    // ==================== Users ====================

    @GET("/api/users")
    suspend fun getUsers(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<UserDto>>

    // ==================== Library ====================

    @GET("/api/library/books")
    suspend fun getBooks(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<BookDto>>

    @GET("/api/library/books/{id}")
    suspend fun getBook(@Path("id") id: String): Response<BookDto>

    @POST("/api/library/books")
    suspend fun addBook(@Body request: BookRequest): Response<BookDto>

    @PUT("/api/library/books/{id}")
    suspend fun updateBook(
        @Path("id") id: String,
        @Body request: BookRequest
    ): Response<BookDto>

    @DELETE("/api/library/books/{id}")
    suspend fun deleteBook(@Path("id") id: String): Response<ApiResponse<Unit>>

    @GET("/api/library/issues")
    suspend fun getBookIssues(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<BookIssueDto>>

    @POST("/api/library/issues")
    suspend fun issueBook(@Body request: IssueBookRequest): Response<BookIssueDto>

    @POST("/api/library/issues/{id}/return")
    suspend fun returnBook(
        @Path("id") id: String,
        @Body request: ReturnBookRequest? = null
    ): Response<BookIssueDto>

    // ==================== Transport ====================

    @GET("/api/transport/vehicles")
    suspend fun getVehicles(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<VehicleDto>>

    @GET("/api/transport/vehicles/{id}")
    suspend fun getVehicle(@Path("id") id: String): Response<VehicleDto>

    @POST("/api/transport/vehicles")
    suspend fun addVehicle(@Body request: VehicleRequest): Response<VehicleDto>

    @PUT("/api/transport/vehicles/{id}")
    suspend fun updateVehicle(
        @Path("id") id: String,
        @Body request: VehicleRequest
    ): Response<VehicleDto>

    @GET("/api/transport/routes")
    suspend fun getTransportRoutes(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<TransportRouteDto>>

    @GET("/api/transport/routes/{id}")
    suspend fun getTransportRoute(@Path("id") id: String): Response<TransportRouteDto>

    @POST("/api/transport/routes")
    suspend fun addTransportRoute(@Body request: TransportRouteRequest): Response<TransportRouteDto>

    @GET("/api/transport/allocations")
    suspend fun getTransportAllocations(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<TransportAllocationDto>>

    @POST("/api/transport/allocations")
    suspend fun addTransportAllocation(@Body request: TransportAllocationRequest): Response<TransportAllocationDto>

    // ==================== Hostel ====================

    @GET("/api/hostel/buildings")
    suspend fun getHostelBuildings(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<HostelBuildingDto>>

    @GET("/api/hostel/buildings/{id}")
    suspend fun getHostelBuilding(@Path("id") id: String): Response<HostelBuildingDto>

    @POST("/api/hostel/buildings")
    suspend fun addHostelBuilding(@Body request: HostelBuildingRequest): Response<HostelBuildingDto>

    @GET("/api/hostel/rooms")
    suspend fun getHostelRooms(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<HostelRoomDto>>

    @GET("/api/hostel/rooms/{id}")
    suspend fun getHostelRoom(@Path("id") id: String): Response<HostelRoomDto>

    @POST("/api/hostel/rooms")
    suspend fun addHostelRoom(@Body request: HostelRoomRequest): Response<HostelRoomDto>

    @GET("/api/hostel/allocations")
    suspend fun getHostelAllocations(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<HostelAllocationDto>>

    @POST("/api/hostel/allocations")
    suspend fun addHostelAllocation(@Body request: HostelAllocationRequest): Response<HostelAllocationDto>
}

    // ==================== Inventory ====================

    @GET("/api/inventory/items")
    suspend fun getInventoryItems(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<InventoryItemDto>>

    @GET("/api/inventory/items/{id}")
    suspend fun getInventoryItem(@Path("id") id: String): Response<InventoryItemDto>

    @POST("/api/inventory/items")
    suspend fun addInventoryItem(@Body request: InventoryItemRequest): Response<InventoryItemDto>

    @PUT("/api/inventory/items/{id}")
    suspend fun updateInventoryItem(
        @Path("id") id: String,
        @Body request: InventoryItemRequest
    ): Response<InventoryItemDto>

    @DELETE("/api/inventory/items/{id}")
    suspend fun deleteInventoryItem(@Path("id") id: String): Response<ApiResponse<Unit>>

    @GET("/api/inventory/categories")
    suspend fun getInventoryCategories(): Response<List<InventoryCategoryDto>>

    @GET("/api/inventory/purchase-orders")
    suspend fun getPurchaseOrders(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<PurchaseOrderDto>>

    @GET("/api/inventory/purchase-orders/{id}")
    suspend fun getPurchaseOrder(@Path("id") id: String): Response<PurchaseOrderDto>

    @POST("/api/inventory/purchase-orders")
    suspend fun createPurchaseOrder(@Body request: PurchaseOrderRequest): Response<PurchaseOrderDto>

    @PUT("/api/inventory/purchase-orders/{id}/status")
    suspend fun updatePurchaseOrderStatus(
        @Path("id") id: String,
        @Body request: UpdateOrderStatusRequest
    ): Response<PurchaseOrderDto>

    @GET("/api/inventory/transactions")
    suspend fun getStockTransactions(
        @QueryMap params: Map<String, String> = emptyMap()
    ): Response<List<StockTransactionDto>>

    @POST("/api/inventory/transactions")
    suspend fun recordStockTransaction(@Body request: StockTransactionRequest): Response<StockTransactionDto>
}

// ==================== Inventory Request Models ====================

data class InventoryItemRequest(
    val itemCode: String,
    val name: String,
    val description: String?,
    val category: String,
    val unit: String,
    val quantity: Int,
    val minStockLevel: Int,
    val maxStockLevel: Int?,
    val unitPrice: Double,
    val supplier: String?,
    val location: String?
)

data class PurchaseOrderRequest(
    val supplier: String,
    val items: List<PurchaseOrderItemRequest>,
    val expectedDeliveryDate: String?,
    val notes: String?
)

data class PurchaseOrderItemRequest(
    val itemId: String,
    val quantity: Int,
    val unitPrice: Double
)

data class UpdateOrderStatusRequest(
    val status: String,
    val actualDeliveryDate: String?,
    val notes: String?
)

data class StockTransactionRequest(
    val itemId: String,
    val type: String,
    val quantity: Int,
    val reason: String,
    val referenceNumber: String?
)
