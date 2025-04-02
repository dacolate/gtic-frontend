"use client";

import { useTranslations } from "next-intl";

export function ProfileHeader() {
  const t = useTranslations("profile");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
    </div>
  );
}
