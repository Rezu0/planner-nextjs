/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/mongodb";
import Planner from "@/models/Planner";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { title, description, start, end, allDay, idUser } = await req.json();

    if (!title || !start || !end || !idUser) {
      return NextResponse.json(
        { status: false, message: "All Field required!" },
        { status: 400 },
      )
    }

    const newPlanner = await Planner.create({
      uuid: crypto.randomUUID(),
      title,
      description,
      start,
      end,
      allDay,
      idUser,
    });

    return NextResponse.json(
      { 
        message: "Event created successfully", 
        status: true,
        data: newPlanner
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan", error: error.message },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const idUser = searchParams.get("user");

    if (!idUser) {
      return NextResponse.json(
        { status: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const planners = await Planner.find({ idUser }).sort({ start: 1 });

    return NextResponse.json(
      { status: true, data: planners, message: "Planners fetched successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan", error: error.message },
      { status: 500 },
    )
  }
}