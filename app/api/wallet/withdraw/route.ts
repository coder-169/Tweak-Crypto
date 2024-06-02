import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerTime } from "@/lib/utils";

export const sendMoney = async (params:any) => {
  try {
    const serverTime = await getServerTime();
    var recvWindow = 2000; // Maximum recvWindow value
    params.timestamp = serverTime - recvWindow;
    let query = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");
    console.log(process.env.WALLET_API_KEY, process.env.WALLET_SECRET_KEY);
    const signature = crypto
      .createHmac("sha256", process.env.WALLET_SECRET_KEY || "")
      .update(query)
      .digest("hex");
    console.log(signature);
    query += `&signature=${signature}`;
    const url =
      "https://api.binance.com/sapi/v1/capital/withdraw/apply?" + query;
    console.log(url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": process.env.WALLET_API_KEY || "",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      return { data, error: false };
    } else {
      return { message: data.msg, error: true };
    }
  } catch (error: any) {
    console.log(error);
    return { error: true, message: error.message };
  }
};
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
