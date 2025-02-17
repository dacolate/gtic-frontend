"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { StudentCard } from "./StudentCard";
import { Course, Grade, Student } from "@/lib/types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from "@/lib/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { StudentTable } from "./StudentTable";

interface StudentGridProps {
  data: Student[];
  view: string;
}

export function StudentGrid({ data, view }: StudentGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseFilter, setCourseFilter] = useState<Course>();
  const [gradeFilter, setGradeFilter] = useState<Grade>();
  const [classFilter, setClassFilter] = useState<string>("");
  const [latePaymentFilter, setLatePaymentFilter] = useState("all");

  function handleDownload() {
    const headers = ["Name", "Email", "Phone", "Class", "Payment Status"];

    const tableData = filteredStudents.map((student) => [
      student.name,
      student.email,
      student.phone,
      student.classes?.[0]?.course?.name || "N/A",
      student.student_classes?.[0]?.paymentStatus || "N/A",
    ]);

    // Create a new jsPDF instance
    const doc = new jsPDF();

    const logoBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAApVBMVEX///88sUm9vb1qdXRpdHM0r0I3sEVteHfv8PByfHsnrDjy8/Mxrj+e1aN6x4Jkvm1/yYeEyYrq6+uGj453gYDZ7dp/iIclrDbd39/5+fnu+O+vtLRibm3P0tHIy8vV2Ni54L2Pl5aepaTm9OfG5slXumH0+/WQz5ae1KOorq22urqUm5pDtFBgvWq03rhvwXdRuFzP6tKp2a2NzpPA48MIpyRZZmXlQoYrAAARWklEQVR4nO1dC3eiuhZGEwiv1hYQRKmKVlvftp05//+n3b2TgEi1Cp07prP41ppTVAj5kv1O4GhagwYNGjRo0KBBgwYNGjRo0KBBgwYNfjLmt+7A/wvdX3cPs7XhRlHkttabx/fn6a279Ocw7753XNt1daOVwdBd2zYetv8Ey+7HOnIP3IoAmrP3/q07+E287yP9JLtsMt1o93zrTtbH/NU9M3tHJO39T+V4Z7gX6WUcf926szXwvL6SH+cY7X6a0env7MvyWYRu3926z5XwbHxpX07C3vwgs/oSVeaH0+j+FG2czypo4BGinyGp/XV1Cc1gP96691dg2qpmYo7h7m7d/4vo6t8hCBQ7t2ZwAX3jewSB4v2tOXyJ+fq7BFXXxVl9I1OgqLBFfazrJo4Rvd2ayDmMazn6EzAUjW6m2Qzqdmu9tr8xn/rm1lxOYyOsjGE/vM3n8+mr/g3P/35rMqewtcX4z7I8aL6za1N0FZTTuZBKoyhgL7UlVVfQK364JwZ/U9s92srZ06mwo/rH0bdvteXUmN2IyFk86ieHvn6Io5pT7EuNi0pF+11tioZiIXhmU6LS9x/1PUbUvQmTc8j0rczwsT5D/eEmTM7gOWNY1sP6UgpyqtIyVU6k7Mc69Z1+y1aoMNU/8ChP4kd9iirZmnGRRineenZrq2LZMN8QDwUSxrpUn5/v6iZVCsU162K/DHd2tx1vXzqznVSk8bVLNCW4L7eldcC0RMBwEYZh2Bsxn/OHqI5NNZRJE8dnrYkRyUTvbV/H4riqKOLdF0JoZ+7jvUZCrExYs/uq7+5edrN/yuLotm3Y9rnrlfGI6zMdFDDy9ZZPi6Z6dI/msvtyxqO4r7ekVcAlb+DO5DTOH4vrprp9nzmW/umChyqZfv+ivzPyIu9bKy/IHS9sv59aM1bFmE6v8Oi5Nmp3NvoRN9qVrMj0xKqjKol+9xpHYOQFwv7LbN+5O7Ex4e7zNO7/KpGzuIohGMbdGe82zb4/iHCG9V8j8SWuLTfp+omdQf1XO4pa2fw+HAu80fqrRM7i+oKa/Viaxu6Dy6ctV9NfrSO/ocgcXimlnElrW7jwuZNvejMiGWXPj3JmRfTwGlt6mEbjVRiZ6XvryLK4LTmN44P7V8WWXvaHx/NorzedzdotW5XcafY32TQqk+VXznCN06v99kzWB95lsmWosjPj67i0CvNoLFqciml0VVnv/k7JsIRDsoU7U93tl/f9e/gqP6wKdy0NDk6jMoWa8XcYlncxHpKtrR6psk46/UbZ1+087EsDlFV3tP6DKlWMb5gaA+WwvLhhKKN/Oe7rFn11LpGfQ4azUfqtsK2riC4PuU+EDHpLrf37/aqKqOtFl94/VaaJlCkHc1TziIZ7fyd3utsv0/60FG5L5H5DCfyqMolix810xim6ro7u4e5E5OcqtUmxSmi6Flakn4um3ZkfLVHJqFUZf8/xcb2tcbOE/mCBMfvPJVV372cowoYiyaFEeXHmC9iZehV3TKFdeUVeuv3Yx9oxhGzjWxL6jIerXWIufM+/izMLytmdRXkRdesqUivNcX2ifyhkvxWr/EYEgcwb8uvuXuDPXJWYNEeFSRzj+VNkcV+0wfY9mqD5na277otiMQ1ifr05dV+63TvXHWu49FgYGL31/vwi1otdpbaaSGwrlNxs3EEc4Zag/pGzd7Odxe7HxfvdALOqqb6okr6eWJNRdBt09TRRLIJ3Pz8opczydgk19urbnf6J7dJqRTNF3FfPonQD06S7I4qRcgnwAfsaVbcIjUqxmGWrlTcdo1/nuSd3DZJa+KjI0vYZVIhPC5weC5OoXLRWRrfiM9wIXJ7IKpKuIosxX6Bb/QlEZChLPco/YImo/pgs7nd+d38MQTA35RLvRYagh694jWLVpy/wWM31I0NIhw0ei/8QjK94p0mB4QcyPGy5+RGYbioEqcjw4edIaIbx9e820YHc+4+aQIH5x6el+jP4edOXof9iX9ZHw3Y/ftq7aQqY3+3Pbo/l9Fx7M1Y0F7wabw/6mZnUXXfz/oOn74D528smsl39EM4ZMHdR62GsXMHwG5i/bT92+7Wh25Gtr2e7u1//xOR9wnzeR/x0xWvQoMGtMZ//CTsCJmmqnkWav73uNvt1a73f3N89i9697e5PYjeGH8fix3JQOn9+2azBq0S2MbtX6A2nz52IP0jB/bkODn2DHMeRfhJ8s+ydjYel2tr0ERxmFhpAQ78V2VezXX8usXGGZ7IL/kCTKCAe7QOe35fDWFuJuOfUU0tipbciw7dWOUxX47mgbvE1s9kGZ1FzqcZwGxWa0Xkcq8SDst2cBSQR6/1sv8ZkQmwN3f62BaQMG/Ljb66HJYb5tiNIGWcdMEczw1bh/R/TLGVw3cdnbuDn/e57Rzzt0u8KTO/5ScZuKr9A/iWG3WwG7X2WdMzf7hXwGNnKb3T8PEypZ2IL6fGrLkoMs3UrV7F3RGVPOV/Y33OZYbYNwFWtJCVH/tLLuS4zlOtykSL+L8ebUJ6LD7dcZCgfD1PmGZIccov2xcfKLzKUm9xs1WQ0E1L90nkXGcqGFHkc74C+JJjv78m8AaJoTi8ylK8KU+q9Qgi5heZg4CH+zvC7KHCXGMqNf8o8gJ9DPlx5eD6isOHbrsLwU0Oq4O2fZ9gtS2ldhspKqdRDPc8AuB4a1RnKvZu6UtvzEf1syrIvuBEVoWolhtlmf+W8RebGjj1+pwbDjkwrlfP48q2Bxy8h2dRgKHabKPM2kwNkXNqyiwFzHYbZQ/0qpLzHyNJDvcCnDsP8Za6GanL6nGfmhzce1dHDXBrU21Wzy8o09v5ZFh9qzeFh+22hitFVoRB1eNO8YetYQOqsa3h8RL431XDdPVai9q3j4PZWmBc2zvAiYKsmw+nR42uymqjG275Ov8aqMkOtv/lUXtUVee5i2/pc1DcqZU8SnzYZKfPuD227jvL/N55YmZm9HmXALl+FOfLnp1Zm+i+FhZmWodu2AgVTien2sbOHLhnr/e7jvey33/lK2u4oddiK70pyOP/1uGlFCHu9eVRuO9H8Ty2QTqfTP9JSgwYNGjRo0KBBgwaKo70Kg3Dladow9AHhk6ZN/DAMV0P8NfXDJfzxQj/s8dPhYJgdeHhCONLECb68fJm3o2m9ScAsv6f1wtCEj8sw1TQTfo81zQn59drQtyy/zU+W3wBGK4uFg1h86C38IPAHmrYIQwcu9MNBBX49i1BK6H/Q9JJYSZL8B/0PWRDC90jNgjtp/DfKmTxRxnx+JbUYdFcLqKDyX0Iti+DlAzhXtKMtoGmLJZ42ogl2fkACYJhYZAEdTSgfIUoDuBe22aNUjCJeZwXwz+QfEugiTeBmHiUD7At1ridoMssamrGJ3Vky5gBg4EIC5CaMaVpsWSGBjsAgEs5wQhaMmoKhheRCwTD2zBEjQ9OLtQELTNFOm7LUi2Po9ohwOvAT3BOv9DSHYsMDwtpaPCDIuUckQxjGSaw9ibEcQCM9x+nhTwtmwaBj767GhGXDxhnKI87wiSQxjsCCtjUvmfiECyf0LRBH0Avsr2QI8IgYBE6Dg1i+PAKGXEolwwlZCYYxYyv83bdofGDoixYG2DmHcFERcBh9eqJhBYIaYxM+/qaJt7eWAAeldKmZPkG5YOyJplo7efIJ6kqPBtqC8FtS0gtgJE4yFO2MqPiCM2STxWLhW5wh8RgdxcgQTuGXD5FcxtChjCuaR6EfQ0LgS+igh1q5JH6ajLTr4TBs6ynhegAMUX9AdEIrCGBwY+w1cxjR0iT2uWwsQJqgtw5nOBpSdpIhtgN6NxSiKRiivlMmGFJnQXwNGQ4lqREBphlDYDaUvVugZJmo7STh97GswpRegZjgHPbSEC8DhsPhsI16aIU+4eLTowQ4jKxQ81HJtYCtlgPGxRQnKCTt9NQctqEdB+ScZCoAozJot9spkwxjSoGUh6cIA0bAkGUMTZy77O+SobpOUkucOOQfKyC0LJx8LnjHethjdIg6b4FkpKCKqbAFOD3MWkmGIxr65/UQ5mKSMyzqIRwvaRpAXz0pkBOWFPRQztMQaY/EGbFkCONiVmIIcpY6JxmCuqd4kxDm0YK+rMiEn9Lr9cA8SYbailnkBEPpyHzGlVcr21JkC36SG2lm9XDkuCxlDBcMxdQJUKZhElBkMoZPVRlqE/Rvq4AJPQRHHy4kQxDGWGuDvkBnQnQTKzzCSRHmgTP0aJEhzfQQ2xlwO0WsNLWcnCHJGT7xccNJZBNwTHAOSgiA8fvQ1cQSdh5MAQ1WfuaPKzOEkIKA3AXAa5kQQAIcggQY9hLQ7UECDBcBukc48hKu7jHcX9PE8YImOcNEWLkBzdrRnIkFvhrIjRLh8RPu8RPspC+CAC/F+0/QdvV4B8B0azFIbUJToXHOJIA2LBFTPYmLq8HxTHTPWuw40uPz//D/xo4UOPyV/+NX4F9xUvancHhoBz94PTTz8krxp3iMH3u97EhAfnlgEjtedpf8qgYNGjRo0KBBA80xITKITZOHMqYMVHqe+FIgFicdPsammV969K04kO3Gn9rlwNAmO0WeHJuiQfiLJ4p2eMhjel5+aZwFPHF+Nj+Zf2meD+BCClHjMOFpzhBjRQwPIUNdQtzHOJIeBOUhpmgc8Aucjs36EDf2spOGkAXJA46AYqWIYrgOYW5WwtBMyEYAvIcQR4uUCtIaHpj6BBObmLeDgTl8D6myqOA5eCFZIRGIbHmlBpJuiIAZFqMgED4bwvmYIwwh725ji5A5xJDMpD608cTje8uCsH4CCQdWqnjAj+UEizOEpAryKQ5IayAhCYLAktF3wGthjJeoliRj2MOupyH/CCmFJZK0NuO3xzv4yBzbCXzerckEkgsP8yfGVitIPExMaHimMcBaFGQ0SMD7ougmGQYWTAumgDhw0KIQn55MUCaibBiLlL7IEEeXivz9kFRyhowz5IldzjC2rADP5a1PyDIQWeCAiQyUppicZXfh9+Hp4JJnn7xOh+flGaZgiFNwmSH1J5DW8trVUJZGELy8cGBonmToySrTKYZklYJUtzOGQ5IXpKDn1OPVAl7yCSAD9S2e+B8xjFEalppJsgIADPkxw3ABnbuCYehR6nGGscVImOfjlRhCipv6TpEhXY0oi4cZwwl2Khs9UKMl4eXACW2vIKtN/BHhDK0Q2lny+/R6C8LMQhEHCybHcwjsnkx2WUq1lKx6vP7orCjk414dhligM4/mMNVCshhSyTDN66eiVmcKjVrRYZsORskStDpGhpD0Yto8ZBam5KaWF+J6nxkyZ0mCqxh6hAzFkGreQtbrLzFcHTNkHkArMRxRqzCHJL+xZYW+b3HhS+nQo+kg8YChg6XhJbTDeVnLCWNLLZ9DUUwV47LA4QKGJmhqO7iCIdKwshrygFdLzjEcCduCNUztgh6mOHG+XN8AhWRS/tEIo1Pgd8RCKwkCrHSBRJb0ELoSox5yxwLWNMY6Mp6QslQwRCW7iqEDxhruZw7N2FnxRZhzDGNqpTEwEhWhAkOsRx/pIS+WE8s62FKYn9jxRBkuBj+BNwigoQlWpD1Z3l9iQ5IhzNiIL50M+UoMznnIQlBNijVOzhAroV8wJNzSBHyE0bSDO7cyxw2eRzAkkiEVo4vO3eJFKM5QMF0SsFGELiRD7g+5AoKtyP0hnALOz8ciHk6KmYChjLGSNqTggj2Uv5i3Q8CFg1kHW8rQ4MYhgYEi4pYjvD3hfRIMQSDOM0yxtvYU8C746IpHKRBMhVHvBQFnuAi4TTHDIJOfkLBACpwXcB+ntQOsHAZyQc/Hqlw7wB7FYbjKbucMQoZlZLjoSdwyhRgDGjAnwNjEo5i3EwbAMAhjvDnv3DKAgZK3H/nQCF9T9AK+GrnC0xs0aNCgQYMGDRo0aNCgQYMGDRo0aNCgQYN/Cu1/Hf8DQN5ySMIFv6UAAAAASUVORK5CYII=";

    doc.addImage(logoBase64, "PNG", 10, 10, 30, 30);

    // Add the title
    doc.setFontSize(18);
    doc.text("Student Report", 50, 20);

    // Add the current date
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 50, 30);

    // Use AutoTable to create a table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 60, // Position the table below the title
    });

    // Save the PDF
    doc.save("students.pdf");
  }

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Use the custom axios instance to get the teachers.
        const response = await api.get("/courses");
        // If your API returns the data directly or in a nested property,
        // adjust accordingly. For example, if it returns { teachers: [...] }:
        // setTeachers(response.data.teachers);

        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          console.log("Fetch failed:", response);
          return null;
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    }

    fetchCourses();
  }, []);

  const filteredStudents = data.filter((student) => {
    const nameMatches = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // If a course filter is provided, check the first class; otherwise, pass by default.
    const courseMatches = courseFilter?.id
      ? student.classes?.[0]?.course?.id === courseFilter.id
      : true;

    // console.log("courseMatches", courseMatches);

    // Check if the student's classes include the given class filter.
    const classMatches =
      !classFilter || classFilter === "All"
        ? true
        : student.classes
        ? student.classes
            .map((cls) => cls.id.toString())
            .includes(classFilter.toString())
        : false;

    const statusMatches =
      latePaymentFilter === "all"
        ? true
        : latePaymentFilter === "late"
        ? student.student_classes?.[0]?.paymentStatus === "late"
        : student.student_classes?.[0]?.paymentStatus !== "late";

    // console.log("classMatches", classMatches);

    return nameMatches && courseMatches && classMatches && statusMatches;
  });

  return (
    <>
      {view === "card" ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="course">Course</Label>
                <Select
                  value={courseFilter?.id.toString()}
                  onValueChange={(value) => {
                    const selectedCourse = courses.find(
                      (course) => course.id.toString() === value
                    );
                    setCourseFilter(selectedCourse);
                  }}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={gradeFilter?.id.toString()}
                  onValueChange={(value) => {
                    const selectedGrade = courseFilter?.grades?.find(
                      (grade) => grade.id.toString() === value
                    );
                    setGradeFilter(selectedGrade);
                  }}
                >
                  <SelectTrigger id="grade" disabled={true}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Grades</SelectItem>
                    {courseFilter?.grades?.map((grd) => (
                      <SelectItem key={grd.id} value={grd.id.toString()}>
                        {grd.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger
                    id="class"
                    disabled={courseFilter === undefined}
                  >
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Classes</SelectItem>
                    {!gradeFilter || gradeFilter.id.toString() === "All"
                      ? courseFilter?.classes?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))
                      : gradeFilter?.classes?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="latePayment">Payment Status</Label>
                <Select
                  value={latePaymentFilter}
                  onValueChange={setLatePaymentFilter}
                >
                  <SelectTrigger id="latePayment">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="upToDate">Up to date</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download List
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="course">Course</Label>
                <Select
                  value={courseFilter?.id.toString()}
                  onValueChange={(value) => {
                    const selectedCourse = courses.find(
                      (course) => course.id.toString() === value
                    );
                    setCourseFilter(selectedCourse);
                  }}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={gradeFilter?.id.toString()}
                  onValueChange={(value) => {
                    const selectedGrade = courseFilter?.grades?.find(
                      (grade) => grade.id.toString() === value
                    );
                    setGradeFilter(selectedGrade);
                  }}
                >
                  <SelectTrigger id="grade" disabled={true}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Grades</SelectItem>
                    {courseFilter?.grades?.map((grd) => (
                      <SelectItem key={grd.id} value={grd.id.toString()}>
                        {grd.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger
                    id="class"
                    disabled={courseFilter === undefined}
                  >
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Classes</SelectItem>
                    {!gradeFilter || gradeFilter.id.toString() === "All"
                      ? courseFilter?.classes?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))
                      : gradeFilter?.classes?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="latePayment">Payment Status</Label>
                <Select
                  value={latePaymentFilter}
                  onValueChange={setLatePaymentFilter}
                >
                  <SelectTrigger id="latePayment">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="upToDate">Up to date</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download List
                </Button>
              </div>
            </div>
          </div>
          {/* <StudentTable students={filteredStudents} /> */}
        </div>
      )}
    </>
  );
}
