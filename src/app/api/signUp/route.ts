import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const existingUserWithUsername = await User.findOne({ username });
    if (existingUserWithUsername) {
      return NextResponse.json(
        { message: "Username already taken", success: false },
        { status: 409 }
      );
    }

    const existingUserWithEmail = await User.findOne({ email });
    if (existingUserWithEmail) {
      return NextResponse.json(
        { message: "Email already registered", success: false },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      favorites: {
        movies: [],
        series: [],
        books: [],
        songs: [],
      },
      searchHistory: [],
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
