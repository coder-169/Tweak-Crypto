"use client";

import { format } from "date-fns";
import { ReceivedChatMessage } from "@livekit/components-react";

import { stringToColor } from "@/lib/utils";
import { useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";

interface ChatProps {
  data: ReceivedChatMessage;
}
interface ChatMessageProps {
  data: ReceivedChatMessage;
  setMessage: any;
  setShowDrop: any;
  setName: any;
}

export const ChatMessage = ({ data }: ChatProps) => {
  const color = stringToColor(data.from?.name || "");

  return (
    <div className="flex gap-2 p-2 items-center rounded-md hover:bg-white/15">
      <p className="text-sm text-white/40">{format(data.timestamp, "HH:MM")}</p>
      <div className="flex flex-wrap items-center gap-1 grow">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.message.split("img-livepayout-img")[0]}
            className="w-[30px] block mx-auto h-[30px] rounded-full"
            alt=""
          />
          <p className="text-sm font-semibold whitespace-nowrap">
            <span className="truncate" style={{ color: "white" }}>
              {data.from?.name}
            </span>
          </p>
        </div>
        {(data.message.toLowerCase().includes("sent") &&
          data.message.toLowerCase().includes("lion")) ||
        (data.message.toLowerCase().includes("sent") &&
          data.message.toLowerCase().includes("penguin")) ||
        (data.message.toLowerCase().includes("sent") &&
          data.message.toLowerCase().includes("coin")) ? (
          parseInt(
            data.message.split("img-livepayout-img")[1].split(" ")[
              data.message.split(" ").length - 4
            ]
          ) <= 10 ? (
            <p className="text-sm break-all text-white bg-white/20 py-2 px-4 rounded-sm">
              {data.message.split("img-livepayout-img")[1]}
            </p>
          ) : parseInt(
              data.message.split("img-livepayout-img")[1].split(" ")[
                data.message.split(" ").length - 4
              ]
            ) > 10 &&
            parseInt(
              data.message.split("img-livepayout-img")[1].split(" ")[
                data.message.split(" ").length - 4
              ]
            ) < 50 ? (
            <p className="text-sm break-all text-white bg-white/20 py-2 px-4 rounded-sm">
              {data.message.split("img-livepayout-img")[1]}
            </p>
          ) : (
            <p className="text-sm break-all text-white bg-white/20 py-2 px-4 rounded-sm">
              {data.message.split("img-livepayout-img")[1]}
            </p>
          )
        ) : data.message.split("img-livepayout-img")[1].includes("/tip") ? (
          <p className="text-sm break-all bg-white/20 px-4 py-2 mx-2 rounded-md">
            {data.message.split("img-livepayout-img")[1]}
          </p>
        ) : (
          <p className="text-sm break-all">
            {data.message.split("img-livepayout-img")[1]}
          </p>
        )}
      </div>
    </div>
  );
};
export const ChatMessageTop = ({
  data,
  setMessage,
  setShowDrop,
  setName,
}: ChatMessageProps) => {
  const color = stringToColor(data.from?.name || "");
  const handleMessageShow = (d: any) => {
    setMessage(d.message);
    setName(d.from?.name);
    setShowDrop(true);
  };
  return (
    <div className="flex gap-2 p-2 items-center rounded-md flex-shrink-0 w-1/2">
      <div className="flex flex-wrap items-center gap-1 grow w-full">
        {((data.message.toLowerCase().includes("sent ") &&
          data.message.toLowerCase().includes("lion")) ||
          (data.message.toLowerCase().includes("sent") &&
            data.message.toLowerCase().includes("penguin")) ||
          (data.message.toLowerCase().includes("sent") &&
            data.message.toLowerCase().includes("coin"))) &&
          (parseInt(
            data.message
              .split("img-livepayout-img")[1]
              .split(" ")
              [data.message.split(" ").length - 1].split("liv")[0]
          ) < 500 ? (
            <div className="text-center flex items-center px-2 py-1 rounded-full gap-2 my-green w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.message.split("img-livepayout-img")[0]}
                className="w-[30px] block mx-auto h-[30px] rounded-full"
                alt=""
              />
              <div className="text-sm font-semibold whitespace-nowrap w-1/2 overflow-hidden">
                <span className="truncate" style={{ color: "white" }}>
                  {data.from?.name}
                </span>
                <p> {data.message.split("img-livepayout-img")[1]}</p>
              </div>
              <div className="w-1/4">
                {data.message.includes("Lion") ? (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/lion.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                ) : data.message.includes("Penguin") ? (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/penguin.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/btc.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : parseInt(
              data.message
                .split("img-livepayout-img")[1]
                .split(" ")
                [data.message.split(" ").length - 1].split("liv")[0]
            ) > 500 &&
            parseInt(
              data.message
                .split("img-livepayout-img")[1]
                .split(" ")
                [data.message.split(" ").length - 1].split("liv")[0]
            ) < 900 ? (
            <div className="text-center flex items-center px-2 py-1 rounded-full gap-2  my-yellow  w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.message.split("img-livepayout-img")[0]}
                className="w-[30px] block mx-auto h-[30px] rounded-full"
                alt=""
              />
              <div className="text-sm font-semibold whitespace-nowrap w-1/2 overflow-hidden">
                <span className="truncate" style={{ color: "white" }}>
                  {data.from?.name}
                </span>
                <p> {data.message.split("img-livepayout-img")[1]}</p>
              </div>
              <div className="w-1/4">
                {data.message.includes("Lion") ? (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/lion.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                ) : data.message.includes("Penguin") ? (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/penguin.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/btc.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center flex items-center px-2 py-1 rounded-full gap-2  my-purple  w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.message.split("img-livepayout-img")[0]}
                className="w-[30px] block mx-auto h-[30px] rounded-full"
                alt=""
              />
              <div className="text-sm font-semibold whitespace-nowrap w-1/2 overflow-hidden">
                <span className="truncate" style={{ color: "white" }}>
                  {data.from?.name}
                </span>
                <p> {data.message.split("img-livepayout-img")[1]}</p>
              </div>
              <div className="w-1/4">
                {data.message.includes("Lion") ? (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/lion.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                ) : data.message.includes("Penguin") ? (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/penguin.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="flex w-3/4 items-center gap-.5 text-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={"/btc.png"}
                        className="w-[25px] block mx-auto h-[25px] rounded-full"
                        alt=""
                      />
                      {parseInt(
                        data.message.split("img-livepayout-img")[1].split(" ")[
                          data.message.split(" ").length - 4
                        ]
                      )}
                    </span>
                    <button onClick={() => handleMessageShow(data)}>
                      <FaEllipsisH className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
