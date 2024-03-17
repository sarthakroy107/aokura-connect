"use client";

import joinServerAction from "@/lib/server-actions/server/join-server";
import { Button } from "@ui/components/ui/button";
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

  const handleServerJoining = async () => {
    setLoading(true);
    const res = await joinServerAction({ serverId, channelId });

    if(res?.message) {
      console.error(res.message);
      setError(res.message || "Something went wrong");
    }
    setLoading(false);
  };
  return (
    <>
      {error ? (
        <div>
          <h3 className="tex-2xl text-red-500 text-center">Error</h3>
          <strong className="tex-center">{error}</strong>
        </div>
      ) : (
        <Button
          disabled={laoding}
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
