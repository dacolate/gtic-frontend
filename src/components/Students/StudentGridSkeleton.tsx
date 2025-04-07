// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Download, Feather, History } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export function StudentGridSkeleton() {
  const t = useTranslations("StudentTable");
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">{t("Students")}</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
          <Feather className="h-4 w-4 font-extrabold" />
          {t("New Student")}
        </Button>
        <Button className="flex items-center gap-2 bg-gray-500 hover:bg-green-600">
          <History className="h-4 w-4 font-extrabold" />
          {t("Ancient Students")}
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              {t("Searchstudent")}
            </Label>
            <Input
              id="search"
              placeholder="Search students..."
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="course">{t("Course")}</Label>
              <Select>
                <SelectTrigger id="course">
                  <SelectValue placeholder={t("Select course")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Courses")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class">{t("Class")}</Label>
              <Select>
                <SelectTrigger id="class" disabled={true}>
                  <SelectValue placeholder={t("Select class")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t("All Classes")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class">{t("Grade")}</Label>
              <Select>
                <SelectTrigger id="grade" disabled={true}>
                  <SelectValue placeholder={t("Select grade")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t("All Grades")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="latePayment">{t("Payment Status")}</Label>
              <Select>
                <SelectTrigger id="latePayment">
                  <SelectValue placeholder={t("All")} />
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
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" /> {t("Download List")}
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-gray-200 h-32">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}
        <div className="w-full">
          {/* Skeleton for the table header */}
          <div className="rounded-md border">
            <div className="flex justify-between p-4">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} className="h-6 w-[100px]" />
              ))}
            </div>

            {/* Skeleton for the table rows */}
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex justify-between">
                  {[...Array(8)].map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-6 w-[100px]" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton for the pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
