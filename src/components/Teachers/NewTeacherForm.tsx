"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { teacherValidator } from "@/lib/validation";
import { ClassAssignmentForm } from "./TeacherClassAssignmentForm";
import { useRouter } from "@/i18n/routing";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

interface TeacherInfo {
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export function NewTeacherForm() {
  const t = useTranslations("NewTeacherForm");
  const [step, setStep] = useState(1);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    name: "",
    email: "",
    phone: "",
    active: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationResult = teacherValidator.safeParse(teacherInfo);
    if (!validationResult.success) {
      const fieldErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path && error.path.length > 0) {
          fieldErrors[error.path[0]] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await api.post("/teachers", teacherInfo);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: t("messages.success"),
        });
      } else {
        toast({
          title: "Error",
          description: t("messages.error"),
          variant: "destructive",
        });
      }
    } catch (error) {
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
          description: t("messages.errorGeneric"),
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
    if (Object.keys(errors).length === 0) {
      toast({
        title: t("messages.teacherAdded"),
        description: t("messages.teacherAdded"),
      });
      setStep(2);
    }
  };

  const handleSkip = () => {
    router.push("/teachers");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {step === 1 ? t("title.step1") : t("title.step2")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">{t("form.name")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={teacherInfo.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">{t("form.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={teacherInfo.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">{t("form.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={teacherInfo.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("form.saving")}
                  </>
                ) : (
                  t("form.submit")
                )}
              </Button>
            </motion.form>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              <ClassAssignmentForm
                teacherName={teacherInfo.name}
                onSkip={handleSkip}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
