import { db } from "@/lib/db";
import ccxt from "ccxt";
import { NextResponse } from "next/server";
const crypto = require("crypto");
const axios = require("axios");

// This is a very simple script working on Binance Pay API
// Set your apiKey and apiSecret, then you are ready to go.

const apiKey =
  "sfnie79bt890xgxsjabzafrdsnnkrgwsxpoifhjbk1xva2qhcbiwpjlvrh6yygrk"; // set your API key here
const apiSecret =
  "pmqkmslisevnj7t9g6kslmokuwxkqazbtcumcd9qrzbyoup9nmpa9vlj0wilhkkk"; // set your secret key here
const baseURL = "https://bpay.binanceapi.com";

// ===== functions ======

function hash_signature(query_string: string) {
  return crypto
    .createHmac("sha512", apiSecret)
    .update(query_string)
    .digest("hex");
}

function random_string() {
  return crypto.randomBytes(32).toString("hex").substring(0, 32);
}

async function dispatch_request(http_method: string, path: string) {}

// Create Order
//
// POST /binancepay/openapi/order
// https://developers.binance.com/docs/binance-pay/api-order-create

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { credits } = body;
    const price_amount = parseInt(credits);
    console.log( price_amount/100);
    var data = JSON.stringify({
      price_amount: price_amount / 100,
      price_currency: "usdt",
      pay_currency: "usdttrc20",
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
    console.log(d);
    if (resp.ok) {
      return NextResponse.json(
        { success: true, payout: d, message: "Payment Created Successfully" },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { success: false, message: d.message },
        {
          status: 400,
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