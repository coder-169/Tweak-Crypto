import React from "react";
import Link from "next/link"
import Image from "next/image"
const page = () => {
  return (
    <div>
      <Link href="/">
        <div className="flex items-center gap-x-4 hover:opacity-75 transition">
          <div className="bg-white rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
            <Image src="/spooky.svg" alt="Livepayout" height="32" width="32" />
          </div>
          <div className={"hidden lg:block"}>
            <p className="text-lg font-semibold">Livepayout</p>
            <p className="text-xs text-muted-foreground">Let&apos;s play</p>
          </div>
        </div>
      </Link>
      <iframe
        src="https://livepayout.blogspot.com/2024/04/10-live-stream-some-text-buy-now-20.html"
        frameborder="0"
        style={{
          overflow: "hidden",
          display: "block",
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
      ></iframe>
    </div>
  );
};

export default page;
