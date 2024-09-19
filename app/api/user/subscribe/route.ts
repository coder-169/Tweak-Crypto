import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currUser = await currentUser();
    if (currUser === null || currUser.username === null)
      return NextResponse.json({ success: false, message: "Please login" });
    const user = await db.user.findUnique({
      where: {
        username: currUser.username,
      },
    });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
    if (user.credits < 5000) {
      return NextResponse.json({
        success: false,
        message: "You don't have credits to subscribe",
      });
    }
    const body = await req.json();
    const { hostIdentity } = body;
    const subscribing = await db.user.findUnique({
      where: {
        id: hostIdentity,
      },
    });
    if (!subscribing)
      return NextResponse.json({ success: false, message: "User not found" });
    await db.user.update({
      where: {
        id: hostIdentity,
      },
      data: {
        credits: subscribing.credits + 5000,
      },
    });
    await db.user.update({
      where: {
        username: currUser.username,
      },
      data: {
        credits: user.credits - 5000,
      },
    });
    return NextResponse.json(
      { success: true },
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
