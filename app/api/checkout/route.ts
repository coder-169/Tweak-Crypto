import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// ("shr_1P2J4XSEr7VMOboE5wkBaoaV");

export async function POST(req: any, res: any) {
  try {
    // Create Checkout Sessions from body params.
    const body = await req.json();
    const { credits, email, name } = body;
    const amount = credits / 100;
    const payment = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: "mrsaad2129@gmail.com",
      metadata: {
        name: "Saad",
        receipt_email: "mrsaad2129@gmail.com",
        company: "Live Payout",
      },
      description: "Live Payout Deposit Payment",
    });
    // 2. Extract the PaymentIntent ID from the subscription's latest invoice
    return NextResponse.json({
      success: true,
      client_secret: payment.client_secret,
      message: "Payment Processing",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message,
      },
      {
        status: err.statusCode || 500,
      }
    );
  }
}
