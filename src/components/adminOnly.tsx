// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { useUserInfo } from "@/app/[locale]/(main)/provider";
// import { useAuth } from "@/hooks/useAuth";
// import { useTranslations } from "next-intl";

interface AdminOnlyProps {
  children: React.ReactNode;
}

export function AdminOnly({ children }: AdminOnlyProps) {
  // const { userInfo, loading } = useAuth();
  // const trans = useTranslations();

  const userInfo = useUserInfo();

  console.log("adbn", userInfo);

  if (userInfo?.role === "admin") {
    console.log("Really an admin");
    return children;
  }
  return (
    // <AlertDialog>
    //   <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    //   <AlertDialogContent>
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>{trans("forbidden")}</AlertDialogTitle>
    //       <AlertDialogDescription>{trans("adminonly")}</AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <AlertDialogCancel>{trans("cancel")}</AlertDialogCancel>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>
    <></>
  );
}
