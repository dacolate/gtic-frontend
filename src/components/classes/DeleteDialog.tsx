import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useUserInfo } from "@/app/[locale]/(main)/provider";

interface DeleteDialogProps {
  children: React.ReactNode;
  objectName: string;
  id: number | undefined;
  onSuccess?: () => void;
  back?: boolean;
  refresh?: boolean;
}

export function DeleteDialog({
  children,
  objectName,
  id,
  onSuccess,
  back = true,
  refresh = false,
}: DeleteDialogProps) {
  const userInfo = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const trans = useTranslations();
  const t = useTranslations("DeleteDialog");
  const router = useRouter();
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!id) return;
      const response = await api.delete(`/${objectName}/${id}`);
      if (response.data.success) {
        toast({
          title: t("success.title"),
          description: t("success.description"),
        });
      }
      onSuccess?.();
      if (back) {
        router.back();
      }
      if (refresh) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: t("error.title"),
        description: t("error.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {" "}
            {userInfo?.role === "admin" ? t("title") : trans("forbidden")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {userInfo?.role === "admin"
              ? t("description", { objectName })
              : trans("adminonly")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
          {userInfo?.role === "admin" && (
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? t("deleting") : t("continue")}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
