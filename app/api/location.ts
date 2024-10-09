import { VercelRequest, VercelResponse } from "@vercel/node";
import { NextResponse } from "next/server";

export default function GET(req: VercelRequest, res: VercelResponse) {
  NextResponse.json({ message: "Hello from Paris!" });
}
