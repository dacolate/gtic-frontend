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
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ActivityHistoryProps {
  userId: string;
  title: string;
}

export function ActivityHistory({ userId, title }: ActivityHistoryProps) {
  const t = useTranslations("profile.activity.history");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(5); // Number of activities per page

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/activities/${userId}`);
        if (response.data.success) {
          setActivities(response.data.data.reverse());
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("An error occurred while fetching activities." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivities();
  }, [userId]);

  const filteredActivities =
    filter === "all"
      ? activities.filter((a) => a.tableName !== "User")
      : activities.filter((a) => a.tableName === filter);

  // Get current activities
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredActivities.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getActionLabel = (
    action: string,
    tableName: string,
    description: string | undefined
  ) => {
    if (tableName === "User") {
      return t(`actions.${action}`) + (description ? `: ${description}` : "");
    }
    return `${t(`actions.${action}`)} ${tableName}`;
  };

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
          return (
            <Badge className="bg-green-500">{t("actions.register")}</Badge>
          );
        case "update":
          return <Badge className="bg-blue-500">{t("actions.login")}</Badge>;
        case "delete":
          return <Badge className="bg-red-500">{t("actions.logout")}</Badge>;
      }
    }

    return <Badge className={color}>{tableName}</Badge>;
  };

  const format = useFormatter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format.dateTime(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function getActivityLinks(tableName: string, recordId: number | undefined) {
    if (!recordId) {
      return;
    }
    switch (tableName) {
      case "User":
        return `/user/${recordId}`;
      case "Student":
        return `/student/${recordId}`;
      case "Class":
        return `/class/${recordId}`;
      case "Course":
        return `/course/${recordId}`;
      case "Grade":
        return `/grade/${recordId}`;
      case "Payment":
        return `/payment/${recordId}`;
      default:
        return "#";
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filter.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.all")}</SelectItem>
              <SelectItem value="User">{t("filter.user")}</SelectItem>
              <SelectItem value="Student">{t("filter.student")}</SelectItem>
              <SelectItem value="Class">{t("filter.class")}</SelectItem>
              <SelectItem value="Course">{t("filter.course")}</SelectItem>
              <SelectItem value="Grade">{t("filter.grade")}</SelectItem>
              <SelectItem value="Payment">{t("filter.payment")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">{t("loading")}</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-8">
            {currentActivities.length > 0 ? (
              currentActivities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`${getActivityLinks(
                    activity.tableName,
                    activity.recordId
                  )}`}
                  className="flex items-center justify-between hover:bg-gray-100  transition-colors"
                >
                  <div className="flex">
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
                        {getActionLabel(
                          activity.action,
                          activity.tableName,
                          activity.description
                        )}
                      </h3>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={40} className="opacity-50" />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t("noActivities", {
                    filter:
                      filter === "all"
                        ? ""
                        : t(`filter.${filter.toLowerCase()}`),
                  })}
                </p>
              </div>
            )}

            {/* Pagination controls */}
            {filteredActivities.length > activitiesPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>
                <div className="text-sm text-muted-foreground">
                  {t("pagination.page", {
                    current: currentPage,
                    total: Math.ceil(
                      filteredActivities.length / activitiesPerPage
                    ),
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredActivities.length / activitiesPerPage)
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
