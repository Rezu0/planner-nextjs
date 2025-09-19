/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    // parse cookie sederhana
    const cookies = Object.fromEntries(cookieHeader.split("; ").filter(Boolean).map(c => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    }));
    const token = cookies["planner"];

    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.id).select("_id username fullname");
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: user._id, username: user.username, fullname: user.fullname 
      } 
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}
