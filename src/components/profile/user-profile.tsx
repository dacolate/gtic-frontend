"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, PenSquare } from "lucide-react";
import { UserInfo } from "@/hooks/useAuth";
import InitialsAvatar from "../InitialsAvatar";
import { useFormatter, useTranslations } from "next-intl";
import { NewUserDialog } from "./NewUserDialog";
import { AdminOnly } from "../adminOnly";

interface UserProfileProps {
  user: UserInfo;
}

export function UserProfile({ user }: UserProfileProps) {
  const t = useTranslations("profile.userInformation");
  const format = useFormatter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format.dateTime(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "teacher":
        return "secondary";
      case "staff":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{t("title")}</CardTitle>
          <Button variant="ghost" size="icon">
            <PenSquare className="h-4 w-4" />
            <span className="sr-only">{t("edit")}</span>
          </Button>
        </div>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <InitialsAvatar name={user.name} />
          <div className="text-center">
            <h3 className="font-medium text-lg">{user.name}</h3>
            <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>
              {t("joined")} {formatDate(user.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button variant="outline" className="w-full">
          {t("createUser")}
        </Button> */}
        <AdminOnly>
          <NewUserDialog />
        </AdminOnly>
      </CardFooter>
    </Card>
  );
}
