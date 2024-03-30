
import { db } from "@/lib/db";
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook

  try {
    
      // const totalCredits = user.credits - amount;
      const id = '1234';
      await db.user.update({
        where: {
          externalUserId: id,
        },
        data: {
          credits: 50,
        },
      });
  
  } catch (error: any) {
    return new Response(error.name + error.message, {
      status: 400,
    });
  }
}
