#!/bin/bash

echo "======================================"
echo "Library Module Verification Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 - NOT FOUND"
        ((FAILED++))
        return 1
    fi
}

echo "Checking Screen Files..."
echo "------------------------"
check_file "app/library/index.tsx"
check_file "app/library/books/index.tsx"
check_file "app/library/books/[id].tsx"
check_file "app/library/books/add.tsx"
check_file "app/library/books/edit/[id].tsx"
check_file "app/library/issues/index.tsx"
check_file "app/library/issues/issue.tsx"
check_file "app/library/issues/return/[id].tsx"

echo ""
echo "Checking Component Files..."
echo "---------------------------"
check_file "components/library/BookCard.tsx"
check_file "components/library/IssueCard.tsx"

echo ""
echo "Checking Documentation Files..."
echo "-------------------------------"
check_file "LIBRARY_MODULE_DOCUMENTATION.md"
check_file "LIBRARY_QUICK_START.md"
check_file "LIBRARY_MODULE_SUMMARY.md"

echo ""
echo "Checking Updated Files..."
echo "-------------------------"
check_file "components/index.ts"

echo ""
echo "======================================"
echo "Verification Summary"
echo "======================================"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All files verified successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test all features on a mobile device/simulator"
    echo "2. Verify API integration"
    echo "3. Check role-based access control"
    echo "4. Test fine calculation"
    echo "5. Verify search and filters"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some files are missing. Please check the output above.${NC}"
    exit 1
fi
