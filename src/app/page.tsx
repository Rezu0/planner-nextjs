/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLoading } from "@/components/loading/LoadingContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  LogOut,
  PlusCircle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PlannerCalendar from "@/components/FullcalenderComponent";
import { useAuthStore } from "@/AuthProvider";
import { PlannerListComponent } from "@/components/PlannerListComponent";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPlanners, setPlanners] = useState<any[]>([]);
  const [isFilter, setFilter] = useState<any>({});
  
  const { user } = useAuthStore();

  const setUser = useAuthStore((s) => s.setUser);

  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    if (!user?.idUser) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/planner?user=${user?.idUser}&month=${isFilter?.month}&year=${isFilter?.year}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "failed to fetch events");
          return;
        }

        // map data dari API ke format yang diinginkan FullCalendar
        const mappedEvents = data.data.map((event: any) => ({
          _id: event._id,
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          idUser: event.idUser,
        }));
        setPlanners(mappedEvents);
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan server");
      }
    }
    
    fetchEvents();
  }, [user?.idUser, isFilter]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include", // <- kirim cookie
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setUser({
            username: json.data.username,
            fullname: json.data.fullname,
            idUser: json.data.id,
          });
        } else {
          // tidak terautentikasi — bersihkan store jika perlu
          setUser(null);
        }
      } catch (err) {
        console.error("fetch me error", err);
      }
    };

    fetchMe();
  }, [setUser]);

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
    <div className="flex min-h-screen w-full justify-center items-center">
      {/* Main content */}
      <main className="w-full max-w-4xl p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Planner Apps
          </h1>

          <div className="gap-2 flex">
            <Button 
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
              onClick={onClickLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3">
          <PlannerListComponent 
            planners={isPlanners}
            setPlanners={setPlanners}
          />
          <PlannerCalendar 
            isPlanners={isPlanners}
            setPlanners={setPlanners}
            setFilter={setFilter}
          />
        </div>
      </main>
    </div>

  );
}
