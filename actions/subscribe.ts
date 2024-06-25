"use server";

import { revalidatePath } from "next/cache";

import { subscribeUser, unSubscribeUser } from "@/lib/subscribe-service";

export const onSubscribe = async (id: string) => {
  try {
    const subscribedUser = await subscribeUser(id);

    revalidatePath("/");

    if (subscribedUser) {
      revalidatePath(`/${subscribedUser.subscribing.username}`);
    }

    return subscribedUser;
  } catch (error) {
    throw new Error("Interal Error");
  }
};

export const onUnSubscribe = async (id: string) => {
  try {
    const unsubscribedUser = await unSubscribeUser(id);

    revalidatePath("/");

    if (unsubscribedUser) {
      revalidatePath(`/${unsubscribedUser.subscribing.username}`);
    }

    return unsubscribedUser;
  } catch (error) {
    throw new Error("Internal Error");
  }
};
