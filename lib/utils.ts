import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import stc from "string-to-color";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stringToColor = (str: string) => {
  return stc(str);
};
export const getServerTime = async () => {
  try {
    const resp = await fetch("https://testnet.binance.vision/api/v3/time", {
      method: "GET",
      headers: {
        "X-MBX-APIKEY": process.env.WALLET_API_KEY || "",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const dt = await resp.json();
    return dt.serverTime;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
};
