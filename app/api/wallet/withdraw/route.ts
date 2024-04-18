import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const user = await db.user.update({
      where: {
        externalUserId: body?.id,
      },
      data: {
        credits: body?.newCreds,
      },
    });
    console.log(user)
    return NextResponse.json(
      { success: true, message: "Credits Withdrawn Successfully" },
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
