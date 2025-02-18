// export class RequestResponse {
//   static success<T>(data?: T, message?: string) {
//     return {
//       success: true,
//       data,
//       message,
//     };
//   }
//   static failure<T>(data?: T, message?: string) {
//     return {
//       success: false,
//       data,
//       message,
//     };
//   }
// }
export type RequestResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export interface Course {
  id: number;
  name: string;
  description: string;
  pricingId: number | null;
  createdAt: string;
  updatedAt: string;
  classes: Class[] | null;
  grades: Grade[] | null;
}

export interface Class {
  id: number;
  name: string;
  description: string | null;
  teacherId: number;
  gradeId: number | null;
  courseId: number;
  startDate: string;
  expectedDuration: number;
  createdAt: string;
  updatedAt: string;
  course: Course | null;
  grade: Grade | null;
}

export interface Grade {
  id: number;
  name: string;
  description: string | null;
  gradeId: number | null;
  pricingId: number | null;
  courseId: number;
  createdAt: string;
  updatedAt: string;
  classes: Class[] | null;
  pricing: Pricing;
}

export interface Teacher {
  id: number;
  name: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  classes: Class[] | null;
}

export interface TeachersResponse {
  success: boolean;
  data: Teacher[];
  message: string;
}

export interface Student {
  id: number;
  name: string;
  gender: string;
  nationality: string;
  birthday: string; // ISO 8601 date format
  cni: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
  createdAt: string; // ISO 8601 date format
  updatedAt: string; // ISO 8601 date format
  classes: Class[] | null;
  attendances: Attendance[] | null;
  payments: Payment[] | null;
  student_classes: StudentClass[] | null;
  parents: Parent[] | null;
}

export interface Attendance {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  presence: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  studentId: number;
  classId: number;
  amount: string;
  paymentMethod: string | null;
  details: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentClass {
  id: number;
  classId: number;
  studentId: number;
  startDate: string;
  pricingId: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  pricing: Pricing;
}

export interface Pricing {
  id: number;
  description: string;
  registerFee: string;
  instalment1Deadline: string;
  instalment1Fee: string;
  instalment2Deadline: string;
  instalment2Fee: string;
  createdAt: string;
  updatedAt: string;
}

export interface Parent {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
