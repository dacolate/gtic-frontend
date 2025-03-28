"use client";

import { PaymentActionButtons } from "@/components/Payments/PaymentActionButton";
import { PaymentTable } from "@/components/Payments/PaymentTable";
import TypingLoader from "@/components/TypingLoader";
import { usePayments } from "@/lib/axios";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

export default function PaymentsPage() {
  const t = useTranslations("PaymentTable");
  const { data, error, isLoading, isError } = usePayments();
  // const { data } = useStudents();

  if (isLoading) return <TypingLoader />; // Display loading state

  if (isError) return <div>{error.message}</div>;

  console.log("data", data);
  // console.log("s", studs);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4"
    >
      {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Students</h1> */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Payments")}</h1>
      </div>
      <PaymentActionButtons />

      <PaymentTable payments={data.data} />
    </motion.div>
  );
}
