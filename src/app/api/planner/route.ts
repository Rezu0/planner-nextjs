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

    await Planner.create({
      uuid: crypto.randomUUID(),
      title,
      description,
      start,
      end,
      allDay,
      idUser,
    });

    return NextResponse.json(
      { message: "Event created successfully", status: true },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan", error: error.message },
      { status: 500 },
    )
  }
}