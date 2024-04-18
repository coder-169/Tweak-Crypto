"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const Buttons = ({ user }: { user: any }) => {
  const [show, setShow] = useState(false);
  const handleStyle = () => {
    setShow(!show);
  };
  const [credits, setCredits] = useState("");
  const router = useRouter();
  const handleDeposit = async () => {
    setShow(false);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({ id: user?.externalUserId, credits }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } else {
        toast.error(data.message);
      }
      setCredits("");
    } catch (error: any) {
      console.log(error);
    }
    router.refresh();
  };
  const handleWithdraw = async () => {
    setShow(false);
    try {
      if (parseInt(credits) < 1)
        return toast.error("You can't withdraw less than 1 credit");
      const usCreds = parseInt(user?.credits);
      if (usCreds < parseInt(credits)) {
        return toast.error("You don't have enough credits to withdraw");
      }
      const newCreds = user?.credits - parseInt(credits);
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        body: JSON.stringify({ id: user?.externalUserId, newCreds }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setCredits("");
    } catch (error: any) {
      console.log(error);
    }
    router.refresh();
  };
  return (
    <div className="relative">
      <Button
        onClick={handleStyle}
        variant={"outline"}
        size={"sm"}
        className="flex items-center gap-x-1 mr-2"
      >
        <span>{user?.credits}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creds.png" width={22} alt="" />
      </Button>
      {show && (
        <div
          className="absolute right-0 bg-gray-600 w-20"
          style={{
            background: "#252731",
            width: "250px",
            padding: "15px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            top: "4rem",
            borderRadius: "12px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Input
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="Credits"
            max={user?.credits}
            min={1}
            type="number"
            className="rounded-r-none mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          />
          <div className="flex gap-4 justify-between">
            <Button
              onClick={handleWithdraw}
              variant={"primary"}
              size={"sm"}
              className="flex items-center gap-x-1 mr-2"
            >
              <span>Withdraw</span>
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={handleDeposit}
              className="flex items-center gap-x-1 mr-2"
            >
              <span>Deposit</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buttons;
