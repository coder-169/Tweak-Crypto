import { db } from "@/lib/db";
import ccxt from "ccxt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    await db.user.update({
      where: {
        externalUserId: body?.id,
      },
      data: {
        credits: body?.newCreds,
      },
    });
    return NextResponse.json(
      { success: true, message: "Credits Deposit Successfully" },
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
