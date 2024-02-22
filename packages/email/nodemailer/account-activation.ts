import { render } from "@react-email/render";
import { AcoountActivationEmail } from "../emails/account-activation";
import { transporter } from "./transporter";
import dotenv from "dotenv";
dotenv.config();

type TSendForgetPasswordEmail = {
  receiverEmailAddress: string;
  receiverName: string;
  accountActivationLink: string;
};

export const sendAccountActivationEmail = async ({
  receiverEmailAddress,
  receiverName,
  accountActivationLink,
}: TSendForgetPasswordEmail) => {
  console.log(process.env.GOOGLE_APP_KEY)
  const emailHtml = render(
    AcoountActivationEmail({
      name: receiverName,
      accountActivationLink,
    })
  );

  try {
    await transporter.sendMail({
      from: {
        name: "Sarthak Roy",
        address: "sarthakroy2003@gmail.com",
      },
      to: [receiverEmailAddress],
      subject: "Account Activation Link from Aokura Connect",
      text: `Hello ${receiverName}, here is your account activation link: ${accountActivationLink}`,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error in sending email",
    };
  }
};
