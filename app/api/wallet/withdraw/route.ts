import { db } from "@/lib/db";
import { sendMoney } from "@/lib/utils";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const params = {
      address: body.address,
      coin: "USDT",
      amount: parseInt(body.credits),
    };
    const res = await sendMoney(params);
    // const res = { error: false, message: "Withdrawn Successfully" };
    if (res.error) {
      return NextResponse.json({ success: false, message: res.message });
    } else {
      await db.user.update({
        where: {
          externalUserId: body?.id,
        },
        data: {
          credits: body?.newCreds,
        },
      });
      // console.log(user);
      return NextResponse.json(
        { success: true, message: "Credits Withdrawn Successfully" },
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
