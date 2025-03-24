"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { cn, generateAndDownloadPdf } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Course, NewStudResponse, Student } from "@/lib/types";
import LoadingButton from "../LoadingButton";
import { useTranslations } from "next-intl";

export function NewStud() {
  const t = useTranslations("NewStud");
  const [showClassPricing, setShowClassPricing] = useState(false);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const [existingStudent, setExistingStudent] = useState<[Student, string]>();
  const [showExceptionalPricing, setShowExceptionalPricing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const formSchema = z.object({
    // Student Info
    name: z.string().min(2, { message: t("errors.nameRequired") }),
    firstname: z.string().min(2, { message: t("errors.firstNameRequired") }),
    nationality: z
      .string()
      .min(2, { message: t("errors.nationalityRequired") }),
    birthday: z.date({ required_error: t("errors.birthdayRequired") }),
    cni: z.string().nullable(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
      message: t("errors.phoneRequired"),
    }),
    email: z
      .string()
      .email({ message: t("errors.emailInvalid") })
      .nullable(),
    address: z.string().nullable(),
    gender: z.enum(["M", "F"]),

    // Parent Info
    parentName: z
      .string()
      .min(2, { message: "Parent name must be at least 2 characters." })
      .nullable(),
    parentPhone: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, {
        message: "Phone number between 7 and 15 digits",
      })
      .nullable(),
    // parentAddress: z
    //   .string()
    //   .min(5, { message: "Parent address must be at least 5 characters." })
    //   .nullable(),
    parentEmail: z
      .string()
      .email({ message: "Invalid parent email address." })
      .nullable(),

    // Class Attribution
    course: z.string().min(1, { message: t("errors.courseRequired") }),
    grade: z.string().min(1, { message: t("errors.gradeRequired") }),
    class: z.number().min(1, { message: t("errors.classRequired") }),

    // Payment
    paymentAmount: z
      .number({ required_error: t("errors.paymentAmountRequired") })
      .min(0, { message: t("errors.paymentAmountRequired") })
      .refine((value) => value !== null, {
        message: t("errors.nullpaymentAmount"),
      }),
    paymentMethod: z.enum(["OM", "MOMO", "Cash", "Bank", "Other"]),
    remainingPayment: z
      .number()
      .min(0, { message: t("errors.paidTooMuch") })
      .nullable(),

    // Class Pricing
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
      firstname: "",
      nationality: "Cameroon",
      cni: null, // Set to null for optional fields
      phone: "",
      email: null, // Set to null for optional fields
      address: null, // Set to null for optional fields
      gender: "M",
      parentName: null, // Set to null for optional fields
      parentPhone: null, // Set to null for optional fields
      // parentAddress: null, // Set to null for optional fields
      parentEmail: null, // Set to null for optional fields
      course: undefined,
      grade: undefined,
      class: undefined,
      paymentAmount: undefined,
      paymentMethod: "Cash",
      remainingPayment: null,
      registrationFee: 0,
      firstInstalmentFee: 0,
      firstInstalmentDeadline: new Date("2023-09-01"),
      secondInstalmentFee: 0,
      secondInstalmentDeadline: new Date("2023-12-01"),
    },
    mode: "onSubmit", // Validate only on submit
  });

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await api.get("/courses");
        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          console.log("Fetch failed:", response);
          return null;
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

    fetchCourses();
  }, []);
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only run the logic if the changed field is not "remainingPayment"
      if (name && name !== "remainingPayment") {
        const registrationFee = value.registrationFee || 0;
        const firstInstalmentFee = value.firstInstalmentFee || 0;
        const secondInstalmentFee = value.secondInstalmentFee || 0;
        const paymentAmount = value.paymentAmount || 0;

        const newRemainingPayment =
          registrationFee +
          firstInstalmentFee +
          secondInstalmentFee -
          paymentAmount;

        // Get the current value of remainingPayment
        const currentRemainingPayment = form.getValues("remainingPayment") || 0;

        // Only update if the value has changed
        if (newRemainingPayment !== currentRemainingPayment) {
          if (newRemainingPayment >= 0) {
            form.clearErrors("paymentAmount");
            form.setValue("remainingPayment", newRemainingPayment, {
              shouldValidate: true, // Optional: Validate the field after updating
            });
          } else {
            form.setError("paymentAmount", {
              type: "manual",
              message: "Paid too much",
            });
            form.setValue("remainingPayment", 0, {
              shouldValidate: true, // Optional: Validate the field after updating
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe(); // Cleanup subscription
  }, [form]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const paymentAmountError = form.formState.errors.paymentAmount;

      // Check if the "Paid too much" error is present
      if (paymentAmountError && paymentAmountError.type === "manual") {
        console.log("Form submission blocked: Paid too much.");
        return; // Stop submission
      }
      console.log("v", values);
      setIsLoading(true);
      const response = await api.post("/newstudent", values);
      console.log("One");
      console.log(response);
      if (response.data.success) {
        console.log("Two");
        toast({
          title: t("success.studentRegistered"),
          description: t("success.studentAdded"),
          action: (
            <Button
              onClick={() =>
                generateAndDownloadPdf(response.data as NewStudResponse)
              }
            >
              {" "}
              <Download />
            </Button>
          ),
        });
        form.reset({
          name: "",
          firstname: "",
          nationality: "Cameroon",
          cni: null,
          phone: "",
          email: null,
          address: null,
          gender: "M",
          parentName: null,
          parentPhone: null,
          // parentAddress: null,
          parentEmail: null,
          course: "", // Reset course to empty
          grade: "", // Reset grade to empty
          class: 0, // Reset class to 0
          paymentAmount: undefined,
          paymentMethod: "Cash",
          remainingPayment: null,
          registrationFee: 0,
          firstInstalmentFee: 0,
          firstInstalmentDeadline: new Date("2023-09-01"),
          secondInstalmentFee: 0,
          secondInstalmentDeadline: new Date("2023-12-01"),
        });
        form.setValue("course", "alll");
        setShowClassPricing(false);
        setShowExceptionalPricing(false);
        setApiErrors({});
        setExistingStudent(undefined);
      }
      console.log("resp", response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData.message) {
          const message = errorData.message as string;
          if (message.startsWith("Existing")) {
            setExistingStudent([errorData.data, message]);
          }
        }
        const errors: { [key: string]: string } = {};
        if (Array.isArray(errorData.data)) {
          errorData.data.forEach(
            (error: { field: string; message: string }) => {
              errors[error.field] = error.message;
            }
          );
        } else {
          errors["no field"] = errorData.data;
        }
        setApiErrors(errors);
      } else {
        console.error("Non-Axios error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  console.log(courses);
  return (
    <Form {...form}>
      {/* <p className="text-sm text-muted-foreground mb-5">
        Fields marked with * are mandatory.
      </p> */}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading courses</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}
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
                      {/* <Input placeholder="Doe" {...field} /> */}
                      <Input
                        placeholder="Doe"
                        {...field}
                        onChange={(e) => {
                          const capitalizedValue = e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ");
                          field.onChange(capitalizedValue);
                        }}
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
                        onChange={(e) => {
                          const capitalizedValue = e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ");
                          field.onChange(capitalizedValue);
                        }}
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
                        onChange={(e) => {
                          const capitalizedValue = e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ");
                          field.onChange(capitalizedValue);
                        }}
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
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                        onChange={(e) => {
                          // Convert empty string to null
                          const value =
                            e.target.value.trim() === ""
                              ? null
                              : e.target.value;
                          field.onChange(value);
                        }}
                        value={field.value ?? ""}
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
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const capitalizedValue = e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ");
                          field.onChange(capitalizedValue);
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
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="parentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("parentInfo.parentAddress")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Main St, City, Country"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("classAttribution.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classAttribution.course")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value !== "alll") {
                          field.onChange(value); // Update the course field
                        } else {
                          value = "";
                        }
                        form.setValue("grade", ""); // Reset the grade field
                        form.setValue("class", 0); // Reset the class field
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("classAttribution.Select course")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alll">All</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.name}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => {
                  const selectedCourse = form.watch("course"); // Get the selected course
                  const filteredGrades = selectedCourse
                    ? courses.find((course) => course.name === selectedCourse)
                        ?.grades || []
                    : []; // Filter grades based on the selected course

                  return (
                    <FormItem>
                      <FormLabel>{t("classAttribution.grade")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value); // Update the grade field
                          form.setValue("class", 0); // Reset the class field
                        }}
                        value={field.value}
                        disabled={!selectedCourse} // Disable if no course is selected
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("classAttribution.Select grade")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredGrades.map((grade) => (
                            <SelectItem key={grade.id} value={grade.name}>
                              {grade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => {
                  const selectedGrade = form.watch("grade"); // Get the selected grade
                  const selectedCourse = form.watch("course"); // Get the selected course
                  console.log("course", selectedCourse);
                  console.log("grade", selectedGrade);
                  const filteredClasses = selectedGrade
                    ? courses
                        .find((course) => course.name === selectedCourse)
                        ?.grades?.find((grade) => grade.name === selectedGrade)
                        ?.classes || []
                    : []; // Filter classes based on the selected grade
                  console.log("fc", filteredClasses);
                  return (
                    <FormItem>
                      <FormLabel>{t("classAttribution.class")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedClass = filteredClasses.find(
                            (cls) => cls.id.toString() === value
                          );
                          console.log(selectedClass);

                          // Update the class field
                          field.onChange(parseInt(value));

                          // Update pricing based on the selected class
                          if (selectedClass) {
                            form.setValue(
                              "registrationFee",
                              parseInt(
                                selectedClass.pricing?.registerFee ?? "0"
                              )
                            );
                            form.setValue(
                              "firstInstalmentFee",
                              parseInt(
                                selectedClass.pricing?.instalment1Fee ?? "0"
                              )
                            );
                            form.setValue(
                              "secondInstalmentFee",
                              parseInt(
                                selectedClass.pricing?.instalment2Fee ?? "0"
                              )
                            );
                            form.setValue(
                              "firstInstalmentDeadline",
                              new Date(
                                selectedClass.pricing?.instalment1Deadline ??
                                  "0"
                              )
                            );
                            form.setValue(
                              "secondInstalmentDeadline",
                              new Date(
                                selectedClass.pricing?.instalment2Deadline ??
                                  "0"
                              )
                            );
                          }
                          setShowClassPricing(true);
                        }}
                        value={field.value ? field.value.toString() : ""}
                        disabled={!selectedGrade} // Disable if no grade is selected
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("classAttribution.Select class")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredClasses.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <AnimatePresence>
              {showClassPricing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>{t("classPricing.title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="registrationFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("classPricing.registrationFee")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
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
                                  disabled={!showExceptionalPricing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstInstalmentFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("classPricing.firstInstalmentFee")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
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
                                  disabled={!showExceptionalPricing}
                                />
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
                                {t("classPricing.firstInstalmentDeadline")}
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                      disabled={!showExceptionalPricing}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>
                                          {t("studentInfo.pickadate")}
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
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
                          name="secondInstalmentFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("classPricing.secondInstalmentFee")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
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
                                  disabled={!showExceptionalPricing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="secondInstalmentDeadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("classPricing.secondInstalmentDeadline")}
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                      disabled={!showExceptionalPricing}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>
                                          {t("studentInfo.pickadate")}
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() =>
                          setShowExceptionalPricing(!showExceptionalPricing)
                        }
                        className="mt-4"
                      >
                        {showExceptionalPricing
                          ? t("classPricing.cancelException")
                          : t("classPricing.makeException")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> {t("paymentInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paymentInfo.paymentAmount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedValue =
                            value === "" ? null : Number.parseFloat(value);
                          field.onChange(
                            isNaN(parsedValue || 1) ? null : parsedValue
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paymentInfo.paymentMethod")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">
                          {t("paymentInfo.cash")}
                        </SelectItem>
                        <SelectItem value="OM">OM</SelectItem>
                        <SelectItem value="MOMO">MOMO</SelectItem>
                        <SelectItem value="Bank">
                          {t("paymentInfo.bank")}
                        </SelectItem>
                        <SelectItem value="Other">
                          {t("paymentInfo.other")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remainingPayment"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>{t("paymentInfo.remainingPayment")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedValue =
                            value === "" ? null : Number.parseFloat(value);
                          field.onChange(
                            isNaN(parsedValue || 1) ? null : parsedValue
                          );
                        }}
                        disabled // Disable the input field
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {existingStudent ? (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{existingStudent[1]}</AlertTitle>
            <AlertDescription>
              <p>
                {existingStudent[0].name + " " + existingStudent[0].firstname}
              </p>
              <p>{existingStudent[0].phone}</p>
              <p>{existingStudent[0].email}</p>
            </AlertDescription>
          </Alert>
        ) : (
          Object.keys(apiErrors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {Object.values(apiErrors).map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </AlertDescription>
            </Alert>
          )
        )}
        {form.formState.errors.paymentAmount &&
          form.formState.errors.paymentAmount.type === "manual" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t("errors.paidTooMuch")}</AlertDescription>
            </Alert>
          )}

        <LoadingButton loading={isLoading} type="submit" className="w-full">
          {t("buttons.submit")}
        </LoadingButton>
      </form>
    </Form>
  );
}
