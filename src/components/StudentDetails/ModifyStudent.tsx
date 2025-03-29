"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Student } from "@/lib/types";
import LoadingButton from "../LoadingButton";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ModifyStudentFormProps {
  studentId: string; // Pass the student data as a prop
}

export function ModifyStudentForm({ studentId }: ModifyStudentFormProps) {
  const t = useTranslations("NewStud");
  const [student, setStudent] = useState<Student>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false); // New state to track if data is loaded

  const formSchema = z.object({
    // Student Info
    name: z.string().min(2, { message: t("errors.nameRequired") }),
    firstname: z.string().min(2, { message: t("errors.firstNameRequired") }),
    nationality: z
      .string()
      .min(2, { message: t("errors.nationalityRequired") })
      .optional(),
    birthday: z.date({ required_error: t("errors.birthdayRequired") }),
    cni: z
      .string()
      .nullable()
      .transform((val) => (val === "" ? null : val)), // Transform empty string to null
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
      message: t("errors.phoneRequired"),
    }),
    email: z
      .string()
      .email({ message: t("errors.emailInvalid") })
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .optional(), // Transform empty string to null
    address: z
      .string()
      .nullable()
      .transform((val) => (val === "" ? null : val)), // Transform empty string to null
    gender: z.string().max(1),

    // Parent Info
    parentName: z
      .string()
      .min(2, { message: "Parent name must be at least 2 characters." })
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .optional(), // Transform empty string to null
    parentPhone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, {
        message: "Phone number between 7 and 15 digits",
      })
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .optional(), // Transform empty string to null
    parentEmail: z
      .string()
      .email({ message: "Invalid parent email address." })
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .optional(), // Transform empty string to null
  });

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await api.get("/students/" + studentId);
        if (response.data.success) {
          setStudent(response.data.data);

          // Update form defaultValues with fetched student data
          form.reset({
            name: response.data.data.name,
            firstname: response.data.data.firstname,
            nationality: response.data.data.nationality,
            birthday: new Date(response.data.data.birthday),
            cni: response.data.data.cni || "",
            phone: response.data.data.phone,
            address: response.data.data.address || "",
            gender: response.data.data.gender,
          });
          setIsDataLoaded(true); // Set data loaded to true
        } else {
          console.log("Fetch failed:", response);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "An error occurred");
        } else if (err instanceof Error) {
          setError(err.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
      }
    }

    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Add `studentId` to the dependency array

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/students/${student?.id}`, values);
      if (response.data.success) {
        toast({
          title: t("success.studentUpdated"),
          description: t("success.studentUpdatedMessage"),
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        setError(errorMessage);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
      console.log("error", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("studentInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("studentInfo.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("studentInfo.firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("studentInfo.nationality")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. American"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("studentInfo.birthday")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal")}
                            disabled={!isDataLoaded} // Disable until data is loaded
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("studentInfo.pickadate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("studentInfo.cni")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456789"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("studentInfo.phone")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 234 567 8900"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
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
                    <FormLabel>{t("studentInfo.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                        onChange={(e) => {
                          const value =
                            e.target.value.trim() === ""
                              ? null
                              : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Main St, City, Country"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("studentInfo.gender")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value ?? ""}
                      disabled={!isDataLoaded} // Disable until data is loaded
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">
                          {t("studentInfo.male")}
                        </SelectItem>
                        <SelectItem value="F">
                          {t("studentInfo.female")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("parentInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("parentInfo.parentName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane Doe"
                        {...field}
                        value={field.value || ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                        onChange={(e) => {
                          const value =
                            e.target.value.trim() === ""
                              ? null
                              : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("parentInfo.parentPhone")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 234 567 8900"
                        {...field}
                        value={field.value || ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                        onChange={(e) => {
                          const value =
                            e.target.value.trim() === ""
                              ? null
                              : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("parentInfo.parentEmail")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jane@example.com"
                        {...field}
                        value={field.value || ""}
                        disabled={!isDataLoaded} // Disable until data is loaded
                        onChange={(e) => {
                          const value =
                            e.target.value.trim() === ""
                              ? null
                              : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <LoadingButton
          loading={isLoading}
          type="submit"
          className="w-full"
          disabled={!isDataLoaded} // Disable until data is loaded
        >
          {t("buttons.submit")}
        </LoadingButton>
      </form>
    </Form>
  );
}
