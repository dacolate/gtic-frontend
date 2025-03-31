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

export function AdminUserActivities() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserInfo[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Function to fetch classes
    const fetchAllUsers = async () => {
      try {
        console.log(loading);
        setIsLoading(true); // Set loading to true before making the request
        const response = await api.get("/users/fetchAll"); // Replace with your API endpoint
        if (response.data.success) {
          setUsers(response.data.data); // Set the fetched classes
        } else {
          setError(response.data.message); // Handle API error message
        }
      } catch (error) {
        console.log("error", error);
        setError("An error occurred while fetching classes."); // Handle network or other errors
      } finally {
        setIsLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchAllUsers(); // Call the fetch function
  }, [loading]);

  console.log(error);

  if (!users) {
    return;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users Activity</CardTitle>
        <CardDescription>View activity history for all users</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedUserId || undefined}
          onValueChange={setSelectedUserId}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap h-auto">
            {users.map((user) => (
              <TabsTrigger key={user.id} value={user.id.toString()}>
                {user.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {users.map((user) => (
            <TabsContent key={user.id} value={user.id.toString()}>
              <ActivityHistory
                userId={user.id.toString()}
                title={`${user.name}'s Activity History`}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
