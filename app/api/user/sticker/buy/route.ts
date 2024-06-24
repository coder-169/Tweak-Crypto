import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const myuser = await currentUser();
    console.log(myuser);
    const body = await req.json();
    const { sticker } = body;
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
          { success: false, message: "Invalid id user does not exist" },
          { status: 400 }
        );

      if (sticker === 0) {
        if (user.credits < 40) {
          return NextResponse.json(
            { success: false, message: "Not enough credits" },
            { status: 400 }
          );
        }
        await db.user.update({
          where: {
            username: myuser?.username,
          },
          data: {
            credits: user.credits - 40,
            coins: user.coins + 1,
          },
        });
      }
      if (sticker === 1) {
        if (user.credits < 100) {
          return NextResponse.json(
            { success: false, message: "Not enough credits" },
            { status: 400 }
          );
        }
        await db.user.update({
          where: {
            username: myuser?.username,
          },
          data: {
            credits: user.credits - 100,
            lions: user.lions + 1,
          },
        });
      }
    }
    return NextResponse.json(
      { success: true, message: "sticker purchased successfully",user: myuser?.username, },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 400,
      }
    );
  }
}
