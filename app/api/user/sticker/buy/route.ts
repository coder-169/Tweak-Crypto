import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const myuser = await currentUser();
    console.log(myuser);
    const body = await req.json();
    const { sticker, buyQty } = body;
    if (myuser?.username === null) {
      return NextResponse.json({
        success: false,
        message: "Please login to buy ",
      });
    } else {
      const user = await db.user.findUnique({
        where: {
          username: myuser?.username,
        },
      });

      if (!user)
        return NextResponse.json(
          { success: false, message: "Invalid id user does not exist" },
          { status: 400 }
        );

      if (sticker === 0) {
        if (user.credits < 10 * parseInt(buyQty)) {
          return NextResponse.json(
            { success: false, message: "Don't have enough credits" },
            { status: 400 }
          );
        }
        await db.user.update({
          where: {
            username: myuser?.username,
          },
          data: {
            credits: user.credits - 10 * parseInt(buyQty),
            coins: user.coins + parseInt(buyQty),
          },
        });
      }
      if (sticker === 1) {
        if (user.credits < 1000 * parseInt(buyQty)) {
          return NextResponse.json(
            { success: false, message: "Don't have enough credits" },
            { status: 400 }
          );
        }
        await db.user.update({
          where: {
            username: myuser?.username,
          },
          data: {
            credits: user.credits - 1000 * parseInt(buyQty),
            lions: user.lions + parseInt(buyQty),
          },
        });
      }
      if (sticker === 2) {
        if (user.credits < 10000 * parseInt(buyQty)) {
          return NextResponse.json(
            { success: false, message: "Don't have enough credits" },
            { status: 400 }
          );
        }
        await db.user.update({
          where: {
            username: myuser?.username,
          },
          data: {
            credits: user.credits - 10000 * parseInt(buyQty),
            penguins: user.penguins + parseInt(buyQty),
          },
        });
      }
    }
    return NextResponse.json(
      {
        success: true,
        message: "purchased successfully",
        user: myuser?.username,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 400,
      }
    );
  }
}
