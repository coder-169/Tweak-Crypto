import { currentUser } from "@clerk/nextjs";

import { getUserByUsername } from "@/lib/user-service";
import { StreamPlayer } from "@/components/stream-player";
import { isFollowingUser } from "@/lib/follow-service";
import { isSubscribingUser } from "@/lib/subscribe-service";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const externalUser = await currentUser();
  const user = await getUserByUsername(params.username);
  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  const isFollowing = await isFollowingUser(user.id);
  const isSubscribing = await isSubscribingUser(user.id);
  return (
    <div className="h-full">
      <StreamPlayer
        user={user}
        stream={user.stream}
        isFollowing={isFollowing}
        isSubscribing={isSubscribing}
      />
    </div>
  );
};

export default CreatorPage;
