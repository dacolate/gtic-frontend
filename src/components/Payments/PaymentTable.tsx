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
  // CalendarIcon,
  ChevronDown,
  Download,
  Search,
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useTranslations } from "next-intl";
import { Payment } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { generateAndDownloadPdf2, generatePaymentMatricule } from "@/lib/utils";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { format } from "date-fns";
// import { Calendar } from "../ui/calendar";

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const t = useTranslations("PaymentTable");
  const studclasses = payments.map((payment) => payment.student_class);
  // const [dateRange, setDateRange] = React.useState<{
  //   from: Date | undefined;
  //   to: Date | undefined;
  // }>({ from: undefined, to: undefined });
  console.log("studclass", studclasses);

  console.log("payments", payments);
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      id: "id",
      footer: () => {
        return <div className="text-center text-xl">Total</div>;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("PaymentRef")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const matricule = generatePaymentMatricule(
          row.original.createdAt,
          row.original.id,
          row.original.studentId
        );

        return (
          <div className="text-green-500  cursor-pointer flex gap-2">
            <Button
              variant="ghost"
              onClick={() => generateAndDownloadPdf2(row.original)}
              className="text-center"
            >
              <Download />
            </Button>
            <Link href={`/payments/${row.original.id}`} passHref>
              <p className="hover:underline cursor-pointer">{matricule}</p>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "student.name",
      id: "student.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("StudentName")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      footer: ({ table }) => {
        const uniqueStudents = new Set(
          table.getRowModel().rows.map((row) => row.original.studentId)
        );
        return (
          <div className="text-center">
            {uniqueStudents.size}
            <div className="text-sm">{t("Students")}</div>
          </div>
        );
      },
      cell: ({ row }) => (
        <Link href={`/students/${row.original.studentId}`} passHref>
          <div className="text-green-500 hover:underline cursor-pointer text-center ">
            {row.original.student.name + " " + row.original.student.firstname}
          </div>
        </Link>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Amount")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center ">{row.getValue("amount") + " F"}</div>
      ),
      footer: ({ table, column }) => {
        const rows = table.getRowModel().rows;
        const sum = rows.reduce((total, row) => {
          const value = row.getValue(column.id);
          return total + parseInt(value as string);
        }, 0);
        return (
          <div className="text-center text-xl  text-green-700">
            {sum + " F"}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      footer: ({ table }) => {
        const paymentMethods = new Set(
          table
            .getRowModel()
            .rows.map((row) => row.getValue("paymentMethod"))
            .filter(Boolean)
        );
        return (
          <div className="text-center text-xl">
            {Array.from(paymentMethods).join(", ")}
          </div>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Payment Method")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("paymentMethod") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
      footer: ({ table }) => {
        const dates = table
          .getRowModel()
          .rows.map((row) => new Date(row.getValue("createdAt")));
        const minDate = new Date(
          Math.min(...dates.map((date) => date.getTime()))
        );
        const maxDate = new Date(
          Math.max(...dates.map((date) => date.getTime()))
        );

        return minDate.toLocaleDateString() !== maxDate.toLocaleDateString() ? (
          <div className="text-center space-y-1">
            <div>{minDate.toLocaleDateString()}</div>
            <div>{maxDate.toLocaleDateString()}</div>
          </div>
        ) : (
          <div>
            <div>{minDate.toLocaleDateString()}</div>
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const paymentDate = new Date(row.getValue(columnId));
        const [startDate, endDate] = filterValue || [null, null];

        if (!startDate || !endDate) return true; // No filter applied

        // Include the entire end date (up to 23:59:59)
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        return paymentDate >= startDate && paymentDate <= adjustedEndDate;
      },
    },

    {
      accessorKey: "class",
      id: "class",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        return row.original.class.grade?.course?.name === filterValue;
      },
      footer: ({ table }) => {
        const uniqueCourses = [
          ...new Set(
            table
              .getRowModel()
              .rows.map((row) => row.original.class.grade?.course?.name)
          ),
        ].filter(Boolean);

        return (
          <div className="text-center">
            {uniqueCourses.map((course, index) => (
              <div key={index}>{course}</div>
            ))}
          </div>
        );
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          {t("class")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex-col space-y-1 items-center justify-center text-center">
          <div>{row.original.class.name}</div>
          <div>{row.original.class.grade?.name}</div>
          <div>{row.original.class.grade?.course?.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "student_class.remainingPayment",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Remaining Payment")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      footer: ({ table }) => {
        const rows = table.getRowModel().rows;
        const sum = rows.reduce((total, row) => {
          const value = row.original.student_class?.remainingPayment || 0;
          return total + parseInt(value as string);
        }, 0);
        return <div className="text-center text-xl">{sum + " F"}</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.student_class
            ? row.original.student_class.remainingPayment
            : "none"}
        </div>
      ),
    },
    {
      accessorKey: "student_class.nextdeadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Next Deadline")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.student_class ? (
            <div className="text-center">
              {row.original.student_class.nextdeadline
                ? new Date(
                    row.original.student_class.nextdeadline
                  ).toLocaleDateString()
                : "N/A"}
            </div>
          ) : (
            <div className="text-center">none</div>
          )}
        </>
      ),
    },
    // {
    //   accessorKey: "",
    //   id: "Download",
    //   header: "",
    //   cell: ({ row }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => generateAndDownloadPdf2(row.original)}
    //       className="text-center"
    //     >
    //       <Download />
    //     </Button>
    //   ),
    // },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true, // Sort by date in descending order by default
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: payments,
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

  const handleDownload = async () => {
    // Get all table data
    const rows = table.getRowModel().rows;

    // Prepare headers
    const headers = [t("StudentName"), t("class"), t("Amount"), t("Date")];

    // Prepare data rows with proper formatting
    const tableData = rows.map((row) => [
      `${row.original.student.name} ${row.original.student.firstname}`,
      `${row.original.class.name}${
        row.original.class.grade?.name
          ? ` - ${row.original.class.grade.name}`
          : ""
      }${
        row.original.class.grade?.course?.name
          ? ` - ${row.original.class.grade.course.name}`
          : ""
      }`,
      row.original.amount + " F",
      formatDate(new Date(row.original.createdAt)),
    ]);

    // Calculate footer values
    const uniqueStudents = new Set(rows.map((row) => row.original.studentId))
      .size;
    const amountSum = rows.reduce(
      (sum, row) => sum + parseInt(row.original.amount),
      0
    );

    const dates = rows.map((row) => new Date(row.original.createdAt));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const footerData = [
      `${uniqueStudents} ${t("Students")}`,
      "                  ",
      amountSum + " F       ",
      `${formatDate(minDate)} - ${formatDate(maxDate)}`,
    ];

    // Create PDF
    const doc = new jsPDF();

    const logoBase64 =
      "data:image/png;base64,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";

    doc.addImage(logoBase64, "PNG", 10, 10, 30, 30);

    // Title and metadata
    doc.setFontSize(16);
    doc.setTextColor(21, 128, 61);
    doc.text(t("Payment Report"), 50, 20);
    doc.setFontSize(10);
    doc.text(t("Generated on") + ": " + formatDate(new Date()), 50, 26);

    // Calculate row height and available space
    const rowHeight = 12; // Increased from 10 to 12
    // const headerHeight = 10;
    const footerHeight = 15;
    const pageHeight = doc.internal.pageSize.height - 40;
    const startY = 45;

    // Group data into pages with footer
    const rowsPerPage = Math.floor((pageHeight - footerHeight) / rowHeight);
    const pageData = [];

    for (let i = 0; i < tableData.length; i += rowsPerPage) {
      const pageRows = tableData.slice(i, i + rowsPerPage);
      if (i + rowsPerPage >= tableData.length) {
        pageData.push({ rows: pageRows, footer: footerData });
      } else {
        pageData.push({ rows: pageRows, footer: null });
      }
    }

    // Generate pages
    pageData.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        doc.addPage();
      }

      autoTable(doc, {
        head: pageIndex === 0 ? [headers] : undefined,
        body: page.rows,
        startY: pageIndex === 0 ? startY : 20,
        margin: { horizontal: 14 },
        styles: {
          cellPadding: 6, // Increased from 5
          fontSize: 10, // Increased from 9
          valign: "middle",
          halign: "left",
          textColor: [50, 50, 50],
          fillColor: [255, 255, 255],
          lineColor: [200, 200, 200],
          lineWidth: 0.2,
          minCellHeight: 12, // Added minimum cell height
          minCellWidth: 50,
        },
        headStyles: {
          fillColor: [21, 168, 61],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          cellPadding: 6,
        },
        columnStyles: {
          0: { cellWidth: 50, halign: "left" }, // Student name
          1: {
            cellWidth: 50, // Increased from 20
            halign: "center",
            cellPadding: { top: 6, right: 6, bottom: 6, left: 6 }, // Explicit padding
          }, // Amount
          2: {
            cellWidth: 35, // Increased from 20
            halign: "center",
            cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
          }, // Date
          3: {
            cellWidth: "auto",
            halign: "center", // Changed from left to center
            cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
          }, // Class
        },
      });

      // Add footer if this is the last page
      if (page.footer) {
        const finalY =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (doc as any).lastAutoTable.finalY ||
          startY + page.rows.length * rowHeight;

        autoTable(doc, {
          body: [page.footer],
          startY: finalY + 5,
          margin: { horizontal: 14 },
          styles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            fontSize: 14,
            cellPadding: 6,
            minCellHeight: 12,
          },
          columnStyles: {
            0: { halign: "left", cellPadding: 6 },
            1: { halign: "right", cellPadding: 6 },
            2: { halign: "center", cellPadding: 6 },
            3: { halign: "center", cellPadding: 6 }, // Centered
          },
        });
      }

      // Add page number
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${pageIndex + 1} of ${pageData.length}`,
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    });

    // Save the PDF
    doc.save(
      `payment-report-${formatDate(new Date()).replace(/\//g, "-")}.pdf`
    );
  };

  // Helper function for consistent date formatting
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Helper functions
  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("fr-FR", {
  //     style: "currency",
  //     currency: "XOF",
  //     minimumFractionDigits: 0,
  //   })
  //     .format(amount)
  //     .replace("XOF", "F");
  // };

  const handleTimePeriodFilter = (period: string) => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (period) {
      case "Today":
        startDate = startOfToday;
        endDate = endOfToday;
        break;
      case "Yesterday":
        startDate = new Date(today.setDate(today.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "Last 7 Days":
        startDate = new Date(today.setDate(today.getDate() - 7));
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfToday;
        break;
      case "Last Month":
        startDate = new Date(today.setDate(today.getDate() - 31));
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfToday;
      case "Last Year":
        startDate = new Date(today.setDate(today.getDate() - 366));
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfToday;
      default:
        startDate = null;
        endDate = null;
    }

    // Pass the date range to the filter
    table
      .getColumn("createdAt")
      ?.setFilterValue(startDate && endDate ? [startDate, endDate] : undefined);
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex">
          <div className="relative flex-1 mr-3">
            <Input
              id="search"
              placeholder={`${t("Search payments")}`}
              value={
                (table.getColumn("student.name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("student.name")
                  ?.setFilterValue(event.target.value)
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="paymentMethod">{t("Payment Method")}</Label>
            <Select
              value={
                (table
                  .getColumn("paymentMethod")
                  ?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("paymentMethod")?.setFilterValue("");
                } else {
                  table.getColumn("paymentMethod")?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder={t("Select payment method")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="Cash">{t("Cash")}</SelectItem>
                <SelectItem value="Card">{t("Card")}</SelectItem>
                <SelectItem value="Bank Transfer">
                  {t("Bank Transfer")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="courses">{t("Courses")}</Label>
            <Select
              value={
                (table.getColumn("class")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                table
                  .getColumn("class")
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger id="courses">
                <SelectValue placeholder={t("Select course")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                {/* Get unique courses from the table data */}
                {[
                  ...new Set(
                    table
                      .getCoreRowModel()
                      .rows.map((row) => row.original.class.grade?.course?.name)
                      .filter(Boolean)
                  ),
                ].map((courseName) => (
                  <SelectItem key={courseName} value={courseName || ""}>
                    {courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <Label htmlFor="paymentStatus">{t("Payment Status")}</Label>
            <Select
              value={
                (table
                  .getColumn("student_class.paymentStatus")
                  ?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                if (value === "all") {
                  table
                    .getColumn("student_class.paymentStatus")
                    ?.setFilterValue("");
                } else {
                  table
                    .getColumn("student_class.paymentStatus")
                    ?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger id="paymentStatus">
                <SelectValue placeholder={t("Select payment status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="Not up to date">
                  {t("Not up to date")}
                </SelectItem>
                <SelectItem value="Up to date">{t("Up to date")}</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div>
            <Label htmlFor="timePeriod">{t("Time Period")}</Label>
            <Select onValueChange={(value) => handleTimePeriodFilter(value)}>
              <SelectTrigger id="timePeriod">
                <SelectValue placeholder={t("Select time period")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">{t("Today")}</SelectItem>
                <SelectItem value="Yesterday">{t("Yesterday")}</SelectItem>
                <SelectItem value="Last 7 Days">{t("Last 7 Days")}</SelectItem>
                <SelectItem value="Last Month">{t("Last Month")}</SelectItem>
                <SelectItem value="Last Year">{t("Last Year")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex flex-col space-y-2">
            <Label htmlFor="dateRange">{t("Date Range")}</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRange"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                          {format(dateRange.to, "MMM dd, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>{t("Pick a date range")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                      // Apply filter immediately when dates are selected
                      if (range?.from && range?.to) {
                        table
                          .getColumn("createdAt")
                          ?.setFilterValue([range.from, range.to]);
                      } else {
                        table.getColumn("createdAt")?.setFilterValue(undefined);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  table.getColumn("createdAt")?.setFilterValue(undefined);
                }}
              >
                {t("Clear")}
              </Button>
            </div>
          </div> */}
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
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableFooter>
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
