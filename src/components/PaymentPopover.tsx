"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import type { Student, StudentClass } from "@/lib/types";
import { capitalizeFullName } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axios";
import { AxiosError } from "axios";

// Define the form schema using zod
const paymentSchema = z.object({
  classId: z.string().min(1, { message: "Class is required" }),
  amount: z
    .number({ required_error: "Amount is required" })
    .min(0.01, { message: "Amount must be at least 0.01" }),
  paymentMethod: z.enum(["Cash", "OM", "MOMO", "Bank", "Other"]),
});

export function PaymentPopover({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);
  const [selectedStudentClass, setSelectedStudentClass] =
    useState<StudentClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const [paidTooMuch, setPaidTooMuch] = useState(false);

  const studentClasses = student.student_classes;
  const t = useTranslations("PaymentPopover");

  // Initialize the form
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      classId: "",
      amount: 0,
      paymentMethod: "Cash",
    },
  });

  // Watch the selected class ID
  const selectedClassId = form.watch("classId");

  // Update the selected student class and pre-fill the amount when the class changes
  useEffect(() => {
    if (selectedClassId && studentClasses) {
      const foundClass = studentClasses.find(
        (sc) => sc.class?.id?.toString() === selectedClassId
      );
      setSelectedStudentClass(foundClass || null);

      // Pre-fill the amount if there's a remaining payment
      if (foundClass && foundClass.remainingPayment) {
        form.setValue("amount", parseInt(foundClass.remainingPayment));
      } else {
        form.setValue("amount", 0);
      }
    } else {
      setSelectedStudentClass(null);
      form.setValue("amount", 0);
    }
  }, [selectedClassId, studentClasses, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    try {
      setIsLoading(true);
      setPaidTooMuch(false);
      setApiErrors({});

      const paymentAmount = form.getValues().amount;

      if (
        selectedStudentClass &&
        paymentAmount > parseInt(selectedStudentClass?.remainingPayment)
      ) {
        setPaidTooMuch(true);
        console.log("Form submission blocked: Paid too much.");
        return; // Stop submission
      }
      // Prepare the payment data
      const paymentData = {
        studentId: student.id,
        classId: Number.parseInt(values.classId),
        amount: values.amount,
        paymentMethod: values.paymentMethod,
      };

      // Send the payment data to the API
      const response = await api.post("/payments", paymentData);

      if (response.data.success) {
        toast({
          title: t("paymentSuccessful"),
          description: t("paymentProcessedSuccessfully"),
        });
        setOpen(false); // Close the dialog
        form.reset(); // Reset the form
      } else {
        toast({
          title: t("paymentFailed"),
          description: response.data.message || t("errorProcessingPayment"),
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData.message) {
          setApiErrors({ general: errorData.message });
        }
        if (Array.isArray(errorData.data)) {
          const errors: { [key: string]: string } = {};
          errorData.data.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setApiErrors(errors);
        }
      } else {
        setApiErrors({ general: t("unexpectedError") });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if payment is up to date
  const isPaymentUpToDate =
    selectedStudentClass?.paymentStatus === "Up to date";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          {t("addPayment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("addPayment")}</DialogTitle>
          <DialogDescription>
            {t("newPaymentFrom")}{" "}
            {capitalizeFullName(student.name + " " + student.firstname)}
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="px-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Class Selection */}
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="class">{t("paymentClass")}</Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        required
                      >
                        <FormControl>
                          <SelectTrigger id="class">
                            <SelectValue
                              placeholder={t("selectPaymentClass")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studentClasses?.map((studClass) => (
                            <SelectItem
                              key={studClass.class?.id}
                              value={studClass.class?.id?.toString() || ""}
                            >
                              {studClass.class?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Status */}
                {selectedStudentClass && (
                  <div
                    className={cn(
                      "p-3 rounded-md flex items-center gap-2",
                      isPaymentUpToDate
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}
                  >
                    {isPaymentUpToDate ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {isPaymentUpToDate
                          ? t("paymentUpToDate")
                          : t("paymentNotUpToDate")}
                      </p>
                      {selectedStudentClass.remainingPayment && (
                        <p className="text-sm">
                          {t("remaining")}: XAF{" "}
                          {selectedStudentClass.remainingPayment}
                        </p>
                      )}
                      {selectedStudentClass.nextdeadline && (
                        <p className="text-sm">
                          {isPaymentUpToDate ? t("next") : t("missed")}{" "}
                          {t("deadline")}:{" "}
                          {new Date(
                            selectedStudentClass.nextdeadline
                          ).toLocaleDateString()}
                          {selectedStudentClass.daysTilDeadline !== null && (
                            <span>
                              {" "}
                              ({selectedStudentClass.daysTilDeadline}{" "}
                              {t("days")}{" "}
                              {isPaymentUpToDate ? t("left") : t("ago")})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="amount">{t("amount")}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          XAF
                        </span>
                        <FormControl>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-12"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number.parseFloat(e.target.value))
                            }
                            required
                            min="0.01"
                            step="0.01"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="payment-method">
                        {t("paymentMethod")}
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        required
                      >
                        <FormControl>
                          <SelectTrigger id="payment-method">
                            <SelectValue
                              placeholder={t("selectPaymentMethod")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">{t("cash")}</SelectItem>
                          <SelectItem value="OM">{t("om")}</SelectItem>
                          <SelectItem value="MOMO">{t("momo")}</SelectItem>
                          <SelectItem value="Bank">{t("bank")}</SelectItem>
                          <SelectItem value="Other">{t("other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* API Errors */}
                {apiErrors.general && (
                  <div className="text-red-500 text-sm">
                    {apiErrors.general}
                  </div>
                )}
                {paidTooMuch && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{t("paidTooMuch")}</AlertDescription>
                  </Alert>
                )}

                {/* Form Actions */}
                <CardFooter className="flex justify-between px-0 pb-0 pt-5">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setOpen(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t("submitting") : t("submitPayment")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
