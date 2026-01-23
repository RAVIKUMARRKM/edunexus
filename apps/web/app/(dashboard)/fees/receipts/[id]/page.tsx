'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/components/fees/Receipt';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function ReceiptViewPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;

  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [paymentId]);

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`/api/fees/receipt/${paymentId}`);
      if (!response.ok) throw new Error('Failed to fetch receipt');
      const data = await response.json();
      setReceiptData(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch receipt');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading receipt...</p>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Failed to load receipt</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Fee Receipt</h1>
          <p className="text-gray-500 mt-1">Receipt No: {receiptData.payment.receiptNo}</p>
        </div>
      </div>

      {/* Receipt */}
      <Receipt payment={receiptData.payment} schoolInfo={receiptData.schoolInfo} />
    </div>
  );
}
