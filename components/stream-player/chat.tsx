"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectionState } from "livekit-client";
import { useMediaQuery } from "usehooks-ts";
import {
  ReceivedChatMessage,
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatCommunity } from "./chat-community";

interface ChatProps {
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}

export const Chat = ({
  hostName,
  hostIdentity,
  viewerName,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
}: ChatProps) => {
  const matches = useMediaQuery("(max-width: 1024px)");
  const { variant, onExpand } = useChatSidebar((state) => state);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;

  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();

  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [matches, onExpand]);

  const reversedMessages = useMemo(() => {
    // const msgs = messages.sort((a, b) => b.timestamp - a.timestamp);

    const msgs = messages;
    let normMsgs: ReceivedChatMessage[] = [];
    let penguinMsgs: ReceivedChatMessage[] = [];
    let lionMsgs: ReceivedChatMessage[] = [];
    let coinMsgs: ReceivedChatMessage[] = [];
    for (let i = 0; i < msgs.length; i++) {
      if (
        msgs[i].message.toLowerCase().includes("sent") &&
        msgs[i].message.toLowerCase().includes("lion")
      ) {
        console.log("we are here");
        lionMsgs.push(msgs[i]);
      } else if (
        msgs[i].message.toLowerCase().includes("sent") &&
        msgs[i].message.toLowerCase().includes("coin")
      ) {
        // data.message.split(" ")[data.message.split(" ").length - 4]
        coinMsgs.push(msgs[i]);
      } else if (
        msgs[i].message.toLowerCase().includes("sent") &&
        msgs[i].message.toLowerCase().includes("penguin")
      ) {
        // data.message.split(" ")[data.message.split(" ").length - 4]
        penguinMsgs.push(msgs[i]);
      } else {
        normMsgs.push(msgs[i]);
      }
    }
    return [...penguinMsgs, ...lionMsgs, ...coinMsgs, ...normMsgs];
  }, [messages]);

  const onSubmit = () => {
    if (!send) return;

    send(value);
    setValue("");
  };

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="flex flex-col bg-[#141414] border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatHeader />
      {variant === ChatVariant.CHAT && (
        <>
          <ChatList messages={reversedMessages} isHidden={isHidden} />
          <ChatForm
            onSubmit={onSubmit}
            value={value}
            onChange={onChange}
            isHidden={isHidden}
            isFollowersOnly={isChatFollowersOnly}
            isDelayed={isChatDelayed}
            isFollowing={isFollowing}
          />
        </>
      )}
      {variant === ChatVariant.COMMUNITY && (
        <ChatCommunity
          viewerName={viewerName}
          hostName={hostName}
          isHidden={isHidden}
        />
      )}
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
      <ChatHeaderSkeleton />
      <ChatListSkeleton />
      <ChatFormSkeleton />
    </div>
  );
};
