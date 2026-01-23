'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeeStatusCardProps {
  feeStructure: {
    id: string;
    name: string;
    feeType: string;
    amount: number;
    frequency: string;
  };
  totalAmount: number;
  concessionAmount: number;
  netAmount: number;
  totalPaid: number;
  balance: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  concession?: {
    concessionType: string;
    amount: number;
    percentage: number | null;
  };
}

export function FeeStatusCard({
  feeStructure,
  totalAmount,
  concessionAmount,
  netAmount,
  totalPaid,
  balance,
  status,
  concession,
}: FeeStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNPAID':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'ONE_TIME':
        return 'One Time';
      case 'MONTHLY':
        return 'Monthly';
      case 'QUARTERLY':
        return 'Quarterly';
      case 'HALF_YEARLY':
        return 'Half Yearly';
      case 'YEARLY':
        return 'Yearly';
      default:
        return frequency;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          {feeStructure.name}
        </CardTitle>
        <Badge className={getStatusColor(status)}>{status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium">
              {feeStructure.feeType.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Frequency:</span>
            <span className="font-medium">
              {getFrequencyLabel(feeStructure.frequency)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
          </div>
          {concessionAmount > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Concession:</span>
                <span className="font-medium text-green-600">
                  - ₹{concessionAmount.toFixed(2)}
                  {concession?.percentage && ` (${concession.percentage}%)`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Concession Type:</span>
                <span className="font-medium text-xs">
                  {concession?.concessionType.replace('_', ' ')}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-500">Net Amount:</span>
            <span className="font-semibold">₹{netAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Paid:</span>
            <span className="font-medium text-green-600">
              ₹{totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t pt-2">
            <span>Balance:</span>
            <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
              ₹{balance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                status === 'PAID'
                  ? 'bg-green-500'
                  : status === 'PARTIAL'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{
                width: `${netAmount > 0 ? (totalPaid / netAmount) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {netAmount > 0 ? ((totalPaid / netAmount) * 100).toFixed(1) : 0}% paid
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
