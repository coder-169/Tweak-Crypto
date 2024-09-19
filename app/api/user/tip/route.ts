import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { receiver, sender, tip } = body;
    const tipReceiver = await db.user.findUnique({
      where: {
        username: receiver,
      },
    });
    const tipSender = await db.user.findUnique({
      where: {
        username: sender,
      },
    });
    if (!tipSender || !tipReceiver) {
      return NextResponse.json(
        {
          success: false,
          message: "Something is wrong! We couldn't found accounts",
        },
        {
          status: 200,
        }
      );
    }
    if (tipSender.credits < tip) {
      return NextResponse.json(
        {
          success: false,
          message: "Sorry you are out of credits",
        },
        {
          status: 200,
        }
      );
    }
    // const res = { error: false, message: "Withdrawn Successfully" };
    await db.user.update({
      where: {
        username: sender,
      },
      data: {
        credits: tipSender.credits - tip,
      },
    });
    await db.user.update({
      where: {
        username: receiver,
      },
      data: {
    credits: tipReceiver.credits + tip,
      },
    });
    return NextResponse.json(
      { success: true, message: "tip sent" },
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
