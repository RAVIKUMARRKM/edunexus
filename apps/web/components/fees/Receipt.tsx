'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface ReceiptProps {
  payment: {
    id: string;
    receiptNo: string;
    amount: number;
    discount: number;
    lateFee: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    paymentDate: Date;
    paymentMode: string;
    transactionId: string | null;
    forMonth: Date;
    remarks: string | null;
    student: {
      firstName: string;
      lastName: string;
      admissionNo: string;
      class: {
        name: string;
      } | null;
      section: {
        name: string;
      } | null;
    };
    feeStructure: {
      name: string;
      feeType: string;
    };
  };
  schoolInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

export function Receipt({ payment, schoolInfo }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Fee Receipt - ${payment.receiptNo}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  margin: 0;
                }
                .receipt {
                  max-width: 800px;
                  margin: 0 auto;
                  border: 2px solid #000;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  border-bottom: 2px solid #000;
                  padding-bottom: 10px;
                  margin-bottom: 20px;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                }
                .header p {
                  margin: 5px 0;
                  font-size: 12px;
                }
                .receipt-title {
                  text-align: center;
                  font-size: 18px;
                  font-weight: bold;
                  margin: 20px 0;
                  text-decoration: underline;
                }
                .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 10px 0;
                  font-size: 14px;
                }
                .info-label {
                  font-weight: bold;
                }
                .table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                }
                .table th,
                .table td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
                }
                .table th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                }
                .table td.right {
                  text-align: right;
                }
                .total-row {
                  font-weight: bold;
                  background-color: #f9f9f9;
                }
                .signature {
                  margin-top: 40px;
                  display: flex;
                  justify-content: space-between;
                }
                .signature-box {
                  text-align: center;
                }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  font-size: 12px;
                  border-top: 1px solid #000;
                  padding-top: 10px;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handlePrint}>Print Receipt</Button>
      </div>

      <div ref={receiptRef}>
        <Card className="receipt">
          <CardContent className="p-8">
            {/* Header */}
            <div className="header text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-2xl font-bold">{schoolInfo.name}</h1>
              <p className="text-sm mt-2">{schoolInfo.address}</p>
              <p className="text-sm">
                Phone: {schoolInfo.phone} | Email: {schoolInfo.email}
              </p>
            </div>

            {/* Receipt Title */}
            <div className="receipt-title text-center text-xl font-bold my-6 underline">
              FEE RECEIPT
            </div>

            {/* Receipt Info */}
            <div className="space-y-2 mb-6">
              <div className="info-row flex justify-between">
                <span className="info-label font-bold">Receipt No:</span>
                <span>{payment.receiptNo}</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label font-bold">Date:</span>
                <span>{format(new Date(payment.paymentDate), 'dd/MM/yyyy')}</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label font-bold">Payment Mode:</span>
                <span>{payment.paymentMode.replace('_', ' ')}</span>
              </div>
              {payment.transactionId && (
                <div className="info-row flex justify-between">
                  <span className="info-label font-bold">Transaction ID:</span>
                  <span>{payment.transactionId}</span>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="border-t-2 border-b-2 border-black py-4 my-6">
              <div className="space-y-2">
                <div className="info-row flex justify-between">
                  <span className="info-label font-bold">Student Name:</span>
                  <span>
                    {payment.student.firstName} {payment.student.lastName}
                  </span>
                </div>
                <div className="info-row flex justify-between">
                  <span className="info-label font-bold">Admission No:</span>
                  <span>{payment.student.admissionNo}</span>
                </div>
                <div className="info-row flex justify-between">
                  <span className="info-label font-bold">Class:</span>
                  <span>
                    {payment.student.class?.name}
                    {payment.student.section && ` - ${payment.student.section.name}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <table className="table w-full border-collapse my-6">
              <thead>
                <tr>
                  <th className="border border-black p-2 bg-gray-100">
                    Particulars
                  </th>
                  <th className="border border-black p-2 bg-gray-100 text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">
                    {payment.feeStructure.name} (
                    {format(new Date(payment.forMonth), 'MMMM yyyy')})
                  </td>
                  <td className="border border-black p-2 text-right">
                    {payment.amount.toFixed(2)}
                  </td>
                </tr>
                {payment.lateFee > 0 && (
                  <tr>
                    <td className="border border-black p-2">Late Fee</td>
                    <td className="border border-black p-2 text-right">
                      {payment.lateFee.toFixed(2)}
                    </td>
                  </tr>
                )}
                {payment.discount > 0 && (
                  <tr>
                    <td className="border border-black p-2">Discount</td>
                    <td className="border border-black p-2 text-right text-red-600">
                      -{payment.discount.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="total-row bg-gray-50">
                  <td className="border border-black p-2 font-bold">
                    Total Amount
                  </td>
                  <td className="border border-black p-2 text-right font-bold">
                    {payment.totalAmount.toFixed(2)}
                  </td>
                </tr>
                <tr className="total-row bg-gray-50">
                  <td className="border border-black p-2 font-bold">
                    Amount Paid
                  </td>
                  <td className="border border-black p-2 text-right font-bold">
                    {payment.paidAmount.toFixed(2)}
                  </td>
                </tr>
                {payment.dueAmount > 0 && (
                  <tr className="total-row bg-gray-50">
                    <td className="border border-black p-2 font-bold">
                      Balance Due
                    </td>
                    <td className="border border-black p-2 text-right font-bold text-red-600">
                      {payment.dueAmount.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Amount in Words */}
            <div className="my-4">
              <p className="font-bold">
                Amount in Words:{' '}
                <span className="font-normal capitalize">
                  {/* You can add a number-to-words converter here */}
                  Rupees {Math.floor(payment.paidAmount)} Only
                </span>
              </p>
            </div>

            {/* Remarks */}
            {payment.remarks && (
              <div className="my-4">
                <p className="font-bold">
                  Remarks: <span className="font-normal">{payment.remarks}</span>
                </p>
              </div>
            )}

            {/* Signature */}
            <div className="signature flex justify-between mt-12">
              <div className="signature-box">
                <div className="border-t border-black pt-2 mt-8 w-40">
                  <p className="text-sm">Received By</p>
                </div>
              </div>
              <div className="signature-box">
                <div className="border-t border-black pt-2 mt-8 w-40">
                  <p className="text-sm">Authorized Signatory</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer text-center text-xs mt-8 pt-4 border-t border-black">
              <p>This is a computer-generated receipt and does not require a signature.</p>
              <p className="mt-1">
                For any queries, please contact the accounts department.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
