/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullname, username, password } = await req.json(); 

    if (!username || !password || !fullname) {
      return NextResponse.json(
        { message: "Semua Field wajib diisi!" },
        { status: 400 }
      );
    }

    // cek apakah user sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(existingUser);
      return NextResponse.json(
        { message: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate JWT
    const token = jwt.sign(
      { username, fullname },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d", algorithm: 'HS256' }
    );

    // simpan user baru
    await User.create({
      fullname,
      username,
      password: hashedPassword,
      token
    });

    return NextResponse.json(
      { message: "Registration Success!" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
