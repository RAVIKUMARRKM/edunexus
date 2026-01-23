'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';

const paymentSchema = z.object({
  feeStructureId: z.string().min(1, 'Fee structure is required'),
  amount: z.string().min(1, 'Amount is required'),
  discount: z.string().default('0'),
  lateFee: z.string().default('0'),
  paidAmount: z.string().min(1, 'Paid amount is required'),
  paymentMode: z.string().min(1, 'Payment mode is required'),
  transactionId: z.string().optional(),
  forMonth: z.string().min(1, 'Month is required'),
  remarks: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  studentId: string;
  feeStructures: Array<{
    id: string;
    name: string;
    amount: number;
    feeType: string;
  }>;
  onSuccess?: (payment: any) => void;
}

export function PaymentForm({
  studentId,
  feeStructures,
  onSuccess,
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      discount: '0',
      lateFee: '0',
      forMonth: format(new Date(), 'yyyy-MM'),
    },
  });

  const amount = watch('amount') || '0';
  const discount = watch('discount') || '0';
  const lateFee = watch('lateFee') || '0';
  const paymentMode = watch('paymentMode');

  // Calculate total whenever amount, discount, or lateFee changes
  const calculateTotal = () => {
    const amt = parseFloat(amount) || 0;
    const disc = parseFloat(discount) || 0;
    const late = parseFloat(lateFee) || 0;
    const total = amt + late - disc;
    setCalculatedTotal(total);
    setValue('paidAmount', total.toFixed(2));
  };

  const handleFeeStructureChange = (value: string) => {
    setValue('feeStructureId', value);
    const structure = feeStructures.find((f) => f.id === value);
    if (structure) {
      setValue('amount', structure.amount.toString());
      calculateTotal();
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/fees/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          feeStructureId: data.feeStructureId,
          amount: parseFloat(data.amount),
          discount: parseFloat(data.discount),
          lateFee: parseFloat(data.lateFee),
          paidAmount: parseFloat(data.paidAmount),
          paymentMode: data.paymentMode,
          transactionId: data.transactionId || undefined,
          forMonth: data.forMonth,
          remarks: data.remarks || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to record payment');
      }

      const payment = await response.json();
      toast.success('Payment recorded successfully');
      reset();
      onSuccess?.(payment);
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="feeStructureId">Fee Type</Label>
              <Select
                onValueChange={handleFeeStructureChange}
                defaultValue={watch('feeStructureId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  {feeStructures.map((structure) => (
                    <SelectItem key={structure.id} value={structure.id}>
                      {structure.name} - ₹{structure.amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.feeStructureId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.feeStructureId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Fee Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount')}
                onChange={(e) => {
                  register('amount').onChange(e);
                  calculateTotal();
                }}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                {...register('discount')}
                onChange={(e) => {
                  register('discount').onChange(e);
                  calculateTotal();
                }}
                placeholder="0.00"
              />
              {errors.discount && (
                <p className="text-sm text-red-500 mt-1">{errors.discount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lateFee">Late Fee (₹)</Label>
              <Input
                id="lateFee"
                type="number"
                step="0.01"
                {...register('lateFee')}
                onChange={(e) => {
                  register('lateFee').onChange(e);
                  calculateTotal();
                }}
                placeholder="0.00"
              />
              {errors.lateFee && (
                <p className="text-sm text-red-500 mt-1">{errors.lateFee.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paidAmount">Paid Amount (₹)</Label>
              <Input
                id="paidAmount"
                type="number"
                step="0.01"
                {...register('paidAmount')}
                placeholder="0.00"
              />
              {errors.paidAmount && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.paidAmount.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Total: ₹{calculatedTotal.toFixed(2)}
              </p>
            </div>

            <div>
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select
                onValueChange={(value) => setValue('paymentMode', value)}
                defaultValue={watch('paymentMode')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="DD">Demand Draft</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.paymentMode.message}
                </p>
              )}
            </div>

            {paymentMode && !['CASH'].includes(paymentMode) && (
              <div>
                <Label htmlFor="transactionId">
                  {paymentMode === 'CHEQUE'
                    ? 'Cheque Number'
                    : paymentMode === 'DD'
                    ? 'DD Number'
                    : 'Transaction ID'}
                </Label>
                <Input
                  id="transactionId"
                  {...register('transactionId')}
                  placeholder={
                    paymentMode === 'CHEQUE'
                      ? 'Enter cheque number'
                      : paymentMode === 'DD'
                      ? 'Enter DD number'
                      : 'Enter transaction ID'
                  }
                />
              </div>
            )}

            <div>
              <Label htmlFor="forMonth">For Month</Label>
              <Input
                id="forMonth"
                type="month"
                {...register('forMonth')}
              />
              {errors.forMonth && (
                <p className="text-sm text-red-500 mt-1">{errors.forMonth.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Input
                id="remarks"
                {...register('remarks')}
                placeholder="Add any additional notes"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
