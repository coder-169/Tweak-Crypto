import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const myuser = await currentUser();
    const body = await req.json();
    const { receiver, sticker, sendQty } = body;
    if (myuser?.username === null) {
      return NextResponse.json({
        success: false,
        message: "Please login to buy ",
      });
    } else {
      if (myuser?.username === receiver)
        return NextResponse.json({
          success: false,
          message: "You Can not send to your self",
        });
      const stickerSender = await db.user.findUnique({
        where: {
          username: myuser?.username,
        },
      });
      const stickerReceiver = await db.user.findUnique({
        where: {
          username: receiver,
        },
      });
      if (!stickerReceiver) {
        return NextResponse.json(
          {
            success: false,
            message: "Something is wrong! We couldn't found accounts",
          },
          {
            status: 200,
          }
        );
      }
      if (!stickerSender) {
        return NextResponse.json(
          {
            success: false,
            message: "Something is wrong! We couldn't found accounts",
          },
          {
            status: 200,
          }
        );
      }
      if (sticker === 0 && stickerSender?.coins < sendQty) {
        return NextResponse.json(
          {
            success: false,
            message: "Sorry you don't have enough Credoits",
          },
          {
            status: 200,
          }
        );
      }
      if (sticker === 1 && stickerSender.lions < sendQty) {
        return NextResponse.json(
          {
            success: false,
            message: "Sorry you don't have enough Credits",
          },
          {
            status: 200,
          }
        );
      }
      if (sticker === 2 && stickerSender.penguins < sendQty) {
        return NextResponse.json(
          {
            success: false,
            message: "Sorry you don't have enough Credits",
          },
          {
            status: 200,
          }
        );
      }
      if (sticker === 0) {
        await db.user.update({
          where: {
            username: stickerSender?.username,
          },
          data: {
            coins: stickerSender?.coins - sendQty,
          },
        });
        await db.user.update({
          where: {
            username: receiver,
          },
          data: {
            credits: stickerReceiver?.credits + sendQty * 10,
          },
        });
      }
      if (sticker === 1) {
        await db.user.update({
          where: {
            username: stickerSender?.username,
          },
          data: {
            lions: stickerSender?.lions - sendQty,
          },
        });
        await db.user.update({
          where: {
            username: receiver,
          },
          data: {
            credits: stickerReceiver?.credits + 1000 * sendQty,
          },
        });
      }
      if (sticker === 2) {
        await db.user.update({
          where: {
            username: stickerSender?.username,
          },
          data: {
            lions: stickerSender?.lions - sendQty,
          },
        });
        await db.user.update({
          where: {
            username: receiver,
          },
          data: {
            credits: stickerReceiver?.credits + 10000 * sendQty,
          },
        });
      }
    }
    const user = await db.user.findUnique({
      where: {
        username: myuser?.username,
      },
    });
    return NextResponse.json(
      { success: true, message: "Sticker sent", user: user?.username },
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
