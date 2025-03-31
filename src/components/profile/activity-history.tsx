"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { Activity } from "@/lib/types";

interface ActivityHistoryProps {
  userId: string;
  title: string;
}

export function ActivityHistory({ userId, title }: ActivityHistoryProps) {
  const [filter, setFilter] = useState<string>("all");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/activities/${userId}`);
        if (response.data.success) {
          setActivities(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("An error occurred while fetching activities.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivities();
  }, [userId]);

  // Filter activities based on selected filter
  // const activitieswithoutUser = activities.filter(
  //   (activity) => activity.tableName !== "User"
  // );

  // setActivities(activitieswithoutUser);
  const filteredActivities =
    filter === "all"
      ? activities.filter((a) => a.tableName !== "User") // Filter here instead
      : activities.filter((a) => a.tableName === filter);

  // Map action types to more readable formats
  const getActionLabel = (action: string, tableName: string) => {
    if (tableName === "User") {
      switch (action) {
        case "create":
          return "Registered";
        case "update":
          return "Logged in";
        case "delete":
          return "Logged out";
        default:
          return action;
      }
    }
    return `${action.charAt(0).toUpperCase() + action.slice(1)} ${tableName}`;
  };

  // Get activity badge based on type
  const getActivityBadge = (tableName: string, action: string) => {
    const baseColors: Record<string, string> = {
      User: "bg-blue-500",
      Student: "bg-green-500",
      Class: "bg-purple-500",
      Course: "bg-red-500",
      Grade: "bg-yellow-500",
      Payment: "bg-amber-500",
    };

    const color = baseColors[tableName] || "bg-gray-500";

    if (tableName === "User") {
      switch (action) {
        case "create":
          return <Badge className="bg-green-500">Registration</Badge>;
        case "update":
          return <Badge className="bg-blue-500">Login</Badge>;
        case "delete":
          return <Badge className="bg-red-500">Logout</Badge>;
      }
    }

    return <Badge className={color}>{tableName}</Badge>;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Recent actions and changes</CardDescription>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="User">User Activities</SelectItem>
              <SelectItem value="Student">Student Activities</SelectItem>
              <SelectItem value="Class">Class Activities</SelectItem>
              <SelectItem value="Course">Course Activities</SelectItem>
              <SelectItem value="Grade">Grade Activities</SelectItem>
              <SelectItem value="Payment">Payment Activities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading activities...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-8">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="text-xs font-bold">
                        {new Date(activity.createdAt).getDate()}
                      </span>
                    </div>
                    <div className="w-px h-full bg-border"></div>
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-2">
                      <time className="text-sm text-muted-foreground">
                        {formatDate(activity.createdAt)} •{" "}
                        {new Date(activity.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                      {getActivityBadge(activity.tableName, activity.action)}
                    </div>
                    <h3 className="font-medium mt-1">
                      {getActionLabel(activity.action, activity.tableName)}
                    </h3>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No {filter === "all" ? "" : filter + " "}activities found
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
