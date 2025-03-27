import { Student } from "@/components/datatable copy";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NewStudResponse, Payment, StudentClass } from "./types";

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

export function formatReadableDate(
  dateString: string,
  locale?: string | undefined
): string {
  let loc = locale;
  if (!loc) {
    loc = "en-US";
  }
  const date = new Date(dateString);
  return date.toLocaleDateString(loc, {
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

function formatDateTime(datetimeString: string | null, full: boolean) {
  // Parse the datetime string into a Date object
  if (!datetimeString) {
    return;
  }
  const date = new Date(datetimeString);

  // Extract day, month, year, hours, and minutes
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the date and time as "27/02/2025 a 09:24"
  if (full) {
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

export function NewStudResponseTOReceiptData(response: NewStudResponse) {
  const data = response.data;

  const receiptMatricule = generatePaymentMatricule(
    data.payment.createdAt,
    data.payment.id,
    data.student.id
  );
  const receiptDate = formatDateTime(data.payment.createdAt, true);

  const paymentMethod = data.payment.paymentMethod;
  const user = "Sonia";

  const courseName = data.chosenClass.course.name;
  const gradeName = data.chosenClass.grade.name;
  const className = data.chosenClass.name;
  const teacher = data.chosenClass.teacher.name;

  const studentName = data.student.name;
  const studentFirstName = data.student.firstname;
  const studentPhone = data.student.phone;
  const studentEmail = data.student.email || undefined;
  const studentId = data.student.id.toString();

  const totalFees =
    parseInt(data.pricing.registerFee) +
    parseInt(data.pricing.instalment1Fee) +
    parseInt(data.pricing.instalment2Fee);
  const amount = data.payment.amount;
  const remaining = data.studclass.remainingPayment | 0;
  const nextdeadline = data.studclass.nextdeadline;

  const input = [
    [
      `N° Recu: ${receiptMatricule}\n${receiptDate}\nPayé en ${paymentMethod}\nEncaissé par ${user}`,
      `Filiere: ${courseName}\nNiveau: ${gradeName}\nClasse: ${className}\nEnseignant: ${teacher}`,
    ],
    [
      `${studentName} ${studentFirstName}\n${studentPhone}${
        studentEmail ? `\n${studentEmail}` : ""
      }\nMatricule: ${studentId}`,
      `Montant à payer: ${totalFees}\nMontant paye: ${amount}\nCumul des versements: ${
        totalFees - remaining
      }\nSolde restant: ${remaining}`,
    ],
    [
      `Prochain versement a effectuer au plus tard le ${formatDateTime(
        nextdeadline,
        false
      )}\nLes frais de scolarite ne sont ni remboursables, ni cessibles, ni transferables`,
      "50.00",
    ],
    ["Total HT:", "5"],
  ];

  return input;
}

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateAndDownloadPdf = (response: NewStudResponse) => {
  const doc = new jsPDF();

  // Add logo at the top left
  const img = new Image();
  img.src = "/gticimg.png"; // Path to your logo
  doc.addImage(img, "PNG", 10, 10, 80, 20); // Adjust position (x, y) and size (width, height)

  // Add text at the top right
  doc.setFontSize(16); // Set font size for the heading
  doc.setFont("helvetica", "bold"); // Set font style
  doc.setTextColor(128); // Set text color to gray
  const text =
    "Centre de formation professionnelle\n         et de cours de langue";
  doc.text(text, 100, 18); // Position text at top right

  doc.setTextColor(0); // Reset text color to black

  // Table Data
  const data = NewStudResponseTOReceiptData(response); // Replace with your data transformation logic

  // Add the table
  autoTable(doc, {
    startY: 50, // Adjust startY to leave space for the logo and text
    head: [["RECU DE PAIEMENT", "Détails"]], // Table Headers
    body: data,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.5,
      lineColor: "black",
    },
    headStyles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: "bold" },

    didParseCell: function (data) {
      // Merge header row across both columns
      if (
        data.row.index === 0 &&
        data.column.index === 0 &&
        data.section === "head"
      ) {
        data.cell.colSpan = 2;
        data.cell.styles.halign = "center";
        data.cell.styles.fontSize = 15;
      }

      // Style the first row of the body
      if (
        data.row.index === 0 &&
        data.column.index === 0 &&
        data.section !== "head"
      ) {
        data.cell.styles.fontStyle = "bold";
      }

      // Merge row 2 & 3 in the second column
      if (data.row.index === 1 && data.column.index === 1) {
        data.cell.rowSpan = 2;
        data.cell.styles.valign = "middle";
      }

      // Merge last row across both columns
      if (data.row.index === 3 && data.column.index === 0) {
        data.cell.colSpan = 2;
        data.cell.text = [
          "Campus: Douala bonamoussadi carrefour lycée",
          "Tel: 696054293 / 675723263",
          "Facebook: Univgtic | https://gtic-univ.com",
        ];
        data.cell.styles.halign = "center";
      }
    },
  });

  // Add "CONDITION GENERALE DE VENTE" below the table
  doc.setFontSize(12); // Set font size
  doc.setFont("helvetica", "bold"); // Set font style
  doc.setTextColor(128); // Set text color to gray
  const conditionText = "CONDITION GENERALE DE VENTE";
  const conditionTextWidth = doc.getTextWidth(conditionText); // Calculate text width
  const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
  const conditionX = (pageWidth - conditionTextWidth) / 2; // Center the text horizontally
  doc.text(
    conditionText,
    conditionX,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable.previous.finalY + 15
  ); // Position text below the table

  // Add "Apprenant" and "Caissier(e)" at the bottom
  doc.setFontSize(12); // Set font size
  doc.setTextColor(0); // Reset text color to black
  const bottomY = doc.internal.pageSize.getHeight() - 30; // Position near the bottom of the page

  // "Apprenant" on the left
  doc.text("Apprenant", 20, bottomY);

  // Space for signature below "Apprenant"
  doc.setLineWidth(0.5);
  doc.line(20, bottomY + 20, 80, bottomY + 20); // Add a line for the signature

  // "Caissier(e)" on the right
  const caissierText = "Caissier(e)";
  const caissierTextWidth = doc.getTextWidth(caissierText);
  doc.text(caissierText, pageWidth - 20 - caissierTextWidth, bottomY);

  // Space for signature below "Caissier(e)"
  doc.line(pageWidth - 80, bottomY + 20, pageWidth - 20, bottomY + 20); // Add a line for the signature

  // Save the PDF with a filename
  doc.save(
    `recu_de_${response.data.student.name}_${response.data.payment.createdAt}.pdf`
  );
};

export function PaymentTOReceiptData(payment: Payment) {
  const data = payment;

  const receiptMatricule = generatePaymentMatricule(
    data.createdAt,
    data.id,
    data.student.id
  );
  const receiptDate = formatDateTime(data.createdAt, true);

  const paymentMethod = data.paymentMethod;
  const user = "Sonia";

  const courseName = data.class.grade?.course.name;
  const gradeName = data.class.grade?.name;
  const className = data.class.name;
  const teacher = data.class.teacher.name;

  const studentName = data.student.name;
  const studentFirstName = data.student.firstname;
  const studentPhone = data.student.phone;
  const studentEmail = data.student.email || undefined;
  const studentId = data.student.id.toString();

  const totalFees =
    parseInt(data.student_class.pricing?.registerFee || "0") +
    parseInt(data.student_class.pricing?.instalment1Fee || "0") +
    parseInt(data.student_class.pricing?.instalment2Fee || "0");
  const amount = data.amount;
  const remaining = parseInt(data.student_class.remainingPayment) | 0;
  const nextdeadline = data.student_class.nextdeadline;

  const input = [
    [
      `N° Recu: ${receiptMatricule}\n${receiptDate}\nPayé en ${paymentMethod}\nEncaissé par ${user}`,
      `Filiere: ${courseName}\nNiveau: ${gradeName}\nClasse: ${className}\nEnseignant: ${teacher}`,
    ],
    [
      `${studentName} ${studentFirstName}\n${studentPhone}${
        studentEmail ? `\n${studentEmail}` : ""
      }\nMatricule: ${studentId}`,
      `Montant à payer: ${totalFees}\nMontant paye: ${amount}\nCumul des versements: ${
        totalFees - remaining
      }\nSolde restant: ${remaining}`,
    ],
    [
      `Prochain versement a effectuer au plus tard le ${formatDateTime(
        nextdeadline,
        false
      )}\nLes frais de scolarite ne sont ni remboursables, ni cessibles, ni transferables`,
      "50.00",
    ],
    ["Total HT:", "5"],
  ];

  return input;
}

export const generateAndDownloadPdf2 = (payment: Payment) => {
  const doc = new jsPDF();

  // Add logo at the top left
  const img = new Image();
  img.src = "/gticimg.png"; // Path to your logo
  doc.addImage(img, "PNG", 10, 10, 80, 20); // Adjust position (x, y) and size (width, height)

  // Add text at the top right
  doc.setFontSize(16); // Set font size for the heading
  doc.setFont("helvetica", "bold"); // Set font style
  doc.setTextColor(128); // Set text color to gray
  const text =
    "Centre de formation professionnelle\n         et de cours de langue";
  doc.text(text, 100, 18); // Position text at top right

  doc.setTextColor(0); // Reset text color to black

  // Table Data
  const data = PaymentTOReceiptData(payment); // Replace with your data transformation logic

  // Add the table
  autoTable(doc, {
    startY: 50, // Adjust startY to leave space for the logo and text
    head: [["RECU DE PAIEMENT", "Détails"]], // Table Headers
    body: data,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.5,
      lineColor: "black",
    },
    headStyles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: "bold" },

    didParseCell: function (data) {
      // Merge header row across both columns
      if (
        data.row.index === 0 &&
        data.column.index === 0 &&
        data.section === "head"
      ) {
        data.cell.colSpan = 2;
        data.cell.styles.halign = "center";
        data.cell.styles.fontSize = 15;
      }

      // Style the first row of the body
      if (
        data.row.index === 0 &&
        data.column.index === 0 &&
        data.section !== "head"
      ) {
        data.cell.styles.fontStyle = "bold";
      }

      // Merge row 2 & 3 in the second column
      if (data.row.index === 1 && data.column.index === 1) {
        data.cell.rowSpan = 2;
        data.cell.styles.valign = "middle";
      }

      // Merge last row across both columns
      if (data.row.index === 3 && data.column.index === 0) {
        data.cell.colSpan = 2;
        data.cell.text = [
          "Campus: Douala bonamoussadi carrefour lycée",
          "Tel: 696054293 / 675723263",
          "Facebook: Univgtic | https://gtic-univ.com",
        ];
        data.cell.styles.halign = "center";
      }
    },
  });

  // Add "CONDITION GENERALE DE VENTE" below the table
  doc.setFontSize(12); // Set font size
  doc.setFont("helvetica", "bold"); // Set font style
  doc.setTextColor(128); // Set text color to gray
  const conditionText = "CONDITION GENERALE DE VENTE";
  const conditionTextWidth = doc.getTextWidth(conditionText); // Calculate text width
  const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
  const conditionX = (pageWidth - conditionTextWidth) / 2; // Center the text horizontally
  doc.text(
    conditionText,
    conditionX,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable.previous.finalY + 15
  ); // Position text below the table

  // Add "Apprenant" and "Caissier(e)" at the bottom
  doc.setFontSize(12); // Set font size
  doc.setTextColor(0); // Reset text color to black
  const bottomY = doc.internal.pageSize.getHeight() - 30; // Position near the bottom of the page

  // "Apprenant" on the left
  doc.text("Apprenant", 20, bottomY);

  // Space for signature below "Apprenant"
  doc.setLineWidth(0.5);
  doc.line(20, bottomY + 20, 80, bottomY + 20); // Add a line for the signature

  // "Caissier(e)" on the right
  const caissierText = "Caissier(e)";
  const caissierTextWidth = doc.getTextWidth(caissierText);
  doc.text(caissierText, pageWidth - 20 - caissierTextWidth, bottomY);

  // Space for signature below "Caissier(e)"
  doc.line(pageWidth - 80, bottomY + 20, pageWidth - 20, bottomY + 20); // Add a line for the signature

  // Save the PDF with a filename
  doc.save(`recu_de_${payment.student.name}_${payment.createdAt}.pdf`);
};

export function capitalizeFullName(fullName: string) {
  // Split the full name into parts
  const nameParts = fullName.split(" ");

  // Capitalize each part and join them back together
  const capitalizedName = nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

  return capitalizedName;
}

// Example usage:
export function PaymentStatus(studentClass: StudentClass) {
  const paymentStatus = studentClass.paymentStatus;
  const daysTilDeadline = studentClass.daysTilDeadline;
  if (paymentStatus === "Not up to date") {
    return false;
  } else if (paymentStatus === "Up to date" && daysTilDeadline === 0) {
    return true;
  } else if (
    paymentStatus === "Up to date" &&
    daysTilDeadline !== null &&
    daysTilDeadline < 7
  ) {
    return false;
  } else if (
    paymentStatus === "Up to date" &&
    daysTilDeadline !== null &&
    daysTilDeadline >= 7
  ) {
    return true;
  }
}
