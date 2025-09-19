/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { status: false,
          message: 'Username dan Password wajib diisi!',
          data: null,
         },
         { status: 400}
      );
    }

    // cari user
    const user = await User.findOne({ username });
     if (!user) {
      return NextResponse.json(
        { 
          status: false, 
          message: "User tidak ditemukan", 
          data: null 
        },
        { status: 404 }
      );
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: false, message: "Password salah", data: null },
        { status: 401 }
      );
    }

    // generate token JWT baru
    const fullnameFromDB = user.fullname;
    const token = jwt.sign(
      { username, fullname: fullnameFromDB, id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d", algorithm: 'HS256' }
    );

    user.token = token;
    await user.save();

    const res = NextResponse.json(
      {
        status: true,
        message: "Login berhasil",
        data: {
          fullname: user.fullname,
          username: user.username,
          token,
        },
      },
      { status: 200 }
    );

    res.cookies.set("planner", token, {
      httpOnly: true,
      secure: process.env.APP_CONDITION === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 hari
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}