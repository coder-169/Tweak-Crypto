"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { useChat } from "@livekit/components-react";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { BiBitcoin, BiMoneyWithdraw, BiCreditCardAlt } from "react-icons/bi";
import { IoCaretBack } from "react-icons/io5";
import Cookies from "js-cookie";

const Buttons = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const [openWith, setOpenWith] = useState(false);
  const [show, setShow] = useState(false);
  const handleStyle = () => {
    setShow(!show);
  };
  const [credits, setCredits] = useState("");
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const handleDeposit = async () => {
    // setShow(false);
    if (parseInt(credits) < 30 || credits === "")
      return toast.error("Minimum deposit is 30 credits");
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({ id: user?.externalUserId, credits }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentDetails(data.payout);
        localStorage.setItem("paymentDetails", JSON.stringify(data.payout));
      } else {
        toast.error(data.message);
      }
      setCredits("");
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
    router.refresh();
  };
  const checkPaid = async (id: string) => {
    if (!id) return toast.error("Sorry invalid id passed");
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch("/api/wallet/status", {
        method: "POST",
        body: JSON.stringify({
          id,
          credits: user?.credits,
          userId: user?.externalUserId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.details.payment_status === "finished") {
          toast.success(
            "Your payment is successful! Credits deposited successfully to your account"
          );
          setOpen(false);
          localStorage.removeItem("paymentDetails");
        } else {
          toast.success(
            `Your payment is with status ${data.details.payment_status}`
          );
        }
      } else {
        toast.error(data.message);
      }
      setCredits("");
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
    router.refresh();
  };
  const handleWithdraw = async () => {
    setOpenWith(true);
    if (address === "") return toast.error("Please enter deposit address");
    setLoading(true);
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
        body: JSON.stringify({
          id: user?.externalUserId,
          newCreds,
          address,
          credits,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setAddress("");
        setOpenWith(false)
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
    setLoading(false);
    router.refresh();
  };
  const [isCopied, setIsCopied] = useState(false);
  const copyAddress = () => {
    // Select the address text
    setIsCopied(true);
    var addressText = document.getElementById("address")!;
    var range = document.createRange();
    if (addressText) {
      range.selectNode(addressText);
      if (window) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand("copy");
          selection.removeAllRanges();
        }
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
        // Deselect text
        toast.success("Address copied to clipboard");
      }
    }

    // Copy text to clipboard

    // Alert copied
    // alert("Address copied to clipboard: " + addressText.textContent);
  };
  const [showPayOptions, setShowPayOptions] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const handleStripe = async () => {
    if (parseInt(credits) <= 0) {
      return toast.error("credits must be greater than 10");
    }
    const resp = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credits: parseInt(credits),
        name: user?.username,
        userId: user?.externalUserId,
      }),
    });
    const data = await resp.json();
    const session = data.session;
    if (data.success) {
      if (stripePromise !== null) {
        const stripeSession = await stripePromise;
        if (stripeSession) {
          stripeSession.redirectToCheckout({
            sessionId: session.id,
          });
        }
      }
    } else {
      toast.error(data.message);
    }
    setShowPayOptions(false);
    // window.location.assign(data);
  };

  useEffect(() => {
    const sessionCookie = Cookies.get("__session");

    console.log("Session Cookie:", sessionCookie);

    if (localStorage.getItem("paymentDetails")) {
      const paymentDetails = localStorage.getItem("paymentDetails");
      const parsed = paymentDetails ? JSON.parse(paymentDetails) : null;
      if (parsed) {
        const exp_estimate = parsed?.expiration_estimate_date;
        const expDate = new Date(exp_estimate);
        const currentDate = new Date();
        if (expDate <= currentDate) {
          setOpen(false);
          setShow(false);
          localStorage.removeItem("paymentDetails");
        } else {
          setOpen(true);
          setShow(true);
          setPaymentDetails(
            JSON.parse(localStorage.getItem("paymentDetails")!)
          );
        }
      }
    }
  }, []);
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
        <img src="/LV.png" width={22} alt="" />
      </Button>
      {show && (
        <div
          className={`absolute ${open && "opacity-0"} bg-gray-600 w-28`}
          style={{
            background: "#252731",
            width: "300px",
            padding: "15px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            top: "4rem",
            borderRadius: "12px",
            justifyContent: "center",
            alignItems: "center",
            right: "-90%",
          }}
        >
          {!showPayOptions && (
            <Input
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Credits"
              type="number"
              className="rounded-r-none mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
          )}

          {!showPayOptions ? (
            <div className="flex gap-4 justify-between">
              <Button
                onClick={() => setOpenWith(true)}
                variant={"primary"}
                size={"sm"}
                className="rounded-sm flex items-center gap-x-1 bg-[#C181FF] hover:bg-[#a552ff]"
              >
                <BiMoneyWithdraw className="w-4 h-4" />
                <span>Withdraw</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setShowPayOptions(true)}
                className="rounded-sm flex items-center gap-x-1"
              >
                <BiCreditCardAlt className="w-4 h-4" />
                <span>Deposit</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-around">
              <Button
                // onClick={() => setShowPayment(true)}
                variant={"primary"}
                size={"sm"}
                className="rounded-sm  flex items-center gap-x-1 bg-[#C181FF] hover:bg-[#a552ff]"
              >
                <BiCreditCardAlt className="w-4 h-4" />
                <Link href="/stripe/deposit">Card</Link>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={handleDeposit}
                className="rounded-sm  flex items-center gap-x-1"
              >
                <BiBitcoin className="w-4 h-4" />
                <span>Crypto</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setShowPayOptions(false)}
                className="rounded-sm  flex items-center gap-x-1"
              >
                <IoCaretBack className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </div>
          )}
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
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      {loading ? (
                        <div className="w-full h-48 text-center flex items-center">
                          <span className="loader mb-4 block mx-auto"></span>
                        </div>
                      ) : (
                        <>
                          <div className="bg-[#2b2b2b] text-white text-center px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="text-center flex flex-col items-center justify-center">
                              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                <CurrencyDollarIcon
                                  className="h-6 w-6 text-[#C181FF]"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="mt-3 flex flex-col items-center justify-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-white mt-4 mb-2"
                                >
                                  Pay {paymentDetails?.pay_amount} BNB on
                                  Address below
                                </DialogTitle>
                                <div className="mt-2 flex gap-2 items-center">
                                  <p
                                    id="address"
                                    className="text-sm text-gray-500"
                                  >
                                    {paymentDetails?.pay_address}
                                  </p>
                                  {isCopied ? (
                                    <button className="text-white rounded-sm bg-black/50">
                                      <CheckIcon className="h-6 w-6 p-1" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={copyAddress}
                                      className="text-white rounded-sm bg-black/50"
                                    >
                                      <ClipboardIcon className="h-6 w-6 p-1" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#2b2b2b] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button
                              variant="primary"
                              type="button"
                              className="ml-4 rounded-sm bg-[#C181FF] hover:bg-[#a552FF]"
                              onClick={() =>
                                checkPaid(paymentDetails?.payment_id)
                              }
                            >
                              Paid
                            </Button>
                            {/* <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-sm bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              data-autofocus
                            >
                              Cancel
                            </button> */}
                            <Button
                              onClick={() => setOpen(false)}
                              type="button"
                              variant="ghost"
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      )}
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
          <Transition show={openWith}>
            <Dialog className="relative z-10" onClose={setOpenWith}>
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
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      {loading ? (
                        <div className="w-full h-48 text-center flex items-center">
                          <span className="loader mb-4 block mx-auto"></span>
                        </div>
                      ) : (
                        <>
                          <div className="bg-[#212121] text-center px-4 pb-4 pt-5 sm:p-6 sm:pb-4 text-white">
                            <div className="text-center flex flex-col items-center justify-center">
                              <div className="mt-3 flex flex-col items-center justify-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle
                                  as="h3"
                                  className="text-base font-semibold leading-6 mt-4 mb-2 text-center"
                                >
                                  For Withdrawn of {credits} USDT enter your BEP20 address
                                  below
                                </DialogTitle>
                                <div className="mt-2 w-full flex gap-2 items-center">
                                  <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="0x659c4338b23g315c946ab5d0a85d95fa97ff9d45"
                                    type="text"
                                    className="rounded border border-transparent focus:border-gray-400 bg-[#2d2d2d] text-white  mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#212121] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button
                              variant="primary"
                              type="button"
                              className="ml-4 rounded-sm bg-[#C181FF] hover:bg-[#a552FF]"
                              onClick={handleWithdraw}
                            >
                              Withdraw
                            </Button>
                            {/* <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-sm bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setOpenWith(false)}
                              data-autofocus
                            >
                              Cancel
                            </button> */}
                            <Button
                              onClick={() => setOpenWith(false)}
                              data-autofocus
                              type="button"
                              variant={"ghost"}
                            >
                              {" "}
                              Cancel
                            </Button>
                          </div>
                        </>
                      )}
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
          {/* <PaymentForm
            setShowPayment={setShowPayment}
            showPayment={showPayment}
            uId={user?.externalUserId}
          /> */}
        </div>
      )}
    </div>
  );
};

export default Buttons;
