"use client";

import { ReceivedChatMessage } from "@livekit/components-react";

import { Skeleton } from "@/components/ui/skeleton";

import { ChatMessage, ChatMessageTop } from "./chat-message";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

interface ChatListProps {
  messages: ReceivedChatMessage[];
  isHidden: boolean;
}

export const ChatList = ({ messages, isHidden }: ChatListProps) => {
  const [showDrop, setShowDrop] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }
  const filterMessages = (messages: any) => {
    const msgs = messages.filter(
      (msg: any) =>
        msg.message.toLowerCase().includes("sent") &&
        msg.message.toLowerCase().includes("liv")
    );
    return msgs;
  };

  return (
    <div className="h-full overflow-y-auto relative">
      {showDrop && message && (
        <div className=" text-white z-50 h-24 w-[96%] absolute left-2 top-1">
          <div className="min-h-full max-h-max w-[96%] mx-auto flex items-center gap-1">
            {((message.toLowerCase().includes("sent ") &&
              message.toLowerCase().includes("lion")) ||
              (message.toLowerCase().includes("sent ") &&
                message.toLowerCase().includes("penguin")) ||
              (message.toLowerCase().includes("sent") &&
                message.toLowerCase().includes("coin"))) &&
              (parseInt(
                message
                  .split("img-livepayout-img")[1]
                  .split(" ")
                  [message.split(" ").length - 1].split("liv")[0]
              ) < 500 ? (
                <div className="text-center h-full w-full mx-auto px-2 py-1 gap-2 my-green">
                  <div className="w-full flex justify-between px-4 text-sm font-semibold whitespace-nowrap ">
                    <div className="flex gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={message.split("img-livepayout-img")[0]}
                        className="w-[30px] block mx-auto h-[30px] rounded-full"
                        alt=""
                      />
                      <span className="truncate" style={{ color: "white" }}>
                        {name}
                      </span>
                    </div>{" "}
                    <div className="w-1/5">
                      {message.includes("Lion") ? (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/lion.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : message.includes("Penguin") ? (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/penguin.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/btc.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs">
                    {" "}
                    {message.split("img-livepayout-img")[1]}
                  </p>
                </div>
              ) : parseInt(
                  message
                    .split("img-livepayout-img")[1]
                    .split(" ")
                    [message.split(" ").length - 1].split("liv")[0]
                ) > 500 &&
                parseInt(
                  message
                    .split("img-livepayout-img")[1]
                    .split(" ")
                    [message.split(" ").length - 1].split("liv")[0]
                ) < 900 ? (
                <div className="text-center h-full w-full mx-auto px-2 py-1 gap-2  my-yellow">
                  <div className="w-full flex justify-between px-4 text-sm font-semibold whitespace-nowrap ">
                    <div className="flex gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={message.split("img-livepayout-img")[0]}
                        className="w-[30px] block mx-auto h-[30px] rounded-full"
                        alt=""
                      />
                      <span className="truncate" style={{ color: "white" }}>
                        {name}
                      </span>
                    </div>{" "}
                    <div className="w-1/5">
                      {message.includes("Lion") ? (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/lion.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : message.includes("Penguin") ? (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/penguin.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/btc.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>{" "}
                  <p className="text-xs">
                    {" "}
                    {message.split("img-livepayout-img")[1]}
                  </p>
                </div>
              ) : (
                <div className="text-center w-full h-full mx-auto px-2 py-1 gap-2  my-purple">
                  <div className="w-full flex justify-between px-4 text-sm font-semibold whitespace-nowrap ">
                    <div className="flex gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={message.split("img-livepayout-img")[0]}
                        className="w-[30px] block mx-auto h-[30px] rounded-full"
                        alt=""
                      />
                      <span className="truncate" style={{ color: "white" }}>
                        {name}
                      </span>
                    </div>
                    <div className="w-1/5">
                      {message.includes("Lion") ? (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/lion.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : message.includes("Penguin") ? (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/penguin.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="flex w-3/4 items-center gap-.5 text-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={"/btc.png"}
                              className="w-[25px] block mx-auto h-[25px] rounded-full"
                              alt=""
                            />
                            {parseInt(
                              message.split("img-livepayout-img")[1].split(" ")[
                                message.split(" ").length - 4
                              ]
                            )}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-600 text-xl"
                            onClick={() => setShowDrop(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>{" "}
                  <p className="text-xs">
                    {" "}
                    {message.split("img-livepayout-img")[1]}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
      {filterMessages(messages).length > 0 && (
        <div className="sticky top-0 overflow-x-scroll h-24 gap-4 flex justify-start w-[95%] mx-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 bg-[#1f2128]">
          {" "}
          {filterMessages(messages).map((message: any) => (
            <ChatMessageTop
              key={message.timestamp}
              data={message}
              setShowDrop={setShowDrop}
              setMessage={setMessage}
              setName={setName}
            />
          ))}
        </div>
      )}
      <div className="h-10/12 flex flex-1 flex-col overflow-y-auto p-3 ">
        {messages.map((message) => (
          <ChatMessage key={message.timestamp} data={message} />
        ))}
      </div>
    </div>
  );
};

export const ChatListSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
};
