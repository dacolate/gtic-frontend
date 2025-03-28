// components/AddGradeDialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LoadingButton from "../LoadingButton";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";

interface AddGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: {
    id: number;
    name: string;
  };
  onSuccess?: () => void;
  className?: string;
}

export function AddGradeDialog({
  open,
  onOpenChange,
  course,
  onSuccess,
  className,
}: AddGradeDialogProps) {
  const t = useTranslations("AddGradeDialog");
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t("errors.gradeNameRequired"),
    }),
    description: z.string().optional(),
    registrationFee: z.number().min(0),
    firstInstalmentFee: z.number().min(0),
    firstInstalmentDeadline: z.date(),
    secondInstalmentFee: z.number().min(0),
    secondInstalmentDeadline: z.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      registrationFee: 0,
      firstInstalmentFee: 0,
      firstInstalmentDeadline: new Date(),
      secondInstalmentFee: 0,
      secondInstalmentDeadline: new Date(),
    },
  });

  // Helper function to calculate days from today's date
  const calculateDaysFromDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/grades`, {
        ...values,
        courseId: course.id,
        firstInstalmentDeadline: values.firstInstalmentDeadline?.toISOString(),
        secondInstalmentDeadline:
          values.secondInstalmentDeadline?.toISOString(),
      });
      console.log(response);

      if (response.data.success) {
        toast({
          title: t("success.title"),
          description: t("success.description"),
        });
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        const errors: { [key: string]: string } = {};
        if (Array.isArray(errorData.data)) {
          errorData.data.forEach(
            (error: { field: string; message: string }) => {
              errors[error.field] = error.message;
            }
          );
        } else {
          errors["general"] = errorData.data;
        }
        setApiErrors(errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence>
              {!showPricing && (
                <div className="flex-col space-y-4">
                  {/* Course Field (disabled) */}
                  <div className="space-y-2">
                    <Label>{t("courseLabel")}</Label>
                    <Input disabled value={course.name} />
                  </div>

                  {/* Grade Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("gradeNameLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("gradeNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("descriptionLabel")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("descriptionPlaceholder")}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </AnimatePresence>

            {/* Pricing Section */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPricing(!showPricing)}
              >
                {showPricing ? t("hidePricing") : t("showPricing")}
              </Button>

              <AnimatePresence>
                {showPricing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Registration Fee */}
                      <FormField
                        control={form.control}
                        name="registrationFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("pricing.registrationFee")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute right-3 top-1.5">
                                  F
                                </span>
                                <Input
                                  type="number"
                                  className="pl-8"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const parsedValue =
                                      value === ""
                                        ? null
                                        : Number.parseFloat(value);
                                    field.onChange(
                                      isNaN(parsedValue || 1)
                                        ? null
                                        : parsedValue
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* First Instalment */}
                      <FormField
                        control={form.control}
                        name="firstInstalmentFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("pricing.firstInstalmentFee")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute right-3 top-1.5">
                                  F
                                </span>
                                <Input
                                  type="number"
                                  className="pl-8"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const parsedValue =
                                      value === ""
                                        ? null
                                        : Number.parseFloat(value);
                                    field.onChange(
                                      isNaN(parsedValue || 1)
                                        ? null
                                        : parsedValue
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondInstalmentFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("pricing.secondInstalmentFee")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute right-3 top-1.5">
                                  F
                                </span>
                                <Input
                                  type="number"
                                  className="pl-8"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const parsedValue =
                                      value === ""
                                        ? null
                                        : Number.parseFloat(value);
                                    field.onChange(
                                      isNaN(parsedValue || 1)
                                        ? null
                                        : parsedValue
                                    );
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firstInstalmentDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("pricing.firstInstalmentDeadlineDays")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  {...field}
                                  value={
                                    field.value
                                      ? calculateDaysFromDate(field.value)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const days = parseInt(e.target.value);
                                    if (!isNaN(days)) {
                                      const date = new Date();
                                      date.setDate(date.getDate() + days);
                                      field.onChange(date);
                                    } else {
                                      field.onChange(null);
                                    }
                                  }}
                                />
                                <span className="absolute right-3 top-1.5">
                                  {t("days")}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Second Instalment */}

                      <FormField
                        control={form.control}
                        name="secondInstalmentDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("pricing.secondInstalmentDeadlineDays")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  {...field}
                                  value={
                                    field.value
                                      ? calculateDaysFromDate(field.value)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const days = parseInt(e.target.value);
                                    if (!isNaN(days)) {
                                      const date = new Date();
                                      date.setDate(date.getDate() + days);
                                      field.onChange(date);
                                    } else {
                                      field.onChange(null);
                                    }
                                  }}
                                />
                                <span className="absolute right-3 top-1.5">
                                  {t("days")}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Display */}
            {apiErrors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiErrors.general}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setApiErrors({});
                }}
              >
                {t("cancelButton")}
              </Button>
              <LoadingButton loading={isLoading} type="submit">
                {t("submitButton")}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
