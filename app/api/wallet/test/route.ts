import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    var data = JSON.stringify({
      price_amount:  10,
      price_currency: "usdt",
      pay_currency: "trx",
      // pay_address:"TSyfA18d3sRctDb1vCj1fbpdp6r1B9CY6P",
      ipn_callback_url: "https://nowpayments.io",
      order_id: "RGDBP-21314",
      order_description: "Apple Macbook Pro 2019 x 1",
    });

    const resp = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: new Headers({
        "x-api-key": process.env.NOWAPIKEY || "",
        "Content-Type": "application/json",
      }),
      body: data,
    });
    const d = await resp.json();
    return NextResponse.json({ d });
  } catch (err) {
    return NextResponse.json({ err });
  }
}
