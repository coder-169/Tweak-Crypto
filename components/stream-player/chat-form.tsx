"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTimes } from "react-icons/fa";
import { ChatInfo } from "./chat-info";
import Image from "next/image";
import { useChat } from "@livekit/components-react";
import { toast } from "sonner";
import { BsFillSendFill } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { set } from "date-fns";

interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
}
const stickers = [10, 1000, 10000];
export const ChatForm = ({
  onSubmit,
  value,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
}: ChatFormProps) => {
  const [isDelayBlocked, setIsDelayBlocked] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const { send } = useChat();

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled =
    isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;

  interface User {
    coins: number;
    lions: number;
    penguins: number;
    imageUrl: string;
    // Add other properties if needed
  }

  const [user, setUser] = useState<User>({
    coins: 0,
    lions: 0,
    penguins: 0,
    imageUrl: "",
  });
  const getUser = async () => {
    // if (isHidden) return;
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
        if (!send) return;
        send(`${user.imageUrl}img-livepayout-img${value}`);

        onChange("");
      }, 3000);
    } else {
      const command = value.trim().split(" ");
      if (command[0] === "/tip") {
        const isSent = await handleChatCommand(value);
        if (isSent) {
          if (!send) return;
          send(`${user.imageUrl}img-livepayout-img${value}`);

          onChange("");
        }
      } else {
        if (
          (value.toLowerCase().includes("sent ") &&
            value.toLowerCase().includes("lion")) ||
          (value.toLowerCase().includes("sent ") &&
            value.toLowerCase().includes("coin")) ||
          (value.toLowerCase().includes("sent ") &&
            value.toLowerCase().includes("penguin"))
        ) {
          return;
        } else {
          if (!send) return;
          send(`${user.imageUrl}img-livepayout-img${value}`);

          onChange("");
        }
      }
    }
  };
  const [sticker, setSticker] = useState(-1);
  const [buySticker, setBuySticker] = useState(-1);
  const [message, setMessage] = useState("");
  const [coinSending, setCoinSending] = useState(false);
  const [coinBuying, setCoinBuying] = useState(false);
  const [lionBuying, setLionBuying] = useState(false);
  const [buyQty, setBuyQty] = useState(0);
  const [sendQty, setSendQty] = useState(0);
  const sendHandler = (e: any) => {
    if (sticker === 0 && e.target.value > user?.coins)
      return toast.error("You don't have enough lions");
    if (sticker === 1 && e.target.value > user?.lions)
      return toast.error("You don't have enough coins");
    if (sticker === 2 && e.target.value > user?.penguins)
      return toast.error("You don't have enough penguins");
    setSendQty(e.target.value);
  };
  const buyStickerShop = async (sticker: number) => {
    if (buySticker === -1) return toast.error("Please select a sticker");
    const receiver = location.pathname.slice(1);
    setCoinBuying(true);
    try {
      const res = await fetch(`/api/user/sticker/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyQty,
          sticker,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowDropDown(false);
        setBuySticker(-1);
        setBuyQty(0);
        if (sticker === 0) {
          toast.success(buyQty.toString() + " Coins(s) " + data.message);
        }
        if (sticker === 1) {
          toast.success(buyQty.toString() + " Lions(s) " + data.message);
        }
        if (sticker === 2) {
          toast.success(buyQty.toString() + " Penguin(s) " + data.message);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setCoinBuying(false);
  };
  const sendSticker = async () => {
    const receiver = location.pathname.slice(1);
    setCoinSending(true);
    try {
      const res = await fetch(`/api/user/sticker/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver,
          sticker,
          sendQty,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowDropDown(false);
        if (sticker === 0) {
          if (!send) return;
          setUser({ ...user, coins: user.coins - sendQty });
          if (message === "") {
            send(
              `${user.imageUrl}img-livepayout-img${sendQty} Coin(s) sent ${
                sendQty * 10
              }LIV`
            );
          } else {
            send(
              `${
                user.imageUrl
              }img-livepayout-img${message} ${sendQty} Coin(s) sent ${
                sendQty * 10
              }LIV`
            );
          }
        }
        if (sticker === 1) {
          if (!send) return;
          setUser({ ...user, lions: user.lions - sendQty });
          if (message === "") {
            send(
              `${user.imageUrl}img-livepayout-img${sendQty} Lion(s) sent ${
                sendQty * 1000
              }LIV`
            );
          } else {
            send(
              `${
                user.imageUrl
              }img-livepayout-img${message} ${sendQty} Lion(s) sent ${
                sendQty * 1000
              }LIV`
            );
          }
        }
        if (sticker === 2) {
          if (!send) return;
          setUser({ ...user, penguins: user.penguins - sendQty });
          if (message === "") {
            send(
              `${user.imageUrl}img-livepayout-img${sendQty} Penguin(s) sent ${
                sendQty * 10000
              }LIV`
            );
          } else {
            send(
              `${
                user.imageUrl
              }img-livepayout-img${message} ${sendQty} Penguin(s) sent ${
                sendQty * 10000
              }LIV`
            );
          }
        }
      } else {
        toast.error(data.message);
      }
      setSendQty(0);
      onChange("");
      setMessage("");
      setSticker(-1);
    } catch (error: any) {
      toast.error(error.message);
    }
    setCoinSending(false);
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            "border-white/10  w-4/5 lg:w-3/5",
            (isFollowersOnly || isDelayed) && "rounded-t-none border-t-0"
          )}
        />
        {/* <div className="ml-auto">
        <Button type="submit" variant="primary" size="sm" disabled={isDisabled}>
          Chat
        </Button>
      </div> */}
        <div className="flex w-2/5 gap-2 relative">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-1/2 text-center bg-[#C181FF] hover:bg-[#a552ff] rounded-full px-2 p-1"
          >
            <BsFillSendFill />
          </Button>
          <Button
            onClick={() => {
              if (!showDropDown) getUser();
              setShowDropDown(!showDropDown);
            }}
            type="button"
            variant="primary"
            size="sm"
            className="w-1/2 text-center bg-[#C181FF] hover:bg-[#a552ff] rounded-full px-2 p-1"
          >
            <SlOptions />
          </Button>
          {showDropDown && (
            <div className="bg-[#252731] p-2 sm:w-80 w-60 shadow-sm h-max absolute bottom-12 right-2 rounded-lg">
              <button
                type="button"
                onClick={() => setShowDropDown(false)}
                className="w-max absolute right-2 hover:bg-red-500 transition-all duration-200 top-1 bg-red-400 rounded-full text-sm p-1"
              >
                <FaTimes />
              </button>
              <h4 className="font-bold text-sm mb-2">Buy Gift</h4>
              <div className="flex w-full">
                <div className="flex w-1/3 disabled:opacity-70  justify-center items-center flex-col gap-2  text-xs px-1 py-1 font-medium">
                  <button
                    onClick={() => setBuySticker(0)}
                    className={`${
                      buySticker === 0 && "bg-gray-700"
                    } hover:bg-gray-700 transition-all duration-200  rounded-sm py-1 px-4`}
                  >
                    <Image width={55} height={55} src="/btc.png" alt="" />
                    <span>10 LIV</span>
                  </button>
                  {/* disabled={lionSending} */}
                </div>
                <div className="flex w-1/3 disabled:opacity-70  justify-center items-center flex-col gap-2  text-xs px-1 py-1 font-medium">
                  <button
                    onClick={() => setBuySticker(1)}
                    className={`${
                      buySticker === 1 && "bg-gray-700"
                    } hover:bg-gray-700 transition-all duration-200  rounded-sm py-1 px-4`}
                  >
                    <Image width={52} height={52} src="/lion.png" alt="" />
                    <span>1000 LIV</span>
                  </button>
                  {/* disabled={lionSending} */}
                </div>
                <div className="flex w-1/3 disabled:opacity-70  justify-center items-center flex-col gap-2  text-xs px-1 py-1 font-medium">
                  <button
                    onClick={() => setBuySticker(2)}
                    className={`${
                      buySticker === 2 && "bg-gray-700"
                    } hover:bg-gray-700 transition-all duration-200  rounded-sm py-1 px-4`}
                  >
                    <Image width={52} height={52} src="/penguin.png" alt="" />
                    <span>10000 LIV</span>
                  </button>
                  {/* disabled={lionSending} */}
                </div>
              </div>

              {coinBuying ? (
                <span className="sm-loader"></span>
              ) : (
                <div className="flex gap-2 flex-col w-3/5 mx-auto">
                  <input
                    type="number"
                    name="coin"
                    value={buyQty}
                    onChange={(e) =>
                      parseInt(e.target.value) >= 0
                        ? setBuyQty(parseInt(e.target.value))
                        : null
                    }
                    className="w-full bg-[#252731] text-white outline-none border-white/10 transition-all duration-200 focus:border-purple-400 border p-1 rounded-sm text-xs"
                  />
                  <button
                    className="w-full text-xs bg-[#C181FF] disabled:opacity-70 px-1 py-1 rounded-lg"
                    type="button"
                    disabled={buySticker === -1}
                    onClick={() => buyStickerShop(buySticker)}
                  >
                    Spend{" "}
                    {buySticker !== -1 ? buyQty * stickers[buySticker] : "0"}{" "}
                    LIV
                  </button>
                </div>
              )}
              <h4 className="font-bold text-sm mb-2 mt-4">Send Gift</h4>
              <div className="flex gap-4 w-full">
                <div className="flex w-1/2 disabled:opacity-70  justify-center items-center flex-col gap-2  text-xs px-2 py-1 font-medium">
                  <button
                    onClick={() => setSticker(0)}
                    className={`${
                      sticker === 0 && "bg-gray-700"
                    } hover:bg-gray-700 transition-all duration-200  rounded-sm py-1 px-4`}
                  >
                    <Image width={55} height={55} src="/btc.png" alt=""/>
                    <span>{user?.coins}</span>
                  </button>
                </div>
                <div className="flex w-1/2 disabled:opacity-70  justify-center items-center flex-col gap-2  text-xs px-2 py-1 font-medium">
                  <button
                    onClick={() => setSticker(1)}
                    className={`${
                      sticker === 1 && "bg-gray-700"
                    } hover:bg-gray-700 transition-all duration-200  rounded-sm py-1 px-4`}
                  >
                    <Image width={55} height={55} src="/lion.png" alt="" />
                    <span>{user?.lions}</span>{" "}
                  </button>
                </div>
                <div className="flex w-1/2 disabled:opacity-70  justify-center items-center flex-col gap-2  text-xs px-2 py-1 font-medium">
                  <button
                    onClick={() => setSticker(2)}
                    className={`${
                      sticker === 2 && "bg-gray-700"
                    } hover:bg-gray-700 transition-all duration-200  rounded-sm py-1 px-4`}
                  >
                    <Image width={55} height={55} src="/penguin.png" alt="" />
                    <span>{user?.penguins}</span>{" "}
                  </button>
                </div>
              </div>
              <div className="w-full">
                {coinSending ? (
                  <span className="sm-loader block w-full mx-auto"></span>
                ) : (
                  <div className="flex gap-2 items-center px-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width={40}
                      height={40}
                      src={user?.imageUrl}
                      alt=""
                      className="rounded-full"
                    />
                    <div>
                      <input
                        type="text"
                        name="coin"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        disabled={isDisabled}
                        placeholder="Send a message"
                        className="w-full bg-[#252731] text-white outline-none border-white/10 transition-all duration-200 focus:border-purple-400 border p-1 rounded-sm text-xs"
                      />
                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          name="coin"
                          value={sendQty}
                          disabled={sticker === -1}
                          onChange={sendHandler}
                          className="w-1/2 disabled:opacity-70 bg-[#252731] text-white outline-none border-white/10 transition-all duration-200 focus:border-purple-400 border p-1 rounded-sm text-xs"
                        />
                        {coinSending ? (
                          <span className="sm-loader"></span>
                        ) : (
                          <button
                            className="w-1/2 text-xs bg-[#C181FF] px-1 py-1 rounded-lg disabled:opacity-70"
                            type="button"
                            disabled={sticker === -1 || sendQty <= 0}
                            onClick={() => sendSticker()}
                          >
                            {sticker === 0
                              ? "Send " + sendQty + " Coin(s)"
                              : sticker === 1
                              ? "Send " + sendQty + " Lion(s)"
                              : sticker === 2
                              ? "Send " + sendQty + " Penguin(s)"
                              : "Send"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h4 className="font-bold text-sm mt-8">Commands</h4>
              <ul className="text-xs">
                <li>
                  /tip amount your account username
                  <br />
                  eg: /tip 100 johnboe
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
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
