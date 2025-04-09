"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { UserInfo } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { UpdateUserDialog } from "./UpdateUserDialog";

export function AdminUserManagement() {
  const t = useTranslations("profile.admin.userManagement");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(loading);
        setLoading(true);
        const response = await api.get("/users");
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(t("errors.fetchFailed"));
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t, loading]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter((user) => user.id.toString() !== userId));
      }
    } catch (err) {
      setError(t("errors.deleteFailed"));
      console.error("Error deleting user:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
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

          {error && <div className="text-red-500">{error}</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.role")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <UpdateUserDialog
                      userId={user.id.toString()}
                      defaultValues={{ name: user.name, email: user.email }}
                    >
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </UpdateUserDialog>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(user.id.toString())}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {t("pagination.page", {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
