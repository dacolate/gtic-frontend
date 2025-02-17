"use client";

import { useState } from "react";
import { TeacherCard } from "@/components/Teachers/TeacherCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Teacher } from "@/lib/types";

export function TeacherGrid({ data }: { data: Teacher[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = data.filter(
    (teacher) =>
      // const normalized = searchTerm.toLowerCase();

      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchTerm.trim().startsWith("#") &&
        teacher.classes &&
        teacher.classes[0] &&
        teacher.classes[0].course &&
        teacher.classes[0].course.name.includes(searchTerm.slice(1)))
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search teachers..."
          className="pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
}
