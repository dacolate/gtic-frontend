"use client";

import { Button } from "@/components/ui/button";
import { Edit, CreditCard, RefreshCw, Users } from "lucide-react";

export function ActionButtons({
  studentId,
  className,
}: {
  studentId: string;
  className?: string;
}) {
  const handleModify = () => {
    console.log("Modify student", studentId);
  };

  const handleAddPayment = () => {
    console.log("Add payment for student", studentId);
  };

  const handleReinscription = () => {
    console.log("Reinscribe student", studentId);
  };
  const handleClassAffectation = () => {
    console.log("Affect Student to Class", studentId);
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Button
        onClick={handleModify}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Modify
      </Button>
      <Button
        onClick={handleAddPayment}
        variant="outline"
        className="flex items-center gap-2"
      >
        <CreditCard className="h-4 w-4" />
        Add Payment
      </Button>
      <Button
        onClick={handleReinscription}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        Affect to a class
      </Button>
      <Button
        onClick={handleClassAffectation}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reinscription
      </Button>
    </div>
  );
}
