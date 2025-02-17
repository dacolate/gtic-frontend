"use client";

import { useState } from "react";
import type { Payment } from "@/types/payment";
import { PaymentCard } from "./PaymentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentListProps {
  payments: Payment[];
}

export function PaymentList({ payments }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterBy === "all" || payment.paymentStatus === filterBy;
    return matchesSearch && matchesFilter;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "amount") {
      return Number.parseFloat(b.amount) - Number.parseFloat(a.amount);
    }
    return 0;
  });

  const totalAmount = sortedPayments.reduce(
    (sum, payment) => sum + Number.parseFloat(payment.amount),
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            Total from {sortedPayments.length} payments
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by student or class"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="amount">Sort by Amount</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPayments.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </div>
    </div>
  );
}
