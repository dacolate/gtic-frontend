"use client";

import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { ClassCard } from "./ClassCard";

const formSchema = z.object({
  course: z.string({
    required_error: "Please select a course.",
  }),
  grade: z.string({
    required_error: "Please select a grade.",
  }),
  class: z.string({
    required_error: "Please select a class.",
  }),
  studentName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  studentEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  studentPhone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  parentName: z.string().min(2, {
    message: "Parent name must be at least 2 characters.",
  }),
  parentEmail: z.string().email({
    message: "Please enter a valid parent email address.",
  }),
  parentPhone: z.string().min(10, {
    message: "Parent phone number must be at least 10 digits.",
  }),
  paymentMethod: z.string({
    required_error: "Please select a payment method.",
  }),
  paymentAmount: z.string().min(1, {
    message: "Please enter a payment amount.",
  }),
});

export function NewStudForm() {
  const [showGrade, setShowGrade] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [showParentInfo, setShowParentInfo] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [isClassSelectionComplete, setIsClassSelectionComplete] =
    useState(false);
  const [isStudentInfoComplete, setIsStudentInfoComplete] = useState(false);
  const [isParentInfoComplete, setIsParentInfoComplete] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: "",
      grade: "",
      class: "",
      studentName: "",
      studentEmail: "",
      studentPhone: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      paymentMethod: "",
      paymentAmount: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "New student added",
      description: "The student has been successfully registered.",
    });
    form.reset();
    setShowGrade(false);
    setShowClasses(false);
    setShowStudentInfo(false);
    setShowParentInfo(false);
    setShowPaymentInfo(false);
    setIsClassSelectionComplete(false);
    setIsStudentInfoComplete(false);
    setIsParentInfoComplete(false);
  }

  const mockClasses = [
    {
      id: 1,
      name: "Math 101",
      teacher: "Mr. Smith",
      students: 20,
      startDate: "2023-09-01",
      endDate: "2023-12-15",
    },
    {
      id: 2,
      name: "Math 102",
      teacher: "Ms. Johnson",
      students: 18,
      startDate: "2023-09-01",
      endDate: "2023-12-15",
    },
    {
      id: 3,
      name: "Math 103",
      teacher: "Dr. Brown",
      students: 22,
      startDate: "2023-09-01",
      endDate: "2023-12-15",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <motion.div
          initial={false}
          animate={
            isClassSelectionComplete ? { height: "auto" } : { height: "auto" }
          }
          transition={{ duration: 0.3 }}
        >
          <div
            className={`p-4 bg-gray-100 rounded-lg mb-4 ${
              isClassSelectionComplete ? "cursor-pointer" : ""
            }`}
            onClick={() =>
              isClassSelectionComplete && setIsClassSelectionComplete(false)
            }
          >
            <h2 className="text-xl font-bold mb-4">Class Selection</h2>
            {!isClassSelectionComplete && (
              <>
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowGrade(true);
                          setShowClasses(false);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatePresence>
                  {showGrade && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setShowClasses(true);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="grade1">Grade 1</SelectItem>
                                <SelectItem value="grade2">Grade 2</SelectItem>
                                <SelectItem value="grade3">Grade 3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showClasses && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {mockClasses.map((cls) => (
                                <ClassCard
                                  key={cls.id}
                                  class={cls}
                                  isSelected={field.value === cls.id.toString()}
                                  onSelect={() => {
                                    field.onChange(cls.id.toString());
                                    setIsClassSelectionComplete(true);
                                    setShowStudentInfo(true);
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            {isClassSelectionComplete && (
              <p>
                Selected: {form.getValues("course")} - Grade{" "}
                {form.getValues("grade")} - Class {form.getValues("class")}
              </p>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showStudentInfo && (
            <motion.div
              initial={false}
              animate={
                isStudentInfoComplete ? { height: "auto" } : { height: "auto" }
              }
              transition={{ duration: 0.3 }}
            >
              <div
                className={`p-4 bg-gray-100 rounded-lg mb-4 ${
                  isStudentInfoComplete ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  isStudentInfoComplete && setIsStudentInfoComplete(false)
                }
              >
                <h2 className="text-xl font-bold mb-4">Student Information</h2>
                {!isStudentInfoComplete && (
                  <>
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (
                          form.getValues("studentName") &&
                          form.getValues("studentEmail") &&
                          form.getValues("studentPhone")
                        ) {
                          setIsStudentInfoComplete(true);
                          setShowParentInfo(true);
                        }
                      }}
                    >
                      Next
                    </Button>
                  </>
                )}
                {isStudentInfoComplete && (
                  <p>
                    Student: {form.getValues("studentName")} -{" "}
                    {form.getValues("studentEmail")}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showParentInfo && (
            <motion.div
              initial={false}
              animate={
                isParentInfoComplete ? { height: "auto" } : { height: "auto" }
              }
              transition={{ duration: 0.3 }}
            >
              <div
                className={`p-4 bg-gray-100 rounded-lg mb-4 ${
                  isParentInfoComplete ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  isParentInfoComplete && setIsParentInfoComplete(false)
                }
              >
                <h2 className="text-xl font-bold mb-4">Parent Information</h2>
                {!isParentInfoComplete && (
                  <>
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
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
                          <FormLabel>Parent Email</FormLabel>
                          <FormControl>
                            <Input placeholder="jane@example.com" {...field} />
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
                          <FormLabel>Parent Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (
                          form.getValues("parentName") &&
                          form.getValues("parentEmail") &&
                          form.getValues("parentPhone")
                        ) {
                          setIsParentInfoComplete(true);
                          setShowPaymentInfo(true);
                        }
                      }}
                    >
                      Next
                    </Button>
                  </>
                )}
                {isParentInfoComplete && (
                  <p>
                    Parent: {form.getValues("parentName")} -{" "}
                    {form.getValues("parentEmail")}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaymentInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 bg-gray-100 rounded-lg mb-4">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit_card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>

                          <SelectItem value="bank_transfer">
                            Bank Transfer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
