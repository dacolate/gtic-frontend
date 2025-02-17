"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  // GraduationCapIcon,
  PhoneIcon,
  MailIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  ChevronUp,
  ChevronDown,
  MapPinHouse,
  GraduationCap,
} from "lucide-react";
import InitialsAvatar from "../InitialsAvatar";
import { Student } from "@/lib/types";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLatePayment =
    student.student_classes &&
    student.student_classes[0]?.paymentStatus === "late";
  const noClass = student.classes?.length === 0;
  const noGrade = !!(student.classes && student.classes[0]?.gradeId);

  console.log(student.name, noGrade);
  return (
    <Card
      className={`relative overflow-hidden hover:shadow-lg transition-shadow ${
        isLatePayment ? "border-red-500 border-2" : ""
      }`}
    >
      <CardHeader className="bg-gradient-to-r from-green-600 to-purple-500 text-white">
        <div className="flex absolute right-2 top-2 gap-2">
          <Badge
            variant={isLatePayment ? "destructive" : "default"}
            className={`${!isLatePayment && "hidden"} rounded-full`}
          >
            Late
          </Badge>
          <Badge
            variant={student.active ? "outline" : "secondary"}
            className="rounded-full text-white "
          >
            {student.active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <Link href={`/students/${student.id}`}>
            <InitialsAvatar name={student.name} />
          </Link>
          <div>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <div className="flex space-x-4 items-center">
              <div className="flex">
                {student.classes && student.classes[0] ? (
                  <div className="flex"> {student.classes[0].course?.name}</div>
                ) : (
                  <div className="flex"> No course </div>
                )}
              </div>
              {/* <Badge
                variant={isLatePayment ? "destructive" : "default"}
                className={`${!isLatePayment && "hidden"}`}
              >
                Late
              </Badge> */}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center">
            <MailIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center">
            <MapPinHouse className="h-4 w-4 mr-2 text-gray-500" />
            <span>{student.address}</span>
          </div>
          {/* <div className="flex items-center">
            <GraduationCapIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {student.classes ? student.classes[0]?.course?.name : "No course"}
            </span>
          </div> */}

          <div className={`${!noGrade && "hidden"} flex items-center`}>
            <BookOpenIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {noGrade && student.classes && student.classes[0].grade
                ? student.classes[0]?.grade?.name
                : "No class"}
            </span>
          </div>

          <div className={`${!student.classes && "hidden"} flex items-center`}>
            <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {student.classes && student.classes[0]
                ? student.classes[0]?.name
                : "No class"}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Joined: {new Date(student.createdAt).toLocaleDateString()}
            </span>
          </div>
          {isLatePayment && (
            <div className="flex items-center text-red-500">
              <AlertTriangleIcon className="h-4 w-4 mr-2" />
              <span>Late Payment</span>
            </div>
          )}
        </div>
        {
          <Button
            variant="ghost"
            className="w-full mt-4 flex items-center justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>Classes ({student.classes?.length || 0})</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        }

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2"
            >
              {student.classes?.map((cls) => (
                <div key={cls.id} className="bg-gray-100 p-3 rounded-md ">
                  <h4 className="font-semibold flex items-center">
                    {" "}
                    <AlertTriangleIcon className="h-4 w-4 mr-2 text-red-500" />
                    {cls.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {cls.course?.name || "No course"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Starts: {new Date(cls.startDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
              <div className=" flex justify-center ">
                <Button
                  className={` ${
                    noClass && "hidden"
                  } bg-gray-400 p-3 rounded-md text-sm text-center w-full`}
                >
                  Assign to class
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className=" flex justify-center items-center mt-auto">
          <Button
            className={` ${
              !noClass && "hidden"
            } bg-gray-400 p-3 rounded-md text-sm text-center w-full`}
          >
            Assign to class
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
