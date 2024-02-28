import 'dotenv/config';
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


export const verifyToken = async (token: string) => {
  // console.log("From Verify Token: ", token);
  if (!token) {
    return false;
  }
  console.log("JWT_SECRET: ", process.env.JWT_SECRET)
  const payload = await decrypt(token);
  if (!payload || !payload.exp || !payload.iat) {
    return false
  }

  if (payload.exp * 1000 < Date.now()) {

    throw new Error("Token expired");
  }

  return true;
}