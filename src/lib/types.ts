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
  classes: Class[] | undefined;
  grades: Grade[] | undefined;
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
  teacher: Teacher;
  pricing: Pricing;
}

export interface Grade {
  id: number;
  name: string;
  description: string | null;
  pricingId: number | null;
  courseId: number;
  createdAt: string;
  updatedAt: string;
  classes: Class[] | null;
  course: Course;
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
  firstname: string;
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
  studentClassId: number;
  amount: string;
  paymentMethod: string | null;
  details: string | null;
  createdAt: string;
  updatedAt: string;
  student: Student;
  student_class: StudentClass;
}

export interface StudentClass {
  id: number;
  classId: number;
  studentId: number;
  startDate: string | null; // ISO date string (nullable)
  pricingId: number;
  paymentStatus: string; // Enum-like value (e.g., "Not up to date")
  daysTilDeadline: number | null; // Number of days (nullable)
  nextdeadline: string | null; // ISO date string (nullable)
  remainingPayment: string; // Represented as a string to handle decimal values
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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

export type NewStudResponse = {
  success: boolean;
  data: {
    student: {
      name: string;
      firstname: string;
      phone: string;
      email: string | undefined;
      address: string;
      gender: string;
      nationality: string;
      birthday: string;
      createdAt: string;
      updatedAt: string;
      id: number;
    };
    chosenClass: {
      id: number;
      name: string;
      description: string | null;
      teacherId: number;
      gradeId: number | null;
      courseId: number;
      startDate: string;
      expectedDuration: number;
      course: {
        id: number;
        name: string;
        description: string;
        pricingId: number | null;
        createdAt: string;
        updatedAt: string;
      };
      grade: {
        id: number;
        name: string;
        description: string | null;
        pricingId: number | null;
        courseId: number;
        createdAt: string;
        updatedAt: string;
      };
      teacher: {
        id: number;
        name: string;
        phone: string;
        email: string;
        active: boolean;
        createdAt: string;
        updatedAt: string;
      };
      createdAt: string;
      updatedAt: string;
    };
    parent: Parent | null;
    payment: {
      id: number;
      studentId: number;
      classId: number;
      studentClassId: number;
      amount: number;
      paymentMethod: string | null;
      createdAt: string;
      updatedAt: string;
    };
    pricing: Pricing;
    studclass: {
      id: number;
      classId: number;
      studentId: number;
      pricingId: number;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      remainingPayment: number;
      nextdeadline: string;
    };
  };
  message: string;
};
