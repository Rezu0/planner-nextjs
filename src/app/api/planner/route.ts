/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/mongodb";
import Planner from "@/models/Planner";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

interface PlannerData {
  _id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  idUser: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { idPlanner } = await req.json();

    if (!idPlanner) {
      return NextResponse.json(
        { status: false, message: "ID Event Required" },
        { status: 400 },
      );
    }

    const deletePlanner = await Planner.deleteOne({ _id: idPlanner });

    if (deletePlanner.deletedCount === 0) {
      return NextResponse.json(
        { status: false, message: 'Delete Event failed' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { status: true, message: 'Delete Event Successfully 🎉', data: idPlanner },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan", error: error.message },
      { status: 500 },
    )
  }
}

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
    const userIdString = searchParams.get("user");

    if (!userIdString) {
      return NextResponse.json(
        { status: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    // Konversi string ke ObjectId
    let idUser;
    try {
      idUser = new mongoose.Types.ObjectId(userIdString);
    } catch (error) {
      return NextResponse.json(
        { status: false, message: "Invalid User ID format" },
        { status: 400 },
      );
    }

    // Setup tanggal untuk kategori
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Ambil semua planner user dan kategorikan
    const allPlanners = await Planner.find({ idUser }).sort({ start: 1 }).lean() as PlannerData[];

    const categorizedPlanners: {
      today: PlannerData[];
      upcoming: PlannerData[];
      past: PlannerData[];
    } = {
      today: [],
      upcoming: [],
      past: []
    };

    allPlanners.forEach(planner => {
      const plannerDate = new Date(planner.start);
      plannerDate.setHours(0, 0, 0, 0);

      if (plannerDate.getTime() === today.getTime()) {
        categorizedPlanners.today.push(planner);
      } else if (plannerDate.getTime() >= tomorrow.getTime()) {
        categorizedPlanners.upcoming.push(planner);
      } else {
        categorizedPlanners.past.push(planner);
      }
    });

    // Sort upcoming by date ascending (terdekat dulu)
    categorizedPlanners.upcoming.sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
    
    // Sort past by date descending (yang baru lewat dulu)
    categorizedPlanners.past.sort((a, b) => {
      return new Date(b.start).getTime() - new Date(a.start).getTime();
    });

    // Sort today by time
    categorizedPlanners.today.sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

    // Gabungkan sesuai urutan: hari ini -> besok/mendatang -> yang lewat
    const sortedPlanners = [
      ...categorizedPlanners.today,
      ...categorizedPlanners.upcoming, 
      ...categorizedPlanners.past
    ];

    console.log(`Found planners - Today: ${categorizedPlanners.today.length}, Upcoming: ${categorizedPlanners.upcoming.length}, Past: ${categorizedPlanners.past.length}`);

    return NextResponse.json(
      { 
        status: true, 
        data: sortedPlanners,
        categories: {
          today: categorizedPlanners.today,
          upcoming: categorizedPlanners.upcoming,
          past: categorizedPlanners.past
        },
        summary: {
          todayCount: categorizedPlanners.today.length,
          upcomingCount: categorizedPlanners.upcoming.length,
          pastCount: categorizedPlanners.past.length,
          total: allPlanners.length
        },
        message: "Planners fetched and categorized successfully" 
      },
      { status: 200 },
    );

  } catch (error: any) {
    console.error("Error fetching planners:", error);
    return NextResponse.json(
      { 
        status: false, 
        message: "Terjadi kesalahan", 
        error: error.message 
      },
      { status: 500 },
    );
  }
}