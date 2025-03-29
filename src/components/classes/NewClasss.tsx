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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import LoadingButton from "../LoadingButton";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course, Grade, Teacher } from "@/lib/types";
import { useRouter } from "@/i18n/routing";

export function CreateClassForm() {
  const t = useTranslations("CreateClassForm");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const [showPricing, setShowPricing] = useState(false);
  // const [showExceptionalPricing, setShowExceptionalPricing] = useState(false);
  let selectedCourse: Course | undefined;

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [gradesRes, coursesRes, teachersRes] = await Promise.all([
          api.get("/grades/"),
          api.get("/courses/"),
          api.get("/teachers/"),
        ]);

        if (gradesRes.data.success) setGrades(gradesRes.data.data);
        if (coursesRes.data.success) setCourses(coursesRes.data.data);
        if (teachersRes.data.success) setTeachers(teachersRes.data.data);
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

    fetchInitialData();
  }, []);

  console.log(grades);

  const formSchema = z.object({
    // Class Info
    name: z.string().min(3, { message: t("errors.nameRequired") }),
    description: z.string().optional(),
    teacher_id: z.number({ required_error: t("errors.teacherRequired") }),
    start_date: z.date(),
    expected_duration: z
      .number({
        required_error: t("errors.durationRequired"),
      })
      .min(0),
    grade_id: z.number(),
    course_id: z.number(),

    // Pricing
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
      teacher_id: undefined,
      start_date: new Date(),
      expected_duration: 0,
      grade_id: undefined,
      course_id: undefined,
      registrationFee: 0,
      firstInstalmentFee: 0,
      firstInstalmentDeadline: new Date(),
      secondInstalmentFee: 0,
      secondInstalmentDeadline: new Date(),
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const payload = {
        ...values,
        start_date: values.start_date?.toISOString(),
        registrationFee: values.registrationFee,
        firstInstalmentFee: values.firstInstalmentFee,
        firstInstalmentDeadline: values.firstInstalmentDeadline.toISOString(),
        secondInstalmentFee: values.secondInstalmentFee,
        secondInstalmentDeadline: values.secondInstalmentDeadline.toISOString(),
      };

      const response = await api.post("/classes", payload);

      if (response.data.success) {
        toast({
          title: t("success.classCreated"),
          description: t("success.classCreatedMessage"),
        });
        form.reset();
        setShowPricing(false);
        setApiErrors({});
        router.push("/classes");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("df", error);
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
        console.log("Non-Axios error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Class Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("classInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classInfo.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("classInfo.namePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classInfo.teacher")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("classInfo.selectTeacher")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem
                            key={teacher.id}
                            value={teacher.id.toString()}
                          >
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("classInfo.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("classInfo.descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("classInfo.startDate")}</FormLabel>
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
                              <span>{t("classInfo.durationPlaceholder")}</span>
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
                name="expected_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classInfo.duration")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("classInfo.expectedduration")}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedValue =
                            value === "" ? undefined : Number.parseFloat(value);
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
            </div>
          </CardContent>
        </Card>

        {/* Course and Grade Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t("courseSelection.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("courseSelection.course")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        form.resetField("grade_id");

                        if (showPricing) {
                          setShowPricing(false);
                        }

                        // form.setValue("grade_id", null);
                        // setShowPricing(true);
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("courseSelection.selectCourse")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem
                            key={course.id}
                            value={course.id.toString()}
                          >
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
                name="grade_id"
                render={({ field }) => {
                  const currentCourseId = form.watch("course_id");
                  selectedCourse = courses.find(
                    (course) => course.id === currentCourseId
                  );
                  const filteredGrades = selectedCourse?.grades || [];

                  return (
                    <FormItem>
                      <FormLabel>{t("courseSelection.grade")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          setShowPricing(true);
                          const selectedGrade = filteredGrades.find((grade) => {
                            return grade.id === Number(value);
                          });
                          form.setValue(
                            "registrationFee",
                            parseInt(selectedGrade?.pricing.registerFee || "0")
                          );
                          form.setValue(
                            "firstInstalmentFee",
                            parseInt(
                              selectedGrade?.pricing.instalment1Fee || "0"
                            )
                          );
                          form.setValue(
                            "secondInstalmentFee",
                            parseInt(
                              selectedGrade?.pricing.instalment2Fee || "0"
                            )
                          );

                          const createdAt = new Date(
                            selectedGrade?.createdAt || 0
                          );
                          const startDate = form.getValues("start_date");

                          const firstInstalmentDays = selectedGrade?.pricing
                            .instalment1Deadline
                            ? Math.max(
                                0,
                                Math.ceil(
                                  (new Date(
                                    selectedGrade.pricing.instalment1Deadline
                                  ).getTime() -
                                    createdAt.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )
                            : 0;

                          const secondInstalmentDays = selectedGrade?.pricing
                            .instalment2Deadline
                            ? Math.max(
                                0,
                                Math.ceil(
                                  (new Date(
                                    selectedGrade.pricing.instalment2Deadline
                                  ).getTime() -
                                    createdAt.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )
                            : 0;
                          form.setValue(
                            "firstInstalmentDeadline",
                            selectedGrade?.pricing.instalment1Deadline
                              ? addDays(startDate, firstInstalmentDays)
                              : addDays(new Date(), firstInstalmentDays)
                          );
                          form.setValue(
                            "secondInstalmentDeadline",
                            selectedGrade?.pricing.instalment2Deadline
                              ? addDays(startDate, secondInstalmentDays)
                              : addDays(new Date(), secondInstalmentDays)
                          );
                        }}
                        value={field.value?.toString()}
                        disabled={!currentCourseId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("courseSelection.selectGrade")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredGrades.map((grade) => (
                            <SelectItem
                              key={grade.id}
                              value={grade.id.toString()}
                            >
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                  value === ""
                                    ? null
                                    : Number.parseFloat(value);
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
                                  value === ""
                                    ? null
                                    : Number.parseFloat(value);
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
                                  value === ""
                                    ? null
                                    : Number.parseFloat(value);
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
        <LoadingButton loading={isLoading} type="submit" className="w-full">
          {t("buttons.submit")}
        </LoadingButton>
      </form>
    </Form>
  );
}
