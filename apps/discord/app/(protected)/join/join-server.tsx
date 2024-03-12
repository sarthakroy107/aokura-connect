"use client";

import joinServerAction from "@/lib/server-actions/server/join-server";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarLoader } from "react-spinners";

const JoinServerButton = ({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId?: string;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [laoding, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleServerJoining = async () => {
    setLoading(true);
    const res = await joinServerAction({ serverId, channelId });

    // if (!res.success) {
    //   console.error(res.message);
    //   setError(res.message || "Something went wrong");
    // }

    if(res?.message) {
      console.error(res.message);
      setError(res.message || "Something went wrong");
    }

    console.table(res);

    setLoading(false);

    // if (channelId) router.push(`/channel/${serverId}/${channelId}`);
    // else router.push(`/channel/${serverId}`);
  };
  return (
    <>
      {error ? (
        <div>
          <h3 className="tex-2xl text-red-500 text">Error</h3>
          <strong>{error}</strong>
        </div>
      ) : (
        <Button
          type="button"
          onClick={handleServerJoining}
          className=" w-20 rounded-full mt-4"
        >
          {laoding ? <BarLoader color="#fff" /> : "JOIN"}
        </Button>
      )}
    </>
  );
};

export default JoinServerButton;
