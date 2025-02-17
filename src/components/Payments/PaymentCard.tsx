import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@/types/payment";
import { CalendarIcon, CreditCardIcon, UserIcon } from "lucide-react";

interface PaymentCardProps {
  payment: Payment;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="flex justify-between items-center">
          <span>${Number.parseFloat(payment.amount).toFixed(2)}</span>
          <Badge variant={getPaymentStatusVariant(payment.paymentStatus)}>
            {payment.paymentStatus || "Unknown"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4 space-y-2">
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>{payment.studentName}</span>
        </div>
        <div className="flex items-center">
          <CreditCardIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>{payment.className}</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getPaymentStatusVariant(
  status: string | undefined
): "default" | "success" | "warning" | "destructive" {
  if (!status) return "default";
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "late":
      return "destructive";
    default:
      return "default";
  }
}
