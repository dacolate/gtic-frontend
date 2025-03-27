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

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t("errors.gradeNameRequired"),
    }),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/courses/${course.id}/grades`, {
        ...values,
        courseId: course.id,
      });

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
                    <Input placeholder={t("gradeNamePlaceholder")} {...field} />
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
