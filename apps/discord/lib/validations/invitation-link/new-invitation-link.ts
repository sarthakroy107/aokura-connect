import { z } from "zod";

const invitationLinkValidity = z.enum([
  "30-mins",
  "1-hours",
  "6-hours",
  "12-hours",
  "1-days",
  "7-days",
  "30-days",
  "never",
]);
const invitationLinkMaxUsers = z.enum(["1", "5", "10", "25", "50", "100", "no-limit"])

export const newInvitationLinkSchema = z.object({
  validity: invitationLinkValidity,
  maxUsers: invitationLinkMaxUsers,
});

export type TInvitationLinkValidityKeys = z.infer<typeof invitationLinkValidity>
export type TInvitationLinkMaxUsersKeys = z.infer<typeof invitationLinkMaxUsers>
export type TNewInvitationLink = z.infer<typeof newInvitationLinkSchema>

