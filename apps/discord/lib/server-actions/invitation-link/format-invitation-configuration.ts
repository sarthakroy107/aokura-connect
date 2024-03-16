import { type TNewInvitationLink } from "@/lib/validations/invitation-link/new-invitation-link";

export default function invitationLinkDataFormatter(data: TNewInvitationLink) {
  let expDate: Date | null;

  switch (data.validity) {
    case "30-mins":
      expDate = new Date(Date.now() + 30 * 60 * 1000);
      break;
    case "1-hours":
      expDate = new Date(Date.now() + 60 * 60 * 1000);
      break;
    case "6-hours":
      expDate = new Date(Date.now() + 6 * 60 * 60 * 1000);
      break;
    case "12-hours":
      expDate = new Date(Date.now() + 12 * 60 * 60 * 1000);
      break;
    case "1-days":
      expDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      break;
    case "7-days":
      expDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      break;
    case "30-days":
      expDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      break;
    case "never":
      expDate = null;
      break;
    default:
      throw new Error("Invalid validity");
  }
  return {
    maxUsers: data.maxUsers === "no-limit" ? null : parseInt(data.maxUsers),
    expDate,
  };
}
