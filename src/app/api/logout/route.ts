import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    status: true,
    message: "Logout berhasil",
  });
  res.cookies.set("planner", "", { maxAge: 0 });
  return res;
}