"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import InitialsAvatar from "../InitialsAvatar";
import { Teacher } from "@/lib/types";

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="relative overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className=" bg-gradient-to-r from-green-600 to-indigo-500 text-white">
        <div className="flex items-center space-x-4">
          <InitialsAvatar name={teacher.name} />
          <div>
            <CardTitle className="text-2xl">{teacher.name}</CardTitle>
            <Badge
              variant={teacher.active ? "outline" : "secondary"}
              className="absolute right-2 top-2 rounded-full text-white"
            >
              {teacher.active ? "Active" : "Inactive"}
            </Badge>
            <div className="flex">
              {teacher.classes && teacher.classes[0] ? (
                <div className="flex"> {teacher.classes[0].course?.name}</div>
              ) : (
                <div className="flex"> No course </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span>{teacher.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span>{teacher.phone}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Joined {new Date(teacher.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4 flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Classes ({teacher.classes?.length || 0})</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2"
            >
              {teacher.classes?.map((cls) => (
                <div key={cls.id} className="bg-gray-100 p-3 rounded-md">
                  <h4 className="font-semibold">{cls.name}</h4>
                  <p className="text-sm text-gray-600">
                    {cls.course?.name || "No course"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Starts: {new Date(cls.startDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
