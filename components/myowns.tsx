import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface MyOwns {
  onSubmit: () => void;
  sendSticker: (sticker: number) => void;
  setValue: (value: string) => void;
  coinSending: boolean;
  lionSending: boolean;
  user: object | null;
}

export const MyOwns = async ({
  sendSticker,
  setValue,
  coinSending,
  lionSending,
  onSubmit,
  user,
}: MyOwns) => {
  return (
    <div className="flex gap-12">
      {coinSending ? (
        <div className="flex items-center justify-center">
          <span className="sm-loader"></span>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-2">
          <button
            onClick={() => sendSticker(0)}
            className="hover:scale-105 transition-all duration-200 hover:bg-slate-500 p-1 rounded-lg"
          >
            <Image width={60} height={60} src="/btc.png" alt="" />
          </button>
          <span className="text-purple-400 text-xs px-2 py-1 rounded-sm font-medium">
            {user?.coins || 0}
          </span>
        </div>
      )}
      {lionSending ? (
        <div className="flex items-center justify-center">
          <span className="sm-loader"></span>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-2 mt-1">
          <button
            onClick={() => sendSticker(1)}
            className="hover:scale-105 transition-all duration-200 hover:bg-slate-500 p-1 rounded-lg"
          >
            <Image width={55} height={55} src="/lion.png" alt="" />
          </button>
          <span className="text-purple-400 text-xs px-2 py-1 rounded-sm font-medium">
            {user?.lions || 0}
          </span>
        </div>
      )}
    </div>
  );
};
