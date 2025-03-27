"use client";

import React, { useState } from "react";
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Feather } from "lucide-react";
import { useTranslations } from "next-intl";
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
const courseSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(64, { message: "Name must be at most 64 characters" }),
  description: z.string().optional(),
  pricingId: z.number().optional(),
});

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  // const [pricings, setPricings] = useState<
  //   { id: number; description: string }[]
  // >([]);

  const t = useTranslations("CreateCourseDialog");

  // Initialize the form
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      pricingId: undefined,
    },
  });

  // // Fetch pricings when dialog opens
  // React.useEffect(() => {
  //   if (open) {
  //     const fetchPricings = async () => {
  //       try {
  //         const response = await api.get("/pricings");
  //         setPricings(response.data);
  //       } catch (error) {
  //         console.error("Failed to fetch pricings:", error);
  //       }
  //     };
  //     fetchPricings();
  //   }
  // }, [open]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof courseSchema>) => {
    try {
      setIsLoading(true);
      setApiErrors({});

      // Prepare the course data
      const courseData = {
        name: values.name,
        description: values.description,
        pricing_id: values.pricingId,
      };

      // Send the course data to the API
      const response = await api.post("/courses", courseData);

      if (response.data.success) {
        toast({
          title: t("successTitle"),
          description: t("successDescription"),
        });
        setOpen(false); // Close the dialog
        form.reset(); // Reset the form
      } else {
        toast({
          title: t("errorTitle"),
          description: response.data.message || t("errorDescription"),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
          <Feather className="h-4 w-4 font-extrabold" />

          {t("createCourse")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("createCourse")}</DialogTitle>
          <DialogDescription>
            {t("createNewCourseDescription")}
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="px-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Course Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">{t("name")}</Label>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder={t("namePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="description">{t("description")}</Label>
                      <FormControl>
                        <Input
                          id="description"
                          placeholder={t("descriptionPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pricing */}
                {/* <FormField
                  control={form.control}
                  name="pricingId"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="pricing">{t("pricing")}</Label>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : undefined)
                        }
                      >
                        <FormControl>
                          <SelectTrigger id="pricing">
                            <SelectValue placeholder={t("selectPricing")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">{t("noPricing")}</SelectItem>
                          {pricings.map((pricing) => (
                            <SelectItem
                              key={pricing.id}
                              value={pricing.id.toString()}
                            >
                              {pricing.description || `Pricing #${pricing.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* API Errors */}
                {apiErrors.general && (
                  <div className="text-red-500 text-sm">
                    {apiErrors.general}
                  </div>
                )}

                {/* Form Actions */}
                <CardFooter className="flex justify-between px-0 pb-0 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t("submitting") : t("create")}
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
