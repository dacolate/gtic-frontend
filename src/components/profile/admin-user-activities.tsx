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

export function AdminUserActivities() {
  const t = useTranslations("profile.activity.allUsers");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page

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
        setError("An error occurred while fetching classes." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [loading]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!users.length) {
    return null;
  }

  console.log(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
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
                title={`${user.name}`}
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
              <span className="sr-only">Previous</span>
            </Button>
            <div className="flex space-x-1">
              {Array.from({
                length: Math.ceil(users.length / usersPerPage),
              }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
