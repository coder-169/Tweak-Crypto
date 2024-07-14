import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// ("shr_1P2J4XSEr7VMOboE5wkBaoaV");

export async function POST(req: any, res: any) {
  try {
    // Create Checkout Sessions from body params.
    const headerList = headers();
    const body = await req.json();
    const origin = headerList.get("origin");
    const { credits, userId } = body;
    const amount = credits / 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        userId,
        description: userId,
      },

      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: credits + "Liv",
              images: ["https://livepayout.org/LV.png"],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://livepayout.org?success=true`,
      cancel_url: `${origin}/`,
    });
    if (session) {
      return NextResponse.json({ session, success: true });
    } else {
      return NextResponse.json({
        success: false,
        message: "Error creating session",
      });
    }
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
