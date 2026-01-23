#!/bin/bash

# Examination Module Verification Script
# This script verifies that all required files for the exam module are in place

echo "=========================================="
echo "EduNexus - Examination Module Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total=0
found=0
missing=0

# Function to check file
check_file() {
    total=$((total + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        found=$((found + 1))
    else
        echo -e "${RED}✗${NC} $1"
        missing=$((missing + 1))
    fi
}

echo "Checking API Routes..."
echo "----------------------"
check_file "apps/web/app/api/exams/route.ts"
check_file "apps/web/app/api/exams/[id]/route.ts"
check_file "apps/web/app/api/exams/[id]/schedule/route.ts"
check_file "apps/web/app/api/exams/[id]/results/route.ts"
check_file "apps/web/app/api/exams/[id]/students/route.ts"
check_file "apps/web/app/api/exams/[id]/report-card/[studentId]/route.ts"
check_file "apps/web/app/api/academic-years/route.ts"
echo ""

echo "Checking Web Pages..."
echo "---------------------"
check_file "apps/web/app/(dashboard)/exams/page.tsx"
check_file "apps/web/app/(dashboard)/exams/new/page.tsx"
check_file "apps/web/app/(dashboard)/exams/[id]/page.tsx"
check_file "apps/web/app/(dashboard)/exams/[id]/grades/page.tsx"
check_file "apps/web/app/(dashboard)/exams/[id]/results/page.tsx"
check_file "apps/web/app/(dashboard)/exams/report-cards/page.tsx"
echo ""

echo "Checking Components..."
echo "----------------------"
check_file "apps/web/components/exams/ExamForm.tsx"
check_file "apps/web/components/exams/ExamScheduleForm.tsx"
check_file "apps/web/components/exams/GradeEntry.tsx"
check_file "apps/web/components/exams/ResultsTable.tsx"
check_file "apps/web/components/exams/ReportCard.tsx"
echo ""

echo "Checking Utilities..."
echo "---------------------"
check_file "apps/web/lib/grade-utils.ts"
echo ""

echo "Checking Documentation..."
echo "-------------------------"
check_file "EXAM_MODULE_README.md"
check_file "EXAM_MODULE_SETUP.md"
check_file "EXAM_MODULE_FILES.md"
check_file "EXAM_MODULE_QUICK_REF.md"
echo ""

echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "Total files expected: ${YELLOW}$total${NC}"
echo -e "Files found:          ${GREEN}$found${NC}"
echo -e "Files missing:        ${RED}$missing${NC}"
echo ""

if [ $missing -eq 0 ]; then
    echo -e "${GREEN}✓ All files are present! The module is ready to use.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Read EXAM_MODULE_SETUP.md for setup instructions"
    echo "2. Run 'npm run db:push' to sync database schema"
    echo "3. Seed grade scale data (see setup guide)"
    echo "4. Run 'npm run dev' to start the development server"
    echo "5. Navigate to /exams to start using the module"
else
    echo -e "${RED}✗ Some files are missing. Please check the list above.${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "Additional Checks"
echo "=========================================="

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}!${NC} node_modules not found. Run 'npm install'"
fi

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
else
    echo -e "${YELLOW}!${NC} .env file not found. Create one with DATABASE_URL"
fi

# Check if prisma client is generated
if [ -d "node_modules/.prisma" ]; then
    echo -e "${GREEN}✓${NC} Prisma client is generated"
else
    echo -e "${YELLOW}!${NC} Prisma client not generated. Run 'npm run db:generate'"
fi

echo ""
echo "Done!"
