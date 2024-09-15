import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    if (password === process.env.PAY_PASS) {
      return NextResponse.json({
        success: true,
        message: "Password is correct",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
