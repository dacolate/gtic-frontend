"use client";

import { useState } from "react";
import Image from "next/image";
import type React from "react"; // Added import for React
// import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
// import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "@/i18n/routing";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { success, message } = await login(email, password);
      if (success) {
        console.log("Login successful");
        router.push("/");
      } else {
        console.log("Login failed");
        setError(message || null);
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 401
      ) {
        setError("Invalid email or password.");
      } else {
        console.log(err);

        isRedirectError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //   if (token) {
  //     redirect("/");
  //   }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Image src="/gtic.png" alt="gtic" width={150} height={150} />
          </div>
          <CardDescription className="text-center">
            Entrez vos accès pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-600 my-3 text-center">{error}</p>}
            <LoadingButton
              className="w-full mt-3 bg-green-600"
              type="submit"
              loading={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </LoadingButton>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a href="#" className="text-sm text-green-500/80 hover:underline">
            Forgot your password?
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
