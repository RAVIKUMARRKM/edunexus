import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';

// GET /api/exams/[id]/report-card/[studentId] - Generate report card
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    // Fetch exam details
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        academicYear: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
            numericValue: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Fetch student details
    const student = await prisma.student.findUnique({
      where: { id: params.studentId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
        section: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Fetch exam results for the student
    const results = await prisma.examResult.findMany({
      where: {
        examId: params.id,
        studentId: params.studentId,
      },
      include: {
        subject: {
          select: {
            name: true,
            code: true,
            type: true,
          },
        },
      },
      orderBy: {
        subject: {
          name: 'asc',
        },
      },
    });

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'No results found for this student' },
        { status: 404 }
      );
    }

    // Calculate total marks and percentage
    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    let subjectCount = 0;
    let failedSubjects = 0;

    const subjectResults = results.map((result) => {
      const marksObtained = parseFloat(result.marksObtained.toString());
      const maxMarks = exam.maxMarks;
      const percentage = (marksObtained / maxMarks) * 100;
      const isPassed = !result.isAbsent && marksObtained >= exam.passingMarks;

      if (!result.isAbsent) {
        totalMarksObtained += marksObtained;
        totalMaxMarks += maxMarks;
        subjectCount++;

        if (!isPassed) {
          failedSubjects++;
        }
      }

      return {
        subjectName: result.subject.name,
        subjectCode: result.subject.code,
        subjectType: result.subject.type,
        maxMarks,
        marksObtained: result.isAbsent ? 'AB' : marksObtained,
        grade: result.grade,
        percentage: result.isAbsent ? 'AB' : percentage.toFixed(2),
        isPassed,
        isAbsent: result.isAbsent,
        remarks: result.remarks,
      };
    });

    const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    const overallResult = failedSubjects === 0 ? 'PASS' : 'FAIL';

    // Get grade scale for overall grade
    const gradeScales = await prisma.gradeScale.findMany({
      orderBy: {
        minPercent: 'desc',
      },
    });

    let overallGrade = 'F';
    for (const scale of gradeScales) {
      const minPercent = parseFloat(scale.minPercent.toString());
      const maxPercent = parseFloat(scale.maxPercent.toString());

      if (overallPercentage >= minPercent && overallPercentage <= maxPercent) {
        overallGrade = scale.name;
        break;
      }
    }

    // Get student's rank in class (optional)
    const classResults = await prisma.examResult.findMany({
      where: {
        examId: params.id,
        student: {
          classId: student.classId,
        },
      },
      include: {
        student: {
          select: {
            id: true,
          },
        },
      },
    });

    // Calculate total marks for each student
    const studentTotals = new Map<string, number>();
    classResults.forEach((result) => {
      const studentId = result.student.id;
      const marks = result.isAbsent ? 0 : parseFloat(result.marksObtained.toString());
      const current = studentTotals.get(studentId) || 0;
      studentTotals.set(studentId, current + marks);
    });

    // Sort students by total marks
    const sortedStudents = Array.from(studentTotals.entries())
      .sort((a, b) => b[1] - a[1]);

    const rank = sortedStudents.findIndex(([id]) => id === params.studentId) + 1;
    const totalStudents = sortedStudents.length;

    // Prepare report card data
    const reportCard = {
      exam: {
        id: exam.id,
        name: exam.name,
        examType: exam.examType,
        academicYear: exam.academicYear.name,
        class: exam.class.name,
        maxMarks: exam.maxMarks,
        passingMarks: exam.passingMarks,
      },
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        class: student.class?.name,
        section: student.section?.name,
        dateOfBirth: student.dateOfBirth,
        photo: student.photo,
      },
      results: {
        subjects: subjectResults,
        summary: {
          totalMarksObtained,
          totalMaxMarks,
          subjectCount,
          percentage: overallPercentage.toFixed(2),
          grade: overallGrade,
          result: overallResult,
          failedSubjects,
          rank,
          totalStudents,
        },
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(reportCard);
  } catch (error) {
    console.error('Error generating report card:', error);
    return NextResponse.json(
      { error: 'Failed to generate report card' },
      { status: 500 }
    );
  }
}
