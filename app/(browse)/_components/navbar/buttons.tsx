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
    console.log("clicked");
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
      console.log(data);
      if (data.success) {
        setPaymentDetails(data.payout);
        localStorage.setItem("paymentDetails", JSON.stringify(data.payout));
      } else {
        toast.error(data.message);
      }
      setCredits("");
    } catch (error: any) {
      console.log(error);
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
      console.log(error);
    }
    setLoading(false);
    router.refresh();
  };
  const handleWithdraw = async () => {
    setOpenWith(true);
    if (address === "") return toast.error("Please enter deposit address");
    console.log(address, credits);
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
      console.log(data);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);
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
    if (localStorage.getItem("paymentDetails")) {
      const paymentDetails = localStorage.getItem("paymentDetails");
      const parsed = paymentDetails ? JSON.parse(paymentDetails) : null;
      if (parsed) {
        const exp_estimate = parsed?.expiration_estimate_date;
        const expDate = new Date(exp_estimate);
        const currentDate = new Date();
        console.log(expDate, currentDate);
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
            width: "250px",
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
              max={user?.credits}
              min={1}
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
                className="flex items-center gap-x-1 bg-[#C181FF] hover:bg-[#a552ff]"
              >
                <span>Withdraw</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setShowPayOptions(true)}
                className="flex items-center gap-x-1"
              >
                <span>Deposit</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-around">
              <Button
                // onClick={() => setShowPayment(true)}
                variant={"primary"}
                size={"sm"}
                className="flex items-center gap-x-1 bg-[#C181FF] hover:bg-[#a552ff]"
              >
                <Link href="/stripe/deposit">Stripe</Link>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={handleDeposit}
                className="flex items-center gap-x-1"
              >
                <span>Crypto</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setShowPayOptions(false)}
                className="flex items-center gap-x-1"
              >
                <span>Edit</span>
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
                          <div className="bg-white text-center px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="text-center flex flex-col items-center justify-center">
                              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <CurrencyDollarIcon
                                  className="h-6 w-6 text-blue-600"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="mt-3 flex flex-col items-center justify-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-gray-900 mt-4 mb-2"
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
                                    <button className="text-gray-800 rounded-sm bg-gray-200">
                                      <CheckIcon className="h-6 w-6 p-1" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={copyAddress}
                                      className="text-gray-800 rounded-sm bg-gray-200"
                                    >
                                      <ClipboardIcon className="h-6 w-6 p-1" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
                              onClick={() =>
                                checkPaid(paymentDetails?.payment_id)
                              }
                            >
                              Paid
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setOpen(false)}
                              data-autofocus
                            >
                              Cancel
                            </button>
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
                          <div className="bg-white text-center px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="text-center flex flex-col items-center justify-center">
                              <div className="mt-3 flex flex-col items-center justify-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-gray-900 mt-4 mb-2"
                                >
                                  for Withdrawn of {credits} USDT enter address
                                  below
                                </DialogTitle>
                                <div className="mt-2 w-full flex gap-2 items-center">
                                  <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="0x432989v84hfasd3423dalfjdoi3"
                                    type="text"
                                    className="rounded border border-gray-300 focus:border-gray-400 text-black bg-white mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
                              onClick={handleWithdraw}
                            >
                              Withdraw
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setOpenWith(false)}
                              data-autofocus
                            >
                              Cancel
                            </button>
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
