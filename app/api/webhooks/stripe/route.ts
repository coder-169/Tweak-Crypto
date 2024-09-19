import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
export async function POST(request:any, response:any) {
  const body = await request.json();
  const headerList = headers();
  const sig = headerList.get("stripe-signature") || '';
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err:any) {
    return NextResponse.json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      const user = await db.user.findUnique({
        where: {
          externalUserId: paymentIntentSucceeded.metadata.userId,
        },
      });
      if (user) {
        await db.user.update({
          where: {
            externalUserId: body?.id,
          },
          data: {
            credits: user.credits + paymentIntentSucceeded.amount,
          },
        });
      }
      return NextResponse.json({
        success: true,
        data: event.data,
        message: "credits deposited successfully",
      });
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      return NextResponse.json({
        success: true,
        message: `Unhandled event type ${event.type}`,
      });
  }

  return NextResponse.json({ success: true, message: "credits added" });
}
