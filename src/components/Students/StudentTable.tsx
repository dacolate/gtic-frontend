"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  // MoreHorizontal,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course, Grade, Student } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateAge } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

function paymentStatusColor(paymentStatus: string, daysTilDeadline: number) {
  if (paymentStatus === "Not up to date") {
    return "bg-red-500";
  } else if (paymentStatus === "Up to date" && daysTilDeadline === 0) {
    return "bg-green-500";
  } else if (paymentStatus === "Up to date" && daysTilDeadline < 7) {
    return "bg-orange-500";
  } else if (paymentStatus === "Up to date" && daysTilDeadline >= 7) {
    return "bg-green-500";
  }
}

export function StudentTable({
  students,
  courses,
}: {
  students: Student[];
  courses: Course[];
}) {
  const [selectedCourse, setSelectedCourse] = React.useState<Course>();
  const [selectedGrade, setSelectedGrade] = React.useState<Grade>();
  const t = useTranslations("StudentTable");

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="text-center"
          >
            {t("Name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link href={`/students/${row.original.id}`} passHref>
          <div className="text-green-500 hover:underline cursor-pointer">
            {row.getValue("name") + " " + row.original.firstname}
          </div>
        </Link>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: () => <div className="text-center">{t("Payment Status")}</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center text-center ">
            <div
              className={`rounded-full w-3 h-3
                 ${paymentStatusColor(
                   row.original.student_classes?.[0]?.paymentStatus || "",
                   row.original.student_classes?.[0]?.daysTilDeadline || 0
                 )}
             `}
            ></div>
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const paymentStatus =
          row.original.student_classes?.[0]?.paymentStatus || "";
        const daysTilDeadline =
          row.original.student_classes?.[0]?.daysTilDeadline || 0;

        if (filterValue === "Up to date") {
          return paymentStatus === "Up to date";
        } else if (filterValue === "Due in 7 days") {
          return (
            paymentStatus === "Up to date" &&
            !!daysTilDeadline &&
            daysTilDeadline <= 7
          );
        } else if (filterValue === "Late") {
          return paymentStatus === "Not up to date";
        } else {
          return true; // No filter applied
        }
      },
    },
    {
      // This column extracts all course names from the student classes.
      accessorFn: (student) => {
        const courses = student.classes
          ? student.classes
              .map((cls) => cls.course?.name || "No Course")
              .filter((course) => Boolean(course)) // Ensure grade exists
          : [];
        console.log("Courses:", courses);
        return courses;
        // Debugging
      },
      id: "course", // unique id for the column
      header: t("Courses"),
      cell: ({ row }) => {
        const courses = row.getValue("course") as Array<string>;
        const firstCourse = courses[0];

        return (
          <div>
            {firstCourse && (
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm">{firstCourse}</div>
              </div>
            )}
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const grades = row.getValue(columnId) as Array<string>;
        console.log("gradesdj", grades);
        console.log("f", filterValue);
        return grades.some(
          (grade) => grade.toLowerCase() === filterValue.toLowerCase()
        );
      },
    },
    {
      accessorFn: (student) => {
        const grades = student.classes
          ? student.classes
              .map((cls) => cls.grade?.name || "No Grade")
              .filter((grade) => Boolean(grade)) // Ensure grade exists
          : [];
        console.log("Grades:", grades); // Debugging
        return grades;
      },
      id: "grade",
      header: () => <div className="text-center">{t("Grade")}</div>,
      cell: ({ row }) => {
        const grades = row.getValue("grade") as Array<string>;
        const firstGrade = grades[0];

        return (
          <div>
            {firstGrade && (
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm">{firstGrade}</div>
              </div>
            )}
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const grades = row.getValue(columnId) as Array<string>;
        return grades.some(
          (grade) => grade.toLowerCase() === filterValue.toLowerCase()
        );
      },
    },
    {
      accessorFn: (student) => {
        return student.classes
          ? student.classes
              .map((cls) => cls.name)
              .filter((name) => Boolean(name)) // Ensure class name exists
          : [];
      },
      id: "class",
      header: () => <div className="text-center">{t("Class")}</div>,
      cell: ({ row }) => {
        const classes = row.getValue("class") as Array<string>;
        const firstClass = classes[0];

        return (
          <div>
            {firstClass && (
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm">{firstClass}</div>
              </div>
            )}
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const classes = row.getValue(columnId) as Array<string>;
        return classes.some((cls) =>
          cls.toLowerCase().includes(filterValue.toLowerCase())
        );
      },
    },
    {
      accessorKey: "gender",
      header: () => <div className="text-center">{t("Gender")}</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("gender")}</div>
      ),
    },
    {
      accessorKey: "birthday",
      header: () => <div className="text-center">{t("Age")}</div>,
      cell: ({ row }) => {
        const birthday = row.getValue("birthday") as string;
        const age = calculateAge(birthday);

        return (
          <div className="text-center">
            {/* Display the age */}
            <div>{age + " ans"}</div>
            {/* Display the birthday (grayed and smaller) */}
            <div className="text-xs text-gray-500">
              {new Date(birthday).toLocaleDateString()} {/* Format the date */}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "nationality",
      header: () => <div className="text-center">{t("Nationality")}</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("nationality")}</div>
      ),
    },
    {
      id: "contact",
      header: () => <div className="text-center">{t("Contact")}</div>,
      cell: ({ row }) => {
        const phone = row.original.phone;
        const email = row.original.email;

        return (
          <div className="text-center">
            {/* Display the phone number */}
            <div>{phone}</div>
            {/* Display the email (smaller and grayed out) */}
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("createdAt")}</div>
      ),
      enableHiding: true,
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const student = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() =>
    //               navigator.clipboard.writeText(student.id.toString())
    //             }
    //           >
    //             Copy student ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View student</DropdownMenuItem>
    //           <DropdownMenuItem>Edit student</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  function handleDownload() {
    const headers = ["Name", "Email", "Phone", "Class", "Payment Status"];

    const tableData = table
      .getRowModel()
      .rows.map((row) => [
        row.original.name,
        row.original.gender,
        row.original.nationality,
        row.original.email,
        row.original.phone,
        row.original.active ? "Active" : "Inactive",
      ]);

    // Create a new jsPDF instance
    const doc = new jsPDF();

    const logoBase64 =
      "data:image/png;base64,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";

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

  console.log(students);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true, // sort by name in descending order by default
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      createdAt: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: students,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex ">
          {/* <Label htmlFor="search" className="sr-only">
            Search
          </Label> */}
          <div className="relative flex-1 mr-3">
            <Input
              id="search"
              placeholder={`${t("Searchstudent")}`}
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t("Columns")} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="course">{t("Course")}</Label>
            <Select
              value={
                (table.getColumn("course")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(event) => {
                if (event === "all") {
                  table.getColumn("course")?.setFilterValue("");
                  setSelectedCourse(undefined);
                } else {
                  table.getColumn("course")?.setFilterValue(event);
                  setSelectedCourse(courses.find((c) => c.name === event));
                }
              }}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder={t("Select course")} />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
                <SelectItem value={"all"}>{t("All Courses")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="grade">{t("Grade")}</Label>
            <Select
              value={
                (table.getColumn("grade")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(event) => {
                if (event === "all") {
                  table.getColumn("grade")?.setFilterValue("");
                  setSelectedGrade(undefined);
                } else {
                  table.getColumn("grade")?.setFilterValue(event);
                  setSelectedGrade(
                    selectedCourse?.grades?.find((g) => g.name === event)
                  );
                }
              }}
              disabled={!selectedCourse}
            >
              <SelectTrigger id="grade">
                <SelectValue placeholder={t("Select grade")} />
              </SelectTrigger>
              <SelectContent>
                {selectedCourse?.grades?.map((grade) => (
                  <SelectItem key={grade.id} value={grade.name}>
                    {grade.name}
                  </SelectItem>
                ))}
                <SelectItem value={"all"}>{t("All Grades")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="class">{t("Class")}</Label>
            <Select
              value={
                (table.getColumn("class")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(event) => {
                if (event === "all") {
                  table.getColumn("class")?.setFilterValue("");
                } else {
                  table.getColumn("class")?.setFilterValue(event);
                }
              }}
              disabled={!selectedGrade}
            >
              <SelectTrigger id="class">
                <SelectValue placeholder={t("Select class")} />
              </SelectTrigger>
              <SelectContent>
                {selectedGrade?.classes?.map((classs) => (
                  <SelectItem key={classs.id} value={classs.id.toString()}>
                    {classs.name}
                  </SelectItem>
                ))}
                <SelectItem value={"all"}>{t("All Classes")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentStatus">{t("Payment Status")}</Label>
            <Select
              value={
                (table
                  .getColumn("paymentStatus")
                  ?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("paymentStatus")?.setFilterValue("");
                } else {
                  table.getColumn("paymentStatus")?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger id="paymentStatus">
                <SelectValue placeholder={t("Select payment status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="Up to date">{t("Up to date")}</SelectItem>
                <SelectItem value="Due in 7 days">
                  {t("Due in 7 days")}
                </SelectItem>
                <SelectItem value="Late">{t("Late")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> {t("Download List")}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
