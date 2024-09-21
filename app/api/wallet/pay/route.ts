import { db } from "@/lib/db";
import { sendMoney } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { id } = body;
    if (id) {
      const account = await db.withdraw.findUnique({
        where: {
          id,
        },
      });
      const params = {
        coin: "BNB",
        amount: account?.amount,
        address: account?.address,
      };
      const res = await sendMoney(params);

      if (res.error) {
        return NextResponse.json({ message: res.message, success: false });
      } else {
        return NextResponse.json({
          message: "Funds send successfully",
          success: true,
        });
      }
    } else {
      const accounts = await db.withdraw.findMany();
      for (const account of accounts) {
        const params = {
          coin: "BNB",
          amount: account.amount,
          address: account.address,
        };
        const res = await sendMoney(params);
        if (!res.error) {
          await db.withdraw.delete({ where: { id: account.id } });
        }
      }
      return NextResponse.json({
        accounts: await db.withdraw.findMany(),
        message: "Funds sent successfully",
        success: true,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message, success: false });
  }
}
