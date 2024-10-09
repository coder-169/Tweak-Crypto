import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log('Current Vercel Region:', process.env.VERCEL_REGION);
  try {
    const myuser = await currentUser();

    if (myuser?.username === null) {
      return NextResponse.json({
        success: false,
        message: "Please login to buy ",
      });
    } else {
      const user = await db.user.findUnique({
        where: {
          username: myuser?.username,
        },
      });
      if (!user)
        return NextResponse.json(
          { success: false, message: "user not found" },
          {
            status: 200,
          }
        );
      return NextResponse.json(
        { success: true, user, message: "user found" },
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 400,
      }
    );
  }
}
