import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Payment, Student } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";

export function PaymentInfo({ student }: { student: Student }) {
  const payments = student.payments;

  const handleDownload = (payment: Payment) => {
    const receiptContent = `Receipt\n\nDate: ${formatReadableDate(
      payment.createdAt
    )}\nAmount: ${payment.amount} FCFA\nPayment Method: ${
      payment.paymentMethod || "N/A"
    }\nDetails: ${payment.details || "No details provided"}`;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt_${payment.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatReadableDate(payment.createdAt)}</TableCell>
                <TableCell>{payment.amount} FCFA</TableCell>
                <TableCell>
                  <Button onClick={() => handleDownload(payment)}>
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
