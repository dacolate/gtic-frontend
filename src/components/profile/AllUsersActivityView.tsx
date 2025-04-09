"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityHistory } from "./activity-history";
import api from "@/lib/axios";
import { UserInfo } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function AllUsersActivityView() {
  const t = useTranslations("profile.admin.allActivities");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/users/");
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.log(error);
        setError(t("errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [t]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">{t("loading")}</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          value={selectedUserId || undefined}
          onValueChange={setSelectedUserId}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap h-auto">
            {currentUsers.map((user) => (
              <TabsTrigger key={user.id} value={user.id.toString()}>
                {user.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {currentUsers.map((user) => (
            <TabsContent key={user.id} value={user.id.toString()}>
              <ActivityHistory
                userId={user.id.toString()}
                title={`${user.name} - ${t("activityHistory")}`}
              />
            </TabsContent>
          ))}

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{t("pagination.previous")}</span>
            </Button>
            <div className="text-sm text-muted-foreground">
              {t("pagination.page", {
                current: currentPage,
                total: Math.ceil(filteredUsers.length / usersPerPage),
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredUsers.length / usersPerPage)
              }
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{t("pagination.next")}</span>
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
