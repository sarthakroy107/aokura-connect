'use server';

import { currentProfile } from "@/lib/auth/current-user";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

type TTokenPayload = {
  id: string;
  email: string;
  username: string;
} | JWTPayload

export const encode = async (payload: TTokenPayload ) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);
};

export const decrypt = async (token: string) => {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
};

export const generateJWT = async ({
  token,
}: {
  token?: string;
}) => {
  if (!token) {
    const { message, data } = await currentProfile();
    if (!data)
      return {
        status: 404,
        success: false,
        message: message,
        token: null,
      };

    const payload = {
      id: data.id,
      email: data.email,
      username: data.usernaeme,
    };
    
    return {
      status: 200,
      success: true,
      token: await encode(payload),
    };
  }

  const payload = await decrypt(token);

  console.log({ payload });

  if (!payload) {
    return {
      status: 401,
      success: false,
      message: "Not valid token",
      token: null,
    };
  }

  if (payload.exp && payload.exp < Date.now()) {
    return {
      status: 201,
      success: true,
      token: await encode(payload),
    };
  }

  return {
    status: 200,
    success: true,
    token: await encode(payload),
  };
};


export async function updateSession(token: string | undefined | null) {
  if(!token) return null;
  const parsed = await decrypt(token);
  parsed.expires = new Date(Date.now() + 10 * 60 * 1000);
  return await encode(parsed);
}