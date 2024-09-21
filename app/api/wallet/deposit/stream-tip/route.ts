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
    const { id } = body;
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      await db.user.update({
        where: { id },
        data: {
          credits: user.credits + 10,
        },
      });
      return NextResponse.json(
        { success: true },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { success: false },
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
