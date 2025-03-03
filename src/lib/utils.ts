import { Student } from "@/components/datatable copy";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const data2: Student[] = [
  {
    id: "S001",
    names: "Alice Johnson",
    phone: "555-0101",
    classes: ["Mathematics", "History"],
    attendance: "92%",
    paiement_status: "up to date",
  },
  {
    id: "S002",
    names: "Bob Smith",
    phone: "555-0102",
    classes: ["Science", "English"],
    attendance: "85%",
    paiement_status: "late",
  },
  {
    id: "S003",
    names: "Charlie Davis",
    phone: "555-0103",
    classes: ["Art", "Music"],
    attendance: "88%",
    paiement_status: "up to date",
  },
  {
    id: "S004",
    names: "Diana Evans",
    phone: "555-0104",
    classes: ["Biology", "Chemistry"],
    attendance: "94%",
    paiement_status: "up to date",
  },
  {
    id: "S005",
    names: "Edward Foster",
    phone: "555-0105",
    classes: ["Physical Education", "Mathematics"],
    attendance: "80%",
    paiement_status: "late",
  },
];

export function dateSimplifier({ date }: { date: string }) {
  const simpler = date.split("T")[0];

  return simpler;
}

export const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export function formatReadableDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generatePaymentMatricule(
  createdAt: string,
  id: number,
  studentId: number
): string {
  // Extract the date part from createdAt (e.g., "2025-02-28")
  const datePart = new Date(createdAt)
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  // Combine the date, id, and studentId into a unique string
  const matricule = `PAY-${datePart}-${id}-${studentId}`;

  return matricule;
}
