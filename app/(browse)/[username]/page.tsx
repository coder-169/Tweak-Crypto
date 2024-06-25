import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser,isSubscribingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
};

const UserPage = async ({
  params
}: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user || !user.stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);
  const isSubscribing = await isSubscribingUser(user.id);
  const isBlocked = await isBlockedByUser(user.id);

  if (isBlocked) {
    notFound();
  }

  return ( 
    <StreamPlayer
      user={user}
      stream={user.stream}
      isFollowing={isFollowing}
      isSubscribing={isSubscribing}
    />
  );
}
 
export default UserPage;