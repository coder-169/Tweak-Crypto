"use client";
import React, { useEffect, useState } from "react";
import BrowseLayout from "../(browse)/layout";
import { Button } from "@/components/ui/button";
import { parse } from "path";
import axios from "axios";
import { toast } from "sonner";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa"
import Loader from "@/components/ui/loader";
import { handleUser } from "./actor"
const Page = () => {

  const [loading, setLoading] = useState(false)
  const [coins, setCoins] = useState({ from: "0", to: "0" });
  const fixCoin = 1;
  const [isCopied, setIsCopied] = useState(false)
  const [choice, setChoice] = useState(false);
  const handleConversionChange = (e) => {
    if (e.target.name === "from") {
      setCoins({
        ...coins,
        from: e.target.value,
        to: parseFloat(e.target.value) * fixCoin,
      });
    } else {
      setCoins({
        ...coins,
        to: e.target.value,
        from: parseFloat(e.target.value) * fixCoin,
      });
    }
  };
  const [address, setAddress] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const handleDeposit = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const { data } = await axios.get('/api/wallet/deposit');
      console.log(data)
      if (data.success) {
        setAddress(data.data.address);
        localStorage.setItem("dep-address", data.data.address)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  const handleWithdraw = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/wallet/withdraw', { amount: coins.to, address: withdrawAddress });
      console.log(data)
      if (data.success) {
        setAddress(data.data.address);
        localStorage.setItem("dep-address", data.data.address)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  const copyAddress = () => {
    // Select the address text
    setIsCopied(true)
    var addressText = document.getElementById("address");
    var range = document.createRange();
    range.selectNode(addressText);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Copy text to clipboard
    document.execCommand("copy");

    // Deselect text
    window.getSelection().removeAllRanges();

    // Alert copied
    toast.success('Address copied to clipboard')
    // alert("Address copied to clipboard: " + addressText.textContent);
  }
  return (
    <div className="card-deposit-withdraw-container">
      <div className="card-deposit-withdraw">
        <div className="header text-center">
          <h2
            className={`${!choice ? "active" : ""}`}
            onClick={() => setChoice(false)}
          >
            Deposit
          </h2>
          <h2
            className={`${choice ? "active" : ""}`}
            onClick={() => setChoice(true)}
          >
            Withdraw
          </h2>
        </div>
        <form onSubmit={handleDeposit} className={`deposit ${!choice ? "show-form" : ""}`}>
          {address !== "" && <div className="p-4 mb-8">
            <h3 className="mb-4 font-bold text-gray-400">TRC20 Address for USDT</h3>
            <div className="flex justify-between sm-card bg-gray-750">
              <p className="" id="address">{address}</p>
              <button type="button" onClick={copyAddress} ><FaClipboard className="text-gray-500" /></button>
            </div>
            <div className="mt-4">
              <p className="mt-4 text-sm text-center">
                Don&apos;t refresh the page pay and click paid to get credits
              </p>
              <div className="mt-4">
                <button className="big-btn">PAID?</button>
              </div>
            </div>
          </div>}
          {loading ? <Loader /> : ((address === "") && <>
            <div className="p-4 sm-card mb-8 bg-gray-750">
              <button className="btn">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img width={20} src="/usdt.svg" alt="" />
                USD
              </button>
              <input
                type="text"
                name="from"
                onChange={handleConversionChange}
                value={coins.from}
                placeholder="12345"
                className="mt-2 bg-transparent input-money outline-none border-0 text-xl text-white"
              />
            </div>
            <div className="bg-gray-750 sm-card p-4">
              <button className="btn">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img width={20} src="/LV.png" alt="" />
                LV
              </button>
              <input
                name="to"
                onChange={handleConversionChange}
                value={coins.to}
                type="text"
                placeholder="4325.23"
                className="mt-2 bg-transparent input-money outline-none border-0 text-xl text-white"
              />
            </div>
            <p className="mt-4 text-sm">
              You will receive {coins.from * fixCoin} credits in your account
              after successful deposit{" "}
            </p>
            <div className="mt-4">
              <button className="big-btn">DEPOSIT</button>
            </div>
          </>)
          }

        </form>
        <form onSubmit={handleWithdraw} className={`withdraw ${choice ? "show-form" : ""}`}>

          {loading ? <Loader /> : (<>
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-400">TRC20 Withdraw Address for USDT</h3>
              <div className="flex justify-between sm-card bg-gray-750">
                <input
                  name="withdrawAddress"
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  value={withdrawAddress}
                  type="text"
                  placeholder="Withdraw Address"
                  className="g-transparent input-money outline-none border-0 text-xl text-white"
                />
              </div>
            </div>
            <div className="bg-gray-750 sm-card p-4">
              <button className="btn">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img width={20} src="/usdt.svg" alt="" />
                XYZ
              </button>
              <input
                name="to"
                onChange={handleConversionChange}
                value={coins.to}
                type="text"
                placeholder="4325.23"
                className="mt-2 bg-transparent input-money outline-none border-0 text-xl text-white"
              />
            </div>
            <div className="p-4 sm-card mb-8 bg-gray-750">
              <button className="btn">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img width={20} src="/LV.png" alt="" />
                LV
              </button>
              <input
                type="text"
                name="from"
                onChange={handleConversionChange}
                value={coins.from}
                placeholder="12345"
                className="mt-2 bg-transparent input-money outline-none border-0 text-xl text-white"
              />
            </div>
            <p className="mt-4 text-sm">
              You will receive {coins.to / fixCoin} USDT in your account after
              successful withdraw{" "}
            </p>
            <div className="mt-4">
              <button className="big-btn">WITHDRAW</button>
            </div>
          </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Page;
