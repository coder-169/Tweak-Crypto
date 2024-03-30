import { db } from "@/lib/db";
import ccxt from "ccxt";
import { NextResponse } from "next/server";
export async function GET(req: Request) {

  try {
    const body = await req.json()
    await db.user.update({
      where: {
        externalUserId: body?.id,
      },
      data: {
        credits: body?.newCreds,
      },
    });
    return new Response('Credits Deposit Successfully', {
      status: 400,
    });
  } catch (error: any) {
    console.log(error);
    return new Response(error.name + error.message, {
      status: 400,
    });
  }
}
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const ex = new ccxt.kucoin({
    apiKey: process.env.KU_KEY,
    secret: process.env.KU_SECRET,
    password: process.env.KU_PARAPHRASE,
  });
  try {
    const body = req.json()
    const res = await ex.fetchDeposits("USDT");
    
    return NextResponse.json(
      { message: "Deposit Address created", success: true,  res },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return new Response(error.name + error.message, {
      status: 400,
    });
  }
}
