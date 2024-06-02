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
    const resp = await fetch(
      `https://api.nowpayments.io/v1/payment/${body.id}`,
      {
        method: "GET",
        headers: new Headers({
          "x-api-key": process.env.NOWAPIKEY || "",
        }),
      }
    );
    const d = await resp.json();
    const newCredits = d.pay_amount + body.credits
    if (d.status === "finished") {
      await db.user.update({
        where: {
          externalUserId: body?.userId,
        },
        data: {
          credits: newCredits,
        },
      });
    }
    console.log(d);
    return NextResponse.json({
      success: true,
      message: "status found",
      details: d,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 400,
      }
    );
  }
}
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { success, newCreds } = body;
//     if (!success) {
//       const payload = {
//         merchantId: "480498369",
//         merchantTradeNo: random_string(),
//         tradeType: "WEB",
//         totalFee: "0.005",
//         currency: "USDT",
//         productType: "crypto",
//         productName: "Credit Deposit",
//         productDetail: "deposit crypto payment",
//       };
//       const timestamp = Date.now();
//       const nonce = random_string();
//       const payload_to_sign =
//         timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n";
//       const url = baseURL + "/binancepay/openapi/order";
//       const signature = hash_signature(payload_to_sign);
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//           "BinancePay-Timestamp": timestamp.toString(),
//           "BinancePay-Nonce": nonce,
//           "BinancePay-Certificate-SN": apiKey,
//           "BinancePay-Signature": signature.toUpperCase(),
//         },
//         body: JSON.stringify(payload),
//       });
//       const dt = await response.json();
//       console.log(dt);
//       if (response.ok) {
//         return NextResponse.json(
//           { success: true, checkoutUrl: dt.data.checkoutUrl },
//           {
//             status: 200,
//           }
//         );
//       } else {
//         return NextResponse.json(
//           { success: false, message: dt.message },
//           {
//             status: 400,
//           }
//         );
//       }
//     } else {
//       await db.user.update({
//         where: {
//           externalUserId: body?.id,
//         },
//         data: {
//           credits: newCreds,
//         },
//       });
//       return NextResponse.json(
//         { success: true, message: "Credits Deposit Successfully" },
//         {
//           status: 200,
//         }
//       );
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       {
//         status: 400,
//       }
//     );
//   }
// }
