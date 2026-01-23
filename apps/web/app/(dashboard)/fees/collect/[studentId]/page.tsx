'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentForm } from '@/components/fees/PaymentForm';
import { FeeStatusCard } from '@/components/fees/FeeStatusCard';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface FeeStatus {
  student: any;
  academicYear: any;
  feeStatus: any[];
  summary: {
    totalAmount: number;
    totalPaid: number;
    totalBalance: number;
    totalConcession: number;
  };
  recentPayments: any[];
}

export default function CollectFeeForStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  const [feeStatus, setFeeStatus] = useState<FeeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeeStatus();
  }, [studentId]);

  const fetchFeeStatus = async () => {
    try {
      const response = await fetch(`/api/fees/status/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch fee status');
      const data = await response.json();
      setFeeStatus(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch fee status');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (payment: any) => {
    toast.success('Payment recorded successfully');
    fetchFeeStatus(); // Refresh fee status
    router.push(`/fees/receipts/${payment.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading fee status...</p>
      </div>
    );
  }

  if (!feeStatus) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Failed to load fee status</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const { student, academicYear, feeStatus: fees, summary, recentPayments } = feeStatus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Collect Fee</h1>
          <p className="text-gray-500 mt-1">
            {student.firstName} {student.lastName} | {student.admissionNo}
          </p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold">
                {student.firstName} {student.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Admission No</p>
              <p className="font-semibold">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-semibold">{student.class?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-semibold">{academicYear.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{summary.totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ₹{summary.totalPaid.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Concession
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              ₹{summary.totalConcession.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Balance Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ₹{summary.totalBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="collect" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collect">Collect Payment</TabsTrigger>
          <TabsTrigger value="status">Fee Status</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="collect" className="space-y-4">
          <PaymentForm
            studentId={studentId}
            feeStructures={fees.map((f) => ({
              id: f.feeStructure.id,
              name: f.feeStructure.name,
              amount: f.balance,
              feeType: f.feeStructure.feeType,
            }))}
            onSuccess={handlePaymentSuccess}
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fees.map((fee) => (
              <FeeStatusCard key={fee.feeStructure.id} {...fee} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No payment history available
                </p>
              ) : (
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{payment.receiptNo}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleDateString()} |{' '}
                          {payment.feeStructure.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{payment.paidAmount.toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/fees/receipts/${payment.id}`)}
                        >
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
