// "use client";

// import { ActivityHistory } from "@/components/profile/activity-history";
// import { AdminUserActivities } from "@/components/profile/admin-user-activities";
// import { UserProfile } from "@/components/profile/user-profile";
// import { ProfileHeader } from "@/components/profile/profile-header";
// import { useUserInfo } from "../provider";
// import { useTranslations } from "next-intl";

// export default function ProfilePage() {
//   const t = useTranslations("profile");
//   const currentUser = useUserInfo();

//   return (
//     <main className="container mx-auto py-6 px-4 space-y-8">
//       <ProfileHeader />
//       <div className="grid gap-8 md:grid-cols-3">
//         <div className="md:col-span-1">
//           <UserProfile user={currentUser} />
//         </div>
//         <div className="md:col-span-2 space-y-8">
//           <ActivityHistory
//             userId={currentUser.id.toString()}
//             title={t("activity.history.title")}
//           />
//           {currentUser.role === "admin" && <AdminUserActivities />}
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { ActivityHistory } from "@/components/profile/activity-history";
import { UserProfile } from "@/components/profile/user-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { useUserInfo } from "../provider";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserInfo } from "@/hooks/useAuth";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { AdminUserManagement } from "@/components/profile/admin-user-management";
import { AllUsersActivityView } from "@/components/profile/AllUsersActivityView";

export default function ProfilePage() {
  // const t = useTranslations("profile");
  const currentUser = useUserInfo();

  return (
    <main className="container mx-auto py-6 px-4 space-y-8">
      <ProfileHeader />
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left column - User Profile (always visible) */}
        <div className="md:col-span-1">
          <UserProfile user={currentUser} />
        </div>

        {/* Right column - Content based on user role */}
        <div className="md:col-span-2 space-y-8">
          {currentUser.role === "admin" ? (
            <AdminView currentUser={currentUser} />
          ) : (
            <RegularUserView currentUser={currentUser} />
          )}
        </div>
      </div>
    </main>
  );
}

function RegularUserView({ currentUser }: { currentUser: UserInfo }) {
  const t = useTranslations("profile.activity.history");
  return (
    <ActivityHistory
      userId={currentUser.id.toString()}
      title={t("myActivity")}
    />
  );
}

function AdminView({ currentUser }: { currentUser: UserInfo }) {
  const t = useTranslations("profile.admin");

  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="activity">{t("tabs.myActivity")}</TabsTrigger>
        <TabsTrigger value="users">{t("tabs.userManagement")}</TabsTrigger>
        <TabsTrigger value="allActivities">
          {t("tabs.allActivities")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="activity">
        <ActivityHistory
          userId={currentUser.id.toString()}
          title={t("tabs.myActivity")}
        />
      </TabsContent>

      <TabsContent value="users">
        <AdminUserManagement />
      </TabsContent>

      <TabsContent value="allActivities">
        <AllUsersActivityView />
      </TabsContent>
    </Tabs>
  );
}

// function AllUsersActivityView() {
//   const t = useTranslations("profile.admin.allActivities");

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{t("title")}</CardTitle>
//         <CardDescription>{t("description")}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {/* This would be a component similar to AdminUserActivities from your original code */}
//         <div className="text-center py-8">
//           <p>All users activity view would go here</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
