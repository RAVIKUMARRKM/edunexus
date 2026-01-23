import { prisma } from '@edunexus/database';

/**
 * Calculate grade based on percentage
 * Fetches grade scale from database and returns matching grade
 */
export async function calculateGrade(percentage: number): Promise<string> {
  try {
    const gradeScales = await prisma.gradeScale.findMany({
      orderBy: {
        minPercent: 'desc',
      },
    });

    for (const scale of gradeScales) {
      const minPercent = parseFloat(scale.minPercent.toString());
      const maxPercent = parseFloat(scale.maxPercent.toString());

      if (percentage >= minPercent && percentage <= maxPercent) {
        return scale.name;
      }
    }

    // Default fallback if no grade scale matches
    return 'F';
  } catch (error) {
    console.error('Error calculating grade:', error);
    return 'F';
  }
}

/**
 * Calculate grade without database lookup (faster for client-side)
 * Uses standard grade scale
 */
export function calculateGradeLocal(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}

/**
 * Calculate percentage from marks
 */
export function calculatePercentage(marksObtained: number, maxMarks: number): number {
  if (maxMarks === 0) return 0;
  return (marksObtained / maxMarks) * 100;
}

/**
 * Check if student passed
 */
export function isPassed(marksObtained: number, passingMarks: number): boolean {
  return marksObtained >= passingMarks;
}

/**
 * Get grade color for UI display
 */
export function getGradeColor(grade: string): string {
  const gradeColors: Record<string, string> = {
    'A+': 'bg-green-500',
    'A': 'bg-green-400',
    'B+': 'bg-blue-500',
    'B': 'bg-blue-400',
    'C': 'bg-yellow-500',
    'D': 'bg-orange-500',
    'F': 'bg-red-500',
    'AB': 'bg-gray-500',
  };

  return gradeColors[grade] || 'bg-gray-400';
}

/**
 * Get result status badge color
 */
export function getResultStatusColor(isPassed: boolean): string {
  return isPassed ? 'bg-green-500' : 'bg-red-500';
}

/**
 * Format marks for display
 */
export function formatMarks(marks: number | string, isAbsent: boolean = false): string {
  if (isAbsent) return 'AB';
  if (typeof marks === 'string') return marks;
  return marks.toFixed(2);
}

/**
 * Calculate total marks for a student across all subjects
 */
export function calculateTotalMarks(results: Array<{ marksObtained: number; isAbsent: boolean }>): number {
  return results.reduce((total, result) => {
    if (result.isAbsent) return total;
    return total + result.marksObtained;
  }, 0);
}

/**
 * Calculate overall percentage for a student
 */
export function calculateOverallPercentage(
  totalMarksObtained: number,
  totalMaxMarks: number
): number {
  if (totalMaxMarks === 0) return 0;
  return (totalMarksObtained / totalMaxMarks) * 100;
}

/**
 * Count failed subjects
 */
export function countFailedSubjects(
  results: Array<{ marksObtained: number; isAbsent: boolean }>,
  passingMarks: number
): number {
  return results.filter((result) => !result.isAbsent && result.marksObtained < passingMarks).length;
}

/**
 * Determine overall result (PASS/FAIL)
 */
export function getOverallResult(failedSubjectsCount: number): 'PASS' | 'FAIL' {
  return failedSubjectsCount === 0 ? 'PASS' : 'FAIL';
}

/**
 * Calculate class rank based on total marks
 */
export function calculateRank(
  studentId: string,
  studentTotals: Map<string, number>
): { rank: number; totalStudents: number } {
  const sortedStudents = Array.from(studentTotals.entries())
    .sort((a, b) => b[1] - a[1]);

  const rank = sortedStudents.findIndex(([id]) => id === studentId) + 1;
  const totalStudents = sortedStudents.length;

  return { rank, totalStudents };
}

/**
 * Validate marks input
 */
export function validateMarks(marks: number, maxMarks: number): { valid: boolean; error?: string } {
  if (isNaN(marks)) {
    return { valid: false, error: 'Marks must be a number' };
  }

  if (marks < 0) {
    return { valid: false, error: 'Marks cannot be negative' };
  }

  if (marks > maxMarks) {
    return { valid: false, error: `Marks cannot exceed ${maxMarks}` };
  }

  return { valid: true };
}

/**
 * Get exam type display name
 */
export function getExamTypeDisplayName(examType: string): string {
  const typeMap: Record<string, string> = {
    UNIT_TEST: 'Unit Test',
    MID_TERM: 'Mid Term',
    FINAL: 'Final Examination',
    PRACTICAL: 'Practical',
    ASSIGNMENT: 'Assignment',
  };

  return typeMap[examType] || examType;
}

/**
 * Get exam type color for badges
 */
export function getExamTypeColor(examType: string): string {
  const colorMap: Record<string, string> = {
    UNIT_TEST: 'bg-blue-500',
    MID_TERM: 'bg-yellow-500',
    FINAL: 'bg-red-500',
    PRACTICAL: 'bg-green-500',
    ASSIGNMENT: 'bg-purple-500',
  };

  return colorMap[examType] || 'bg-gray-500';
}

/**
 * Calculate pass percentage for a class
 */
export function calculatePassPercentage(passedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return (passedCount / totalCount) * 100;
}

/**
 * Sort students by roll number
 */
export function sortStudentsByRollNo<T extends { rollNo: string }>(students: T[]): T[] {
  return students.sort((a, b) => {
    const rollA = parseInt(a.rollNo) || 0;
    const rollB = parseInt(b.rollNo) || 0;
    return rollA - rollB;
  });
}

/**
 * Group results by student
 */
export function groupResultsByStudent<T extends { studentId: string }>(
  results: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  results.forEach((result) => {
    const existing = grouped.get(result.studentId) || [];
    grouped.set(result.studentId, [...existing, result]);
  });

  return grouped;
}

/**
 * Group results by subject
 */
export function groupResultsBySubject<T extends { subjectId: string }>(
  results: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  results.forEach((result) => {
    const existing = grouped.get(result.subjectId) || [];
    grouped.set(result.subjectId, [...existing, result]);
  });

  return grouped;
}

/**
 * Calculate subject-wise statistics
 */
export function calculateSubjectStatistics(
  results: Array<{ marksObtained: number; isAbsent: boolean }>,
  maxMarks: number,
  passingMarks: number
) {
  const validResults = results.filter((r) => !r.isAbsent);
  const totalStudents = validResults.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      passedStudents: 0,
      failedStudents: 0,
      absentStudents: results.length,
      averageMarks: 0,
      averagePercentage: 0,
      highestMarks: 0,
      lowestMarks: 0,
      passPercentage: 0,
    };
  }

  const marks = validResults.map((r) => r.marksObtained);
  const passedStudents = marks.filter((m) => m >= passingMarks).length;
  const failedStudents = totalStudents - passedStudents;
  const absentStudents = results.filter((r) => r.isAbsent).length;
  const averageMarks = marks.reduce((sum, m) => sum + m, 0) / totalStudents;
  const averagePercentage = (averageMarks / maxMarks) * 100;
  const highestMarks = Math.max(...marks);
  const lowestMarks = Math.min(...marks);
  const passPercentage = (passedStudents / totalStudents) * 100;

  return {
    totalStudents: results.length,
    passedStudents,
    failedStudents,
    absentStudents,
    averageMarks: parseFloat(averageMarks.toFixed(2)),
    averagePercentage: parseFloat(averagePercentage.toFixed(2)),
    highestMarks,
    lowestMarks,
    passPercentage: parseFloat(passPercentage.toFixed(2)),
  };
}
