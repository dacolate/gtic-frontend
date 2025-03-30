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
  Row,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Input } from "../ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslations } from "next-intl";
import { Course } from "@/lib/types";
import { AddGradeDialog } from "./AddGradeDialog";
import { DeleteDialog } from "../classes/DeleteDialog";
import { AdminOnly } from "../adminOnly";

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const t = useTranslations("CourseTable");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t("locale"), {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const CourseSubComponent = ({ row }: { row: Row<Course> }) => {
    const course = row.original;

    const t = useTranslations("CourseTable");

    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 my-2">
        {/* Add Grade Button Row */}

        {/* Rest of your component */}
        {/* ... */}
        {/* Grades Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">
            {t("Grades")} ({course.grades?.length || 0})
          </h3>
          {course.grades && course.grades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Grade Name")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Description")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("Classes Count")}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {course.grades.map((grade) => (
                    <tr key={grade.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {grade.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {grade.description || "-"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {grade.classes?.length || 0}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <DeleteDialog
                          objectName="grades"
                          id={grade.id}
                          back={false}
                          refresh={true}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0"
                          >
                            <Trash2 />
                          </Button>
                        </DeleteDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No grades available</p>
          )}
        </div>

        {/* Classes Section */}
        {/* <div>
            <h3 className="font-semibold text-lg mb-3">
              Classes ({course.classes?.length || 0})
            </h3>
            {course.classes && course.classes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration (min)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {course.classes.map((classItem) => (
                      <tr key={classItem.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {classItem.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {classItem.teacher?.name || "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {classItem.startDate
                            ? formatDate(classItem.startDate)
                            : "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {classItem.expectedDuration || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No classes available</p>
            )}
           </div> */}
      </div>
    );
  };

  // Then in your table component:
  const renderSubComponent = ({ row }: { row: Row<Course> }) => {
    return <CourseSubComponent row={row} />;
  };

  const columns: ColumnDef<Course>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </button>
        ) : (
          <Ban />
        );
      },
    },
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Course Name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      id: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Description")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.description}</div>
      ),
    },
    {
      id: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Created Date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{formatDate(row.original.createdAt)}</div>
      ),
      accessorFn: (row) => new Date(row.createdAt).getTime(), // For proper sorting
    },
    {
      id: "gradesCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Grades Count")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.grades?.length || 0}</div>
      ),
      accessorFn: (row) => row.grades?.length || 0, // For proper sorting
    },
    {
      id: "classesCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Classes Count")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.classes?.length || 0}</div>
      ),
      accessorFn: (row) => row.classes?.length || 0, // For proper sorting
    },
    {
      id: "actions",
      header: () => <span></span>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AddGradeDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            course={{ id: row.original.id, name: row.original.name }}
          />
          <AdminOnly>
            <Button
              variant="ghost"
              size="icon"
              className="p-0"
              // onClick={() => setIsDialogOpen(true)}
            >
              <Plus />
            </Button>
          </AdminOnly>
          <AdminOnly>
            <DeleteDialog
              objectName="courses"
              id={row.original.id}
              back={false}
              refresh={true}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0"
              >
                <Trash2 />
              </Button>
            </DeleteDialog>
          </AdminOnly>
        </div>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: courses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: (row) => (row.original.grades ?? []).length > 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDownload = () => {
    const headers = [
      "Course Name",
      "Description",
      "Created Date",
      "Grades Count",
      "Classes Count",
    ];

    const tableData = courses.map((course) => [
      course.name,
      course.description,
      formatDate(course.createdAt),
      course.grades?.length || 0,
      course.classes?.length || 0,
    ]);

    const doc = new jsPDF();

    // Add the title
    doc.setFontSize(18);
    doc.text("Course Report", 50, 20);

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
    doc.save("courses.pdf");
  };

  // const renderSubComponent = ({ row }: { row: Row<Course> }) => {
  //   const course = row.original;

  //   return (
  //     <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 my-2">
  //       {/* Grades Section */}
  //       <div className="mb-6">
  //         <h3 className="font-semibold text-lg mb-3">
  //           {t("Grades")} ({course.grades?.length || 0})
  //         </h3>
  //         {course.grades && course.grades.length > 0 ? (
  //           <div className="overflow-x-auto">
  //             <table className="min-w-full divide-y divide-gray-200">
  //               <thead className="bg-gray-100">
  //                 <tr>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     {t("Grade Name")}
  //                   </th>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     {t("Description")}
  //                   </th>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     {t("Classes Count")}
  //                   </th>
  //                 </tr>
  //               </thead>
  //               <tbody className="bg-white divide-y divide-gray-200">
  //                 {course.grades.map((grade) => (
  //                   <tr key={grade.id}>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
  //                       {grade.name}
  //                     </td>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
  //                       {grade.description || "-"}
  //                     </td>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
  //                       {grade.classes?.length || 0}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         ) : (
  //           <p className="text-sm text-gray-500">No grades available</p>
  //         )}
  //       </div>

  //       {/* Classes Section */}
  //       {/* <div>
  //         <h3 className="font-semibold text-lg mb-3">
  //           Classes ({course.classes?.length || 0})
  //         </h3>
  //         {course.classes && course.classes.length > 0 ? (
  //           <div className="overflow-x-auto">
  //             <table className="min-w-full divide-y divide-gray-200">
  //               <thead className="bg-gray-100">
  //                 <tr>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Class Name
  //                   </th>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Teacher
  //                   </th>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Start Date
  //                   </th>
  //                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                     Duration (min)
  //                   </th>
  //                 </tr>
  //               </thead>
  //               <tbody className="bg-white divide-y divide-gray-200">
  //                 {course.classes.map((classItem) => (
  //                   <tr key={classItem.id}>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
  //                       {classItem.name}
  //                     </td>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
  //                       {classItem.teacher?.name || "-"}
  //                     </td>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
  //                       {classItem.startDate
  //                         ? formatDate(classItem.startDate)
  //                         : "-"}
  //                     </td>
  //                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
  //                       {classItem.expectedDuration || "-"}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         ) : (
  //           <p className="text-sm text-gray-500">No classes available</p>
  //         )}
  //       </div> */}
  //     </div>
  //   );
  // };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex">
          <div className="relative flex-1 mr-3">
            <Input
              id="search"
              placeholder={`${t("Search courses")}`}
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

        <div className="flex items-end">
          <Button className="w-full" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> {t("Download List")}
          </Button>
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
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
