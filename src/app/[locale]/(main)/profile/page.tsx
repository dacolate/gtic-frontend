"use client";

import { ActivityHistory } from "@/components/profile/activity-history";
import { AdminUserActivities } from "@/components/profile/admin-user-activities";
import { UserProfile } from "@/components/profile/user-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { useUserInfo } from "../provider";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const currentUser = useUserInfo();

  return (
    <main className="container mx-auto py-6 px-4 space-y-8">
      <ProfileHeader />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserProfile user={currentUser} />
        </div>
        <div className="md:col-span-2 space-y-8">
          <ActivityHistory
            userId={currentUser.id.toString()}
            title={t("activity.history.title")}
          />
          {currentUser.role === "admin" && <AdminUserActivities />}
        </div>
      </div>
    </main>
  );
}
