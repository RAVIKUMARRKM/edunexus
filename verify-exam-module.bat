@echo off
setlocal enabledelayedexpansion

REM Examination Module Verification Script for Windows
REM This script verifies that all required files for the exam module are in place

echo ==========================================
echo EduNexus - Examination Module Verification
echo ==========================================
echo.

set total=0
set found=0
set missing=0

REM Function to check file
:check_file
set /a total+=1
if exist "%~1" (
    echo [OK] %~1
    set /a found+=1
) else (
    echo [MISSING] %~1
    set /a missing+=1
)
goto :eof

echo Checking API Routes...
echo ----------------------
call :check_file "apps\web\app\api\exams\route.ts"
call :check_file "apps\web\app\api\exams\[id]\route.ts"
call :check_file "apps\web\app\api\exams\[id]\schedule\route.ts"
call :check_file "apps\web\app\api\exams\[id]\results\route.ts"
call :check_file "apps\web\app\api\exams\[id]\students\route.ts"
call :check_file "apps\web\app\api\exams\[id]\report-card\[studentId]\route.ts"
call :check_file "apps\web\app\api\academic-years\route.ts"
echo.

echo Checking Web Pages...
echo ---------------------
call :check_file "apps\web\app\(dashboard)\exams\page.tsx"
call :check_file "apps\web\app\(dashboard)\exams\new\page.tsx"
call :check_file "apps\web\app\(dashboard)\exams\[id]\page.tsx"
call :check_file "apps\web\app\(dashboard)\exams\[id]\grades\page.tsx"
call :check_file "apps\web\app\(dashboard)\exams\[id]\results\page.tsx"
call :check_file "apps\web\app\(dashboard)\exams\report-cards\page.tsx"
echo.

echo Checking Components...
echo ----------------------
call :check_file "apps\web\components\exams\ExamForm.tsx"
call :check_file "apps\web\components\exams\ExamScheduleForm.tsx"
call :check_file "apps\web\components\exams\GradeEntry.tsx"
call :check_file "apps\web\components\exams\ResultsTable.tsx"
call :check_file "apps\web\components\exams\ReportCard.tsx"
echo.

echo Checking Utilities...
echo ---------------------
call :check_file "apps\web\lib\grade-utils.ts"
echo.

echo Checking Documentation...
echo -------------------------
call :check_file "EXAM_MODULE_README.md"
call :check_file "EXAM_MODULE_SETUP.md"
call :check_file "EXAM_MODULE_FILES.md"
call :check_file "EXAM_MODULE_QUICK_REF.md"
echo.

echo ==========================================
echo Verification Summary
echo ==========================================
echo Total files expected: %total%
echo Files found:          %found%
echo Files missing:        %missing%
echo.

if %missing%==0 (
    echo [SUCCESS] All files are present! The module is ready to use.
    echo.
    echo Next steps:
    echo 1. Read EXAM_MODULE_SETUP.md for setup instructions
    echo 2. Run 'npm run db:push' to sync database schema
    echo 3. Seed grade scale data ^(see setup guide^)
    echo 4. Run 'npm run dev' to start the development server
    echo 5. Navigate to /exams to start using the module
) else (
    echo [ERROR] Some files are missing. Please check the list above.
)

echo.
echo ==========================================
echo Additional Checks
echo ==========================================

REM Check if node_modules exists
if exist "node_modules\" (
    echo [OK] node_modules directory exists
) else (
    echo [WARNING] node_modules not found. Run 'npm install'
)

REM Check if .env exists
if exist ".env" (
    echo [OK] .env file exists
) else (
    echo [WARNING] .env file not found. Create one with DATABASE_URL
)

REM Check if prisma client is generated
if exist "node_modules\.prisma\" (
    echo [OK] Prisma client is generated
) else (
    echo [WARNING] Prisma client not generated. Run 'npm run db:generate'
)

echo.
echo Done!
pause
