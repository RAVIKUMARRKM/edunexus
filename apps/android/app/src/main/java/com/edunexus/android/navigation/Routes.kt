package com.edunexus.android.navigation

/**
 * Navigation routes for the app.
 * All routes are defined as constants for type-safety.
 */
object Routes {
    // Auth Routes
    const val LOGIN = "login"
    const val SPLASH = "splash"

    // Main Bottom Nav Routes
    const val DASHBOARD = "dashboard"
    const val ATTENDANCE = "attendance"
    const val EXAMS = "exams"
    const val FEES = "fees"
    const val PROFILE = "profile"

    // Students Routes
    const val STUDENTS = "students"
    const val STUDENT_DETAIL = "student/{studentId}"
    const val STUDENT_ADD = "student/add"
    const val STUDENT_EDIT = "student/{studentId}/edit"

    // Teachers Routes
    const val TEACHERS = "teachers"
    const val TEACHER_DETAIL = "teacher/{teacherId}"
    const val TEACHER_ADD = "teacher/add"
    const val TEACHER_EDIT = "teacher/{teacherId}/edit"

    // Classes Routes
    const val CLASSES = "classes"
    const val CLASS_DETAIL = "class/{classId}"
    const val CLASS_ADD = "class/add"
    const val CLASS_EDIT = "class/{classId}/edit"

    // Attendance Routes
    const val ATTENDANCE_MARK = "attendance/mark"
    const val ATTENDANCE_REPORT = "attendance/report"

    // Exams Routes
    const val EXAM_DETAIL = "exam/{examId}"
    const val EXAM_ADD = "exam/add"
    const val EXAM_RESULTS = "exam/{examId}/results"

    // Fees Routes
    const val FEE_PAYMENT = "fees/payment"
    const val FEE_HISTORY = "fees/history"
    const val FEE_DETAIL = "fees/{feeId}"

    // Communication Routes
    const val NOTICES = "notices"
    const val NOTICE_DETAIL = "notice/{noticeId}"
    const val MESSAGES = "messages"
    const val MESSAGE_DETAIL = "message/{messageId}"

    // Library Routes
    const val LIBRARY = "library"
    const val BOOK_DETAIL = "book/{bookId}"
    const val BOOK_ISSUE = "book/issue"

    // Transport Routes
    const val TRANSPORT = "transport"
    const val ROUTE_DETAIL = "route/{routeId}"

    // Hostel Routes
    const val HOSTEL = "hostel"
    const val ROOM_DETAIL = "room/{roomId}"

    // HR Routes
    const val HR = "hr"
    const val EMPLOYEE_DETAIL = "employee/{employeeId}"
    const val PAYROLL = "payroll"
    const val LEAVE_MANAGEMENT = "leave"

    // Inventory Routes
    const val INVENTORY = "inventory"
    const val ITEM_DETAIL = "item/{itemId}"
    const val PURCHASE_ORDER = "purchase-order"

    // Reports Routes
    const val REPORTS = "reports"
    const val REPORT_DETAIL = "report/{reportType}"

    // Settings Routes
    const val SETTINGS = "settings"
    const val CHANGE_PASSWORD = "settings/change-password"
    const val EDIT_PROFILE = "settings/edit-profile"

    // Helper functions for parameterized routes
    fun studentDetail(studentId: String) = "student/$studentId"
    fun studentEdit(studentId: String) = "student/$studentId/edit"
    fun teacherDetail(teacherId: String) = "teacher/$teacherId"
    fun teacherEdit(teacherId: String) = "teacher/$teacherId/edit"
    fun classDetail(classId: String) = "class/$classId"
    fun classEdit(classId: String) = "class/$classId/edit"
    fun examDetail(examId: String) = "exam/$examId"
    fun examResults(examId: String) = "exam/$examId/results"
    fun feeDetail(feeId: String) = "fees/$feeId"
    fun noticeDetail(noticeId: String) = "notice/$noticeId"
    fun messageDetail(messageId: String) = "message/$messageId"
    fun bookDetail(bookId: String) = "book/$bookId"
    fun routeDetail(routeId: String) = "route/$routeId"
    fun roomDetail(roomId: String) = "room/$roomId"
    fun employeeDetail(employeeId: String) = "employee/$employeeId"
    fun itemDetail(itemId: String) = "item/$itemId"
    fun reportDetail(reportType: String) = "report/$reportType"
}
