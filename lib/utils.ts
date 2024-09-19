import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import stc from "string-to-color";
import { NextResponse } from "next/server";
import crypto from "crypto";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stringToColor = (str: string) => {
  return stc(str);
};
export const sendMoney = async (params: any) => {
  try {
    const resp = await fetch("https://testnet.binance.vision/api/v3/time", {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": process.env.WALLET_API_KEY || "",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const dt = await resp.json();
    const serverTime = dt.serverTime;

    var recvWindow = 2000; // Maximum recvWindow value
    params.timestamp = serverTime - recvWindow;
    let query = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");
    const signature = crypto
      .createHmac("sha256", process.env.WALLET_SECRET_KEY || "")
      .update(query)
      .digest("hex");
    query += `&signature=${signature}`;
    const url =
      "https://api.binance.com/sapi/v1/capital/withdraw/apply?" + query;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": process.env.WALLET_API_KEY || "",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return { data, error: false };
    } else {
      return { message: data.msg, error: true };
    }
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};