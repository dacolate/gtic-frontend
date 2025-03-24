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

export function CreateClassForm() {
  const t = useTranslations("CreateClassForm");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();

  useEffect(() => {
    async function fetchGrades() {
      try {
        const response = await api.get("/grades/");
        if (response.data.success) {
          setGrades(response.data.data);
          console.log(grades);
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
    async function fetchCourses() {
      try {
        const response = await api.get("/courses/");
        if (response.data.success) {
          setCourses(response.data.data);
          console.log("courses", courses);
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
    async function fetchTeachers() {
      try {
        const response = await api.get("/teachers/");
        if (response.data.success) {
          setTeachers(response.data.data);
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

    fetchGrades();
    fetchCourses();
    fetchTeachers();
  }); // Add `studentId` to the dependency array

  const formSchema = z.object({
    name: z.string().min(3, { message: t("errors.nameRequired") }),
    description: z.string().optional(),
    teacher_id: z.number({ required_error: t("errors.teacherRequired") }),
    start_date: z.date().optional(),
    expected_duration: z.number({
      required_error: t("errors.durationRequired"),
    }),
    grade_id: z.number().optional(),
    course_id: z.number().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      teacher_id: undefined,
      start_date: undefined,
      expected_duration: 0,
      grade_id: undefined,
      course_id: undefined,
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Transform start_date to ISO string
      const payload = {
        ...values,
        start_date: values.start_date?.toISOString(), // Convert Date to ISO string
      };

      console.log("Payload:", payload); // Debugging: Log the payload

      const response = await api.post("/classes", payload);

      console.log("Response:", response); // Debugging: Log the response

      if (response.data.success) {
        toast({
          title: t("success.classCreated"),
          description: t("success.classCreatedMessage"),
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

        {/* Class Name and Description */}
        <Card>
          <CardHeader>
            <CardTitle>{t("classInfo.title")}</CardTitle>
          </CardHeader>
          <CardContent>
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
            </div>
          </CardContent>
        </Card>

        {/* Teacher and Start Date */}
        <Card>
          <CardHeader>
            <CardTitle>{t("classDetails.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classDetails.teacher")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("classDetails.selectTeacher")}
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
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classDetails.startDate")}</FormLabel>
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
                              <span>{t("classDetails.pickadate")}</span>
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
            </div>
          </CardContent>
        </Card>

        {/* Expected Duration */}
        <Card>
          <CardHeader>
            <CardTitle>{t("classDuration.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expected_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classDuration.duration")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("classDuration.durationPlaceholder")}
                        {...field}
                        // onChange={(e) => field.onChange(Number(e.target.value))}
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
            </div>
          </CardContent>
        </Card>

        {/* Grade and Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t("classGradeCourse.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classGradeCourse.course")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        setSelectedCourse(
                          courses.find((course) => course.id === Number(value))
                        );
                        console.log("sel", selectedCourse);
                        console.log("coyrbej", courses);
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("classGradeCourse.selectCourse")}
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
                  setSelectedCourse(
                    courses.find(
                      (course) => course.id === form.watch("course_id")
                    )
                  );
                  const filteredGrades = selectedCourse
                    ? selectedCourse?.grades || []
                    : []; // Filter grades based on the selected course

                  return (
                    <FormItem>
                      <FormLabel>{t("classGradeCourse.grade")}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("classGradeCourse.selectGrade")}
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
