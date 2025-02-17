import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Download, Feather, History, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export function StudentGridSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Students</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
          <Feather className="h-4 w-4 font-extrabold" />
          New Student
        </Button>
        <Button className="flex items-center gap-2 bg-gray-500 hover:bg-green-600">
          <History className="h-4 w-4 font-extrabold" />
          Ancient Students
        </Button>
        <Button
          variant="destructive"
          className="flex items-center gap-2 opacity-45"
        >
          <Trash2 className="h-4 w-4" />
          Delete Student
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search students..."
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="course">Course</Label>
              <Select>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Select>
                <SelectTrigger id="class" disabled={true}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="latePayment">Payment Status</Label>
              <Select>
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
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download List
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
}
