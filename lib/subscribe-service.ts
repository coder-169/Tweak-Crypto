import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";


export const isSubscribingUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return true;
    }

    const existingSubscriber = await db.subscriber.findFirst({
      where: {
        subscriberId: self.id,
        subscribingId: otherUser.id,
      },
    });

    return !!existingSubscriber;
  } catch {
    return false;
  }
};


export const subscribeUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      console.error("User not found with id:", id);
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      console.error("Attempted to subscribe to self:", self.id);
      throw new Error("Cannot subscribe to yourself");
    }

    const existingSubscriber = await db.subscriber.findFirst({
      where: {
        subscriberId: self.id,
        subscribingId: otherUser.id,
      },
    });

    if (existingSubscriber) {
      console.error("Already subscribed:", existingSubscriber);
      throw new Error("Already Subscribed");
    }

    const subscribe = await db.subscriber.create({
      data: {
        subscriberId: self.id,
        subscribingId: otherUser.id,
      },
      include: {
        subscriber: true,
        subscribing: true,
      },
    });

    return subscribe;
  } catch (error) {
    console.error("Error in subscribeUser:", error);
    throw new Error("Internal Error");
  }
};
export const unSubscribeUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot Unsubscribe yourself");
  }

  const existingSubscriber = await db.subscriber.findFirst({
    where: {
      subscriberId: self.id,
      subscribingId: otherUser.id,
    },
  });

  if (!existingSubscriber) {
    throw new Error("Not following");
  }

  const follow = await db.subscriber.delete({
    where: {
      id: existingSubscriber.id,
    },
    include: {
      subscribing: true,
    },
  });

  return follow;
};
