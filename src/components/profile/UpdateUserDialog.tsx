"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import LoadingButton from "../LoadingButton";

const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "validation.name.min" })
    .max(64, { message: "validation.name.max" }),
  email: z.string().email({ message: "validation.email.invalid" }),
  password: z
    .string()
    .min(8, { message: "validation.password.min" })
    .max(512, { message: "validation.password.max" })
    .optional()
    .or(z.literal("")), // Allow empty password for optional update
});

interface UpdateUserDialogProps {
  userId: string;
  defaultValues: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function UpdateUserDialog({
  userId,
  defaultValues,
  children,
  onSuccess,
}: UpdateUserDialogProps) {
  const t = useTranslations("userDialog.update");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: defaultValues.name,
      email: defaultValues.email,
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      setIsLoading(true);
      setApiErrors({});

      // Prepare payload - don't send password if it's empty
      const payload: {
        name: string;
        email: string;
        password?: string;
      } = {
        name: values.name,
        email: values.email,
      };

      if (values.password && values.password.trim() !== "") {
        payload.password = values.password;
      }

      const response = await api.put(`/users/${userId}`, payload);

      if (response.data.success) {
        toast({
          title: t("success.title"),
          description: t("success.description"),
        });
        setOpen(false);
        form.reset();
        onSuccess?.(); // Call success callback if provided
      } else {
        toast({
          title: t("error.title"),
          description: response.data.message || t("error.description"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData.message) {
          setApiErrors({ general: errorData.message });
        }
        if (Array.isArray(errorData.data)) {
          const errors: Record<string, string> = {};
          errorData.data.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setApiErrors(errors);
        }
      } else {
        setApiErrors({ general: t("error.unexpected") });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.name.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.email.placeholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.password.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.password.placeholder")}
                      type="password"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    {t("form.password.hint")}
                  </p>
                </FormItem>
              )}
            />

            {apiErrors.general && (
              <div className="text-red-500 text-sm">{apiErrors.general}</div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                {t("form.cancel")}
              </Button>
              <LoadingButton loading={isLoading} type="submit">
                {t("form.submit")}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
