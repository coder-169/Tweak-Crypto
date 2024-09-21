"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);
import { Input } from "@/components/ui/input";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";
import Link from "next/link";
const ElementsProvider = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Elements
      stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")}
    >
      <PaymentForm />
    </Elements>
  );
};

const PaymentForm = () => {
  const [paymentData, setPaymentData] = useState({ email: "", name: "" });
  const [credits, setCredits] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChangePayment = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };
  const elements = useElements();
  const stripe = useStripe();
  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    toast.loading("Processing payment", { duration: 1500 });
    try {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentData,
          credits: parseInt(credits),
        }),
      };
      const response = await fetch("/api/checkout", config);
      const data = await response.json();
      if (data.success) {
        const { client_secret } = data;

        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            type: "card",
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: paymentData.name,
              email: paymentData.email,
              address: {
                country: "US",
                city: "Mclean",
                line1: "1408 Cabell Avenue",
                postal_code: 22101,
                state: "Virginia",
              },
            },
          },
        });
        if (result.error) {
          toast.error(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            toast.success("Payment successful");
            const response = await fetch("/api/wallet/deposit/stripe", {
              method: "POST",
              body: JSON.stringify({
                credits: parseInt(credits),
              }),
            });
            const d = await response.json();
            if (d.success) {
              toast.success(credits + " Credits deposited successfully", {
                duration: 2000,
              });
              window.location.href = "https://livepayout.org";
            } else {
              toast.error(d.message);
            }
          } else {
            toast.error(`Error while processing the payment`);
          }
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const cardStyle = {
    style: {
      base: {
        color: "#fff", // Set your desired text color
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4", // Set your desired placeholder color
        },
      },
      invalid: {
        color: "#fa755a", // Set your desired color for invalid input
        iconColor: "#fa755a",
      },
    },
  };
  return (
    <div className="relative m-0 py-32 px-12 w-full mx-auto h-full transform overflow-hidden rounded-lg text-left shadow-md transition-all">
      <div className="half-at-mid w-1/2 mx-auto text-center px-4 pb-4 sm:p-6 sm:pb-4  pt-32">
        <Link className="mb-16" href={"/"}>
          {/*eslint-disable-next-line @next/next/no-img-element */}
          <img src="/coin.png" className="w-20 mx-auto block" alt="" />
        </Link>
        <h3 className="text-base font-semibold leading-6 my-4 mb-8 mt-8 pt-8 ">
          Deposit Liv Through Stripe
        </h3>
        <div className="mt-8">
          <div className="mt-2 w-full flex gap-2 items-center">
            <Input
              value={paymentData.email}
              onChange={handleChangePayment}
              placeholder="Email"
              name="email"
              type="email"
              className="rounded border border-gray-300   bg-transparent  mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
          </div>
          <div className="mt-2 w-full flex gap-2 items-center">
            <Input
              value={paymentData.name}
              onChange={handleChangePayment}
              placeholder="Name"
              name="name"
              type="text"
              className="w-1/2 rounded border border-gray-300   bg-transparent  mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
            <Input
              value={credits}
              name="credits"
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Credits"
              type="number"
              className="w-1/2 rounded border border-gray-300  bg-transparent mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
          </div>
          <div className="mt-2 w-full flex gap-2 items-center">
            <CardNumberElement
              options={cardStyle}
              className="w-full rounded border p-3 border-gray-300 focus:border-gray-400 !text-white mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
          </div>
          <div className="mt-2 w-full flex gap-2 items-center">
            <CardCvcElement
              options={cardStyle}
              className="w-1/2 rounded border p-3 border-gray-300 focus:border-gray-400 text-white mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
            <CardExpiryElement
              options={cardStyle}
              className="w-1/2 rounded border p-3 border-gray-300 focus:border-gray-400 text-white mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
      <div className="half-at-mid w-1/2 mx-auto text-center">
        <button
          type="button"
          disabled={loading}
          className="disabled:opacity-50 w-1/2 mx-auto disabled:cursor-not-allowed block bg-[#C181FF] hover:bg-[#a552ff]  px-3 py-2 text-sm font-semibold text-white shadow-sm rounded-sm"
          onClick={handlePayment}
        >
          <span className="!font-bold">Pay</span> Now {credits / 100 + "$"}
        </button>
      </div>
    </div>
  );
};
export default ElementsProvider;
