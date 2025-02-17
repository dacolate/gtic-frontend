import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function PaymentInfo({ studentId }: { studentId: string }) {
  const payments = [
    { id: 1, date: "2023-01-15", amount: 500, status: "Paid" },
    { id: 2, date: "2023-02-15", amount: 500, status: "Paid" },
    { id: 3, date: "2023-03-15", amount: 500, status: "Pending" },
  ];

  const totalPaid = payments.reduce(
    (sum, payment) => (payment.status === "Paid" ? sum + payment.amount : sum),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Payment Information
          <Badge variant="secondary">Total Paid: ${totalPaid}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "Paid" ? "default" : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
