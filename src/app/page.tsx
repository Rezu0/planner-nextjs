/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLoading } from "@/components/loading/LoadingContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PlannerCalendar from "@/components/FullcalenderComponent";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const onClickLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const logout = await res.json();
      if (!res.ok) {
        toast.error(logout.message || "Logout gagal");
        return;
      }

      toast.success(logout.message || "Logout berhasil 🎉");

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
    <div className="flex min-h-screen bg-gray-100">

      {/* Main content */}
      <main className="flex-1 p-8 md:ml-10 mt-10 md:mt-0">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Planner
          </h1>
          <Button className="bg-gray-800 hover:bg-gray-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Planner
          </Button>
        </header>

        <PlannerCalendar />
      </main>
    </div>
  );
}
