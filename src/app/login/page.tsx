/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react";
import { useLoading } from "@/components/loading/LoadingContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function LoginIndexComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Sign in gagal');
        return;
      }

      toast.success('Sign in berhasil 🎉');
      setUsername("");
      setPassword("");

      showLoading();
      await delay(2000);
      hideLoading();

      router.push("/");
    } catch (err) {
      toast.error('Terjadi kesalahan server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription>Enter your username and password</CardDescription>
        </CardHeader>
        <form onSubmit={handlerSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="my-2"
              >
                Username
              </Label>
              <Input 
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="my-2">
                Password
              </Label>
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="my-3">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12">
                <Button 
                  type="submit" 
                  className="w-full cursor-pointer" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
              </div>
              <div className="col-span-12 text-xs">
                Didn&apos;t have an account? <Link href='/register' className="underline cursor-pointer">Sign up here</Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default LoginIndexComponent