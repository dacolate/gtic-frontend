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
