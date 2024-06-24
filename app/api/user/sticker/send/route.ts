import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const myuser = await currentUser();
    const body = await req.json();
    const { receiver, sticker } = body;

    if (myuser?.username === null) {
      return NextResponse.json({
        success: false,
        message: "Please login to buy ",
      });
    } else {
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
      if (sticker === 0 && stickerSender?.lions < 40) {
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
      if (sticker === 1 && stickerSender.credits < 100) {
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
            credits: stickerSender?.credits - 40,
          },
        });
        await db.user.update({
          where: {
            username: receiver,
          },
          data: {
            credits: stickerReceiver?.credits + 40,
          },
        });
      }
      if (sticker === 1) {
        await db.user.update({
          where: {
            username: stickerSender?.username,
          },
          data: {
            credits: stickerSender?.credits - 100,
          },
        });
        await db.user.update({
          where: {
            username: receiver,
          },
          data: {
            credits: stickerReceiver?.credits + 100,
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
