"use client";

import { updateSession } from "@/lib/server-actions/auth/jwt-token";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const useUpdateSession = () => {
  useEffect(() => {
    const session = useSession();
    const interaval = setInterval(
      async () => {
        if (session.data) {
          session.data.jwt = await updateSession(session.data.jwt);
        }
      },
      1000 * 60 * 3
    );
    return () => clearInterval(interaval);
  }, []);
};

export default useUpdateSession;
