"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { parentValidator, studentValidator } from "@/lib/validation";
import { useRouter } from "@/i18n/routing";
import { AxiosError } from "axios";

interface StudentInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

interface ParentInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function NewStudentForm() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    active: true,
  });

  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Store errors keyed by field name
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParentInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate student info locally using Zod
    const studentResult = studentValidator.safeParse(studentInfo);
    // Validate parent info locally using Zod
    const parentResult = parentValidator.safeParse(parentInfo);

    if (!studentResult.success || !parentResult.success) {
      const fieldErrors: { [key: string]: string } = {};

      if (!studentResult.success) {
        studentResult.error.errors.forEach((error) => {
          if (error.path && error.path.length > 0) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
      }

      if (!parentResult.success) {
        parentResult.error.errors.forEach((error) => {
          if (error.path && error.path.length > 0) {
            // In case of a name clash, you could prefix with `parent_`
            fieldErrors[error.path[0]] = error.message;
          }
        });
      }

      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Clear any existing errors
    setErrors({});

    try {
      const studentResponse = await api.post("/students", studentInfo);
      const parentResponse = await api.post("/parents", parentInfo);

      if (studentResponse.status === 201 && parentResponse.status === 201) {
        toast({
          title: "Success",
          description: "Student and Guardian information saved successfully.",
        });
        // Navigate back to the students list or wherever appropriate.
        router.push("/students");
      } else {
        toast({
          title: "Error",
          description: "Failed to save information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Check for API validation errors in the expected format
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data.data)
      ) {
        const apiErrors = error.response.data.data;
        const fieldErrors: { [key: string]: string } = {};
        apiErrors.forEach(
          (err: { field: string | number; message: string }) => {
            if (err.field) {
              fieldErrors[err.field] = err.message;
            }
          }
        );
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "An error occurred while saving information.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Student and Guardian Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={studentInfo.name}
                  onChange={handleStudentChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={studentInfo.email}
                  onChange={handleStudentChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={studentInfo.phone}
                  onChange={handleStudentChange}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={studentInfo.address}
                  onChange={handleStudentChange}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Guardian Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parentName">Name</Label>
                <Input
                  id="parentName"
                  name="name"
                  value={parentInfo.name}
                  onChange={handleParentChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parentEmail">Email</Label>
                <Input
                  id="parentEmail"
                  name="email"
                  type="email"
                  value={parentInfo.email}
                  onChange={handleParentChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parentPhone">Phone</Label>
                <Input
                  id="parentPhone"
                  name="phone"
                  type="tel"
                  value={parentInfo.phone}
                  onChange={handleParentChange}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="parentAddress">Address</Label>
                <Input
                  id="parentAddress"
                  name="address"
                  value={parentInfo.address}
                  onChange={handleParentChange}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Information"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
