"use client";

import { ActivityHistory } from "@/components/profile/activity-history";

import { useUserInfo } from "../provider";
import { AdminUserActivities } from "@/components/profile/admin-user-activities";
import { UserProfile } from "@/components/profile/user-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
export default function ProfilePage() {
  // In a real app, this would come from your auth system
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
            title="Your Activity History"
          />

          {/* Only show all users' activities to admins */}
          {currentUser.role === "admin" && <AdminUserActivities />}
        </div>
      </div>
    </main>
  );
}
