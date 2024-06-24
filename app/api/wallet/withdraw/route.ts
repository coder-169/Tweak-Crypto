import { db } from "@/lib/db";
import { sendMoney } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (parseInt(body.credits) < 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum Withdrawal is 500 Credits equivalent to 5$",
        },
        { status: 400 }
      );
    }
    const params = {
      address: body.address,
      coin: "USDT",
      amount: parseInt(body.credits) / 100,
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
