"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BsFillSendFill } from "react-icons/bs";
import { ChatInfo } from "./chat-info";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SlOptions } from "react-icons/sl";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import Loader from "../ui/loader";
import { MyOwns } from "../myowns";
import { useChat } from "@livekit/components-react";
interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  setValue: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
}

export const ChatForm = async ({
  onSubmit,
  value,
  setValue,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
}: ChatFormProps) => {
  const [isDelayBlocked, setIsDelayBlocked] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [sending, setSending] = useState(false);
  const { send } = useChat();
  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled =
    isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const res = await fetch("/api/user", { method: "GET" });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleChatCommand = async (value: string) => {
    const command = value.trim().split(" ");
    const userId = location.pathname.slice(1);
    try {
      console.log("adding tip");
      const res = await fetch(`/api/user/tip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: userId,
          sender: command[2],
          tip: parseInt(command[1]),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Tip sent successfully");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isDelayed && !isDelayBlocked) {
      setIsDelayBlocked(true);
      setTimeout(() => {
        setIsDelayBlocked(false);
        onSubmit();
      }, 3000);
    } else {
      const command = value.trim().split(" ");
      if (command[0] === "/tip") {
        const isSent = await handleChatCommand(value);
        if (isSent) {
          onSubmit();
        }
      } else {
        onSubmit();
      }
    }
  };
  const [coinSending, setCoinSending] = useState(false);
  const [lionSending, setLionSending] = useState(false);
  const sendSticker = async (sticker: number) => {
    const receiver = location.pathname.slice(1);
    if (sticker === 0) setCoinSending(true);
    if (sticker === 1) setLionSending(true);
    try {
      const res = await fetch(`/api/user/sticker/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver,
          sticker,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowDropDown(false);
        if (sticker === 0) {
          if (!send) return;
          send("Bitcoin sent from " + data.user);
        }
        if (sticker === 1) {
          if (!send) return;
          send("Lion sent from " + data.user);
        }
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setCoinSending(false);
    setLionSending(false);
  };

  useEffect(() => {
    getUser();
    console.log('called everytime')
  }, []);
  if (isHidden) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-y-4 p-3"
    >
      <div className="w-full flex items-center gap-2">
        <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />
        <Input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={isDisabled}
          placeholder="Send a message"
          className={cn(
            "border-white/10 w-4/5 lg:w-3/5",
            (isFollowersOnly || isDelayed) && "rounded-t-none border-t-0"
          )}
        />
        <div className="flex w-1/5 lg:w-2/5 gap-2 relative">
          <Button type="submit" variant="primary" size="sm" className="w-1/2">
            <BsFillSendFill />
          </Button>
          <button
            type="button"
            role="button"
            onClick={() => setShowDropDown(!showDropDown)}
            className="w-1/2 text-center bg-purple-400 rounded-full px-2 p-1"
          >
            <SlOptions />
          </button>
          {showDropDown && (
            <div className="bg-[#252731] p-2 w-80 shadow-sm h-96 absolute bottom-12 right-2 rounded-lg">
              <Button
                type="button"
                onClick={() => setShowDropDown(false)}
                variant="primary"
                size="sm"
                className="w-max absolute right-2 top-2 bg-red-400 rounded-full"
              >
                <FaTimes />
              </Button>
              <h4 className="font-bold text-sm mb-2">Stickers</h4>
              <div className="flex gap-12">
                <div className="flex justify-center items-center flex-col gap-2">
                  <Image width={60} height={60} src="/btc.png" alt="" />
                  <button
                    onClick={() => sendSticker(0)}
                    disabled={coinSending}
                    className="bg-purple-400 disabled:opacity-70 text-xs px-2 py-1 rounded-sm font-medium"
                  >
                    {coinSending ? (
                      <span className="sm-loader"></span>
                    ) : (
                      "40 LIV"
                    )}
                  </button>
                </div>
                <div className="flex justify-center items-center flex-col gap-2 mt-1">
                  <Image width={55} height={55} src="/lion.png" alt="" />
                  <button
                    onClick={() => sendSticker(1)}
                    className="bg-purple-400 text-xs px-2 py-1 rounded-sm font-medium"
                  >
                    {lionSending ? (
                      <span className="sm-loader"></span>
                    ) : (
                      "100 LIV"
                    )}
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-sm mt-2">Commands</h4>
              <ul className="text-xs">
                <li>/tip amount your account username eg: /tip 100 johnboe</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="ml-auto"></div>
    </form>
  );
};

export const ChatFormSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 p-3">
      <Skeleton className="w-full h-10" />
      <div className="flex items-center gap-x-2 ml-auto">
        <Skeleton className="h-7 w-7" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  );
};
