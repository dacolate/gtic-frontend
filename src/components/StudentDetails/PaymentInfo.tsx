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
import { Student } from "@/lib/types";
import { formatReadableDate, generateAndDownloadPdf2 } from "@/lib/utils";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

export function PaymentInfo({ student }: { student: Student }) {
  const payments = student.payments;
  const t = useTranslations("PaymentInfo");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("paymentInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("download")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatReadableDate(payment.createdAt)}</TableCell>
                <TableCell>
                  {payment.amount} {t("currency")}
                </TableCell>
                <TableCell>
                  <Button onClick={() => generateAndDownloadPdf2(payment)}>
                    <Download />
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
