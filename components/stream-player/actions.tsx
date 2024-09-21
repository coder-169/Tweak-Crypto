"use client";

import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { onFollow, onUnfollow } from "@/actions/follow";
import { onSubscribe, onUnSubscribe } from "@/actions/subscribe";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  CurrencyDollarIcon,
  ClipboardIcon,
  CheckIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
import { FaHeart, FaRegStar, FaTrophy, FaStar } from "react-icons/fa";

interface ActionsProps {
  hostIdentity: string;
  isFollowing: boolean;
  isSubscribing: boolean;
  isHost: boolean;
  imageUrl: string;
  name: string;
}

export const Actions = ({
  hostIdentity,
  isFollowing,
  isHost,
  isSubscribing,
  name,
  imageUrl,
}: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const handleFollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(hostIdentity)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };
  const handleSubscribe = () => {
    startTransition(() => {
      onSubscribe(hostIdentity)
        .then((data) => {
          toast.success(`You have Subscribed ${data.subscribing.username}`);
        })
        .catch((err) => {
          console.error("Error in handleSubscribe:", err);
          toast.error("Something went wrong");
        });
    });
  };
  const handleUnSubscribe = () => {
    startTransition(() => {
      onUnSubscribe(hostIdentity)
        .then((data) =>
          toast.success(`You have Un Subscribed ${data.subscribing.username}`)
        )
        .catch((err) => {
          toast.error("Something went wrong");
        });
    });
  };

  const toggleFollow = () => {
    if (!userId) {
      return router.push("/sign-in");
    }

    if (isHost) return;

    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };
  const transferSubscribeFee = async () => {
    try {
      const res = await fetch("/api/user/subscribe", {
        method: "POST",
        body: JSON.stringify({ hostIdentity }),
      });

      const data = await res.json();
      if (data.success) {
        handleSubscribe();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const toggleSubscribe = () => {
    if (!userId) {
      return router.push("/sign-in");
    }

    if (isHost) return;

    if (isSubscribing) {
      handleUnSubscribe();
    } else {
      transferSubscribeFee();
    }
    setOpen(false);
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        disabled={isPending || isHost}
        onClick={toggleFollow}
        variant="primary"
        size="sm"
        className={`w-full rounded-sm lg:w-auto ${
          isFollowing
            ? "text-white bg-white/10"
            : "bg-[#C181FF] hover:bg-[#C181FF]"
        } `}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-2",
            isFollowing ? "fill-white" : "fill-none"
          )}
        />
        {isFollowing ? "Un follow" : "Follow"}
      </Button>
      <Button
        disabled={isPending || isHost}
        onClick={() => setOpen(true)}
        variant="primary"
        size="sm"
        className={`w-full rounded-sm lg:w-auto ${
          isSubscribing
            ? "text-white bg-white/10"
            : "bg-[#C181FF] hover:bg-[#C181FF]"
        } `}
      >
        {!isSubscribing ? (
          <FaRegStar className={cn("h-4 w-4 mr-2", "fill-white")} />
        ) : (
          <FaStar className={cn("h-4 w-4 mr-2", "fill-white")} />
        )}
        {isSubscribing ? "Un Subscribe" : "Subscribe"}
      </Button>
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={setOpen}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-6">
                  <div className="flex gap-4 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      className="w-20 h-20 rounded-md"
                      alt=""
                    />
                    <div>
                      <h3 className="text-lg font">{name}</h3>
                      <button
                        type="button"
                        className={`inline-flex w-full justify-center rounded-md px-2 py-2 text-xs font-semibold text-white shadow-sm ${
                          isSubscribing
                            ? "text-white bg-white/10"
                            : "bg-[#C181FF] hover:bg-[#C181FF]"
                        } mt-2 sm:w-auto`}
                        onClick={toggleSubscribe}
                      >
                        {!isSubscribing ? (
                          <FaRegStar
                            className={cn("h-4 w-4 mr-2", "fill-white")}
                          />
                        ) : (
                          <FaStar
                            className={cn("h-4 w-4 mr-2", "fill-white")}
                          />
                        )}
                        {isSubscribing ? "Un Subscribe" : "Subscribe | 5000Liv"}
                      </button>
                    </div>
                  </div>
                  <div className="py-4 border-t-2 mt-4 border-gray-600"></div>
                  <h3 className="text-xl mb-2">Benefit</h3>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <p className="flex gap-1 items-center py-2">
                        <FaTrophy className="text-yellow-500 text-xl" />
                        <span className="text-sm">
                          {" "}
                          Unlock Subscribers Badge
                        </span>
                      </p>
                      <p className="flex gap-1 mt-1 text-xs items-center">
                        Instantly unlock your subscriber badge and increase your
                        achievements in the scoring system
                      </p>
                    </div>
                    <div className="w-1/2">
                      <p className="flex gap-1 items-center py-2">
                        <FaHeart className="text-red-400 text-xl" />
                        <span className="text-sm">
                          {" "}
                          Unlock Subscribers Badge
                        </span>
                      </p>
                      <p className="flex gap-1 mt-1 text-xs items-center">
                        Stand out from all the members who watch your favorite
                        streamer.
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs">
                    Manage your subscription{" "}
                    <span className="text-purple-300">Coming Soon</span>
                  </p>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export const ActionsSkeleton = () => {
  return <Skeleton className="h-10 w-full lg:w-24" />;
};
