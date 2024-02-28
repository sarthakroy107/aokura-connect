import { JWTPayload, SignJWT, jwtVerify } from "jose";

type TTokenPayload =
  | {
      id: string;
      email: string;
      username: string;
    }
  | JWTPayload;

export const encode = async ({
  payload,
  key,
}: {
  payload: TTokenPayload;
  key: Uint8Array;
}) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);
};

export const decrypt = async ({
  token,
  key,
}: {
  token: string;
  key: Uint8Array;
}) => {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
};
