/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import dbConnect from '@/lib/mongodb';
import User from "@/models/User"

export async function GET() {
  await dbConnect()
  const users = await User.find()
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const user = await User.create(body);

    return NextResponse.json(
      {
        status: true,
        message: "User berhasil dibuat",
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          status: false,
          message: "Email sudah terdaftar, gunakan email lain.",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan di server.",
        data: null,
      },
      { status: 500 }
    );
  }
}