import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const myuser = await currentUser();
    const body = await req.json();
    const { credits, id } = body;
    console.log(myuser)
    if (myuser === null)
      return NextResponse.json({ success: false, message: "Please login" });
    const user = await db.user.findUnique({
      where: {
        externalUserId: myuser.id,
      },
    });
    if (user) {
      await db.user.update({
        where: {
          externalUserId: myuser.id,
        },
        data: {
          credits: user.credits + credits,
        },
      });
      return NextResponse.json(
        { success: true, message: "Deposit Successful" },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "User not found" },
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
