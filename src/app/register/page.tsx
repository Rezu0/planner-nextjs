/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useLoading } from "@/components/loading/LoadingContext";
import { useRouter } from "next/navigation";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function RegisterPage() {
  const [isFullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname: isFullname ,username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Sign up gagal");
        return;
      }

      // sukses
      toast.success("Registrasi berhasil 🎉");
      setFullname("");
      setUsername("");
      setPassword("");

      // tampilkan loading global sebentar lalu redirect
      showLoading();
      await delay(1000);
      hideLoading();

      router.push("/login");
    } catch (err) {
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Filled the field below here!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label
                className="my-2"
                htmlFor="fullname"
              >
                Fullname
              </Label>
              <Input 
                id="fullname"
                placeholder="Enter your fullname"
                value={isFullname}
                onChange={(e) => setFullname(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="username" className="my-2">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="my-2">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="my-3">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12">
                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign up
                </Button>

              </div>
              <div className="col-span-12 text-xs">
                Already have account? <Link href="/login" className="underline cursor-pointer">Sign in here</Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
