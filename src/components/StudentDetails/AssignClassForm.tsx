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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Course, Student } from "@/lib/types";
import LoadingButton from "../LoadingButton";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignClassFormProps {
  studentId: string; // Student object passed as a prop
}

export function AssignClassForm({ studentId }: AssignClassFormProps) {
  const [student, setStudent] = useState<Student>();
  const t = useTranslations("AssignClassForm");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const [showPricing, setShowPricing] = useState(false);

  const formSchema = z.object({
    // Class Attribution
    course: z.string().min(1, { message: t("errors.courseRequired") }),
    grade: z.string().min(1, { message: t("errors.gradeRequired") }),
    class: z.number().min(1, { message: t("errors.classRequired") }),

    // Pricing
    registrationFee: z
      .number()
      .positive({ message: t("errors.positiveNumber") }),
    firstInstalmentFee: z
      .number()
      .positive({ message: t("errors.positiveNumber") }),
    firstInstalmentDeadline: z.date().optional(),
    secondInstalmentFee: z
      .number()
      .positive({ message: t("errors.positiveNumber") }),
    secondInstalmentDeadline: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: "",
      grade: "",
      class: 0,
      registrationFee: 0,
      firstInstalmentFee: 0,
      firstInstalmentDeadline: undefined,
      secondInstalmentFee: 0,
      secondInstalmentDeadline: undefined,
    },
    mode: "onSubmit", // Validate only on submit
  });

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await api.get("/students/" + studentId);
        if (response.data.success) {
          setStudent(response.data.data);
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

    fetchStudent();
    fetchCourses();
  }, [studentId]);

  if (!student) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await api.post("/studentclass", {
        studentId: student.id,
        classId: values.class,
        registrationFee: values.registrationFee,
        firstInstalmentFee: values.firstInstalmentFee,
        firstInstalmentDeadline: values.firstInstalmentDeadline?.toISOString(),
        secondInstalmentFee: values.secondInstalmentFee,
        secondInstalmentDeadline:
          values.secondInstalmentDeadline?.toISOString(),
      });

      if (response.data.success) {
        toast({
          title: t("success.classAssigned"),
          description: t("success.studentAssignedToClass"),
        });
        form.reset();
        setApiErrors({});
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

  console.log("course", courses);
  console.log("stud", student);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading courses</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Student Info (Read-only) */}
        <Card className="hidden">
          <CardHeader>
            <CardTitle>{t("studentInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>{t("studentInfo.name")}</FormLabel>
                <Input value={student.name} readOnly />
              </FormItem>
              <FormItem>
                <FormLabel>{t("studentInfo.firstName")}</FormLabel>
                <Input value={student.firstname} readOnly />
              </FormItem>
              <FormItem>
                <FormLabel>{t("studentInfo.nationality")}</FormLabel>
                <Input value={student.nationality} readOnly />
              </FormItem>
              <FormItem>
                <FormLabel>{t("studentInfo.phone")}</FormLabel>
                <Input value={student.phone} readOnly />
              </FormItem>
              <FormItem>
                <FormLabel>{t("studentInfo.email")}</FormLabel>
                <Input value={student.email || ""} readOnly />
              </FormItem>
              <FormItem>
                <FormLabel>{t("studentInfo.gender")}</FormLabel>
                <Input
                  value={student.gender === "M" ? "Male" : "Female"}
                  readOnly
                />
              </FormItem>
            </div>
          </CardContent>
        </Card>

        {/* Class Attribution */}
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
                        field.onChange(value);
                        form.setValue("grade", "");
                        form.setValue("class", 0);
                        setShowPricing(false);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("classAttribution.selectCourse")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                  const selectedCourse = form.watch("course");
                  const filteredGrades = selectedCourse
                    ? courses.find((course) => course.name === selectedCourse)
                        ?.grades || []
                    : [];

                  return (
                    <FormItem>
                      <FormLabel>{t("classAttribution.grade")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("class", 0);
                          setShowPricing(false);
                        }}
                        value={field.value}
                        disabled={!selectedCourse}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("classAttribution.selectGrade")}
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
                  const selectedGrade = form.watch("grade");
                  const selectedCourse = form.watch("course");
                  const filteredClasses = selectedGrade
                    ? courses
                        .find((course) => course.name === selectedCourse)
                        ?.grades?.find((grade) => grade.name === selectedGrade)
                        ?.classes || []
                    : [];

                  return (
                    <FormItem>
                      <FormLabel>{t("classAttribution.class")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedClass = filteredClasses.find(
                            (cls) => cls.id.toString() === value
                          );
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
                              selectedClass.pricing?.instalment1Deadline
                                ? new Date(
                                    selectedClass.pricing.instalment1Deadline
                                  )
                                : undefined
                            );
                            form.setValue(
                              "secondInstalmentDeadline",
                              selectedClass.pricing?.instalment2Deadline
                                ? new Date(
                                    selectedClass.pricing.instalment2Deadline
                                  )
                                : undefined
                            );
                          }
                          setShowPricing(true);
                        }}
                        value={field.value ? field.value.toString() : ""}
                        disabled={!selectedGrade}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("classAttribution.selectClass")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredClasses.map((cls) => (
                            <SelectItem
                              key={cls.id}
                              value={cls.id.toString()}
                              disabled={student.classes?.some(
                                (classs) => classs.id === cls.id
                              )}
                            >
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
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <AnimatePresence>
          {showPricing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t("pricing.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="registrationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("pricing.registrationFee")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue =
                                  value === "" ? 0 : Number.parseFloat(value);
                                field.onChange(parsedValue);
                              }}
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
                            {t("pricing.firstInstalmentFee")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue =
                                  value === "" ? 0 : Number.parseFloat(value);
                                field.onChange(parsedValue);
                              }}
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
                            {t("pricing.firstInstalmentDeadline")}
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
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("pricing.pickadate")}</span>
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
                            {t("pricing.secondInstalmentFee")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue =
                                  value === "" ? 0 : Number.parseFloat(value);
                                field.onChange(parsedValue);
                              }}
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
                            {t("pricing.secondInstalmentDeadline")}
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
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("pricing.pickadate")}</span>
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {Object.keys(apiErrors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {Object.values(apiErrors).map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <LoadingButton
          loading={isLoading}
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          {t("buttons.submit")}
        </LoadingButton>
      </form>
    </Form>
  );
}
