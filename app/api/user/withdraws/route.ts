import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const accounts = await db.withdraw.findMany();
    return NextResponse.json({
      accounts,
      success: true,
      message: "Accounts found ",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message, success: false });
  }
}
