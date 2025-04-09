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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "validation.name.min" })
    .max(64, { message: "validation.name.max" }),
  email: z.string().email({ message: "validation.email.invalid" }),
  password: z
    .string()
    .min(8, { message: "validation.password.min" })
    .max(512, { message: "validation.password.max" }),
});

export function NewUserDialog() {
  const t = useTranslations("userDialog");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      setApiErrors({});

      console.log("tac", values);

      const response = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log("responsessss", response);

      if (response.data.success) {
        toast({
          title: t("success.title"),
          description: t("success.description"),
        });
        setOpen(false);
        form.reset();
      } else {
        toast({
          title: t("error.title"),
          description: response.data.message || t("error.description"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
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
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 w-full">
          {t("triggerButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="px-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("form.name.label")}</Label>
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
                      <Label>{t("form.email.label")}</Label>
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
                      <Label>{t("form.password.label")}</Label>
                      <FormControl>
                        <Input
                          placeholder={t("form.password.placeholder")}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {apiErrors.general && (
                  <div className="text-red-500 text-sm">
                    {apiErrors.general}
                  </div>
                )}

                <CardFooter className="flex justify-between px-0 pb-0 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    {t("form.cancel")}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t("form.submitting") : t("form.submit")}
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
