"use client";

import { Button } from "@ui/components/ui/button";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import type { TAPIJoinServerResponse } from "@/app/api/member/route";

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
    const res = await fetch("/api/member", {
      method: "POST",
      body: JSON.stringify({ serverId, channelId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: TAPIJoinServerResponse = await res.json();
    if (res.status !== 200) {
      setError(data.message);
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
