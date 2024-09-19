"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
interface AccType {
  username: string;
  id: string;
  address: string;
  amount: string;
}
const Page = () => {
  const payAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setData(data.accounts);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const payOne = async (id: string) => {
    const res = await fetch("/api/wallet/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const validatePassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsAuth(true);
      } else {
        toast.error(data.message);
        setIsAuth(false);
      }
      setPassword("");
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/withdraws", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setData(data.accounts);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAccounts();
  }, []);
  return !isAuth ? (
    <div className="mx-auto my-32 w-4/5 relative overflow-x-auto">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={validatePassword}
          className="shadow-lg w-1/2 mx-auto p-16"
        >
          <label htmlFor="pass" className="mb-2 block">
            Authentication Password
          </label>
          <Input
            name="pass"
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="**********"
            type="text"
            className="rounded border border-transparent focus:border-gray-400 bg-[#2d2d2d] text-white  mb-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          />
          <Button
            size="sm"
            variant="primary"
            className="bg-[#C181FF] hover:bg-[#a552ff] rounded-lg px-8 mt-8"
          >
            Validate
          </Button>
        </form>
      )}
    </div>
  ) : loading ? (
    <Loader />
  ) : (
    <div className="mx-auto my-32 w-4/5 relative overflow-x-auto ">
      <div className="flex justify-end mb-8 mr-8">
        <Button
          size="sm"
          onClick={payAll}
          variant="primary"
          className="bg-[#C181FF] hover:bg-[#a552ff] rounded-lg px-8"
        >
          Pay All
        </Button>
      </div>
      {data.length > 0 ? (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-16 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((acc: AccType) => {
              return (
                <tr
                  key={acc.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
                >
                  <td className="p-4">{acc.id?.slice(0, 15)}...</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {acc.username}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="">{acc.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <span className="w-14  text-gray-200 text-sm rounded-lg block px-2.5 py-1 ">
                        $ {acc.amount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => payOne(acc.id)}
                      className="font-medium text-gray-200 dark:bg-green-500 hover:dark:bg-green-600 px-3 py-1 text-sm rounded-md"
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>
          <h2 className="xl font-semibold text-center mt-8">
            No Withdraw Requests
          </h2>
        </div>
      )}
    </div>
  );
};

export default Page;
