import { Resend } from "resend";
import { AcoountActivationEmail } from "../emails/account-activation";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {

    const data = await resend.emails.send({
      from: 'Sarthak Roy <sarthakroy107@protonmail.com>',
      to: [receiverEmailAddress],
      subject: 'Reset your password',
      react: AcoountActivationEmail({ name: receiverName, accountActivationLink }),
      text: `Hello ${receiverName}, here is your password reset link: ${accountActivationLink}`,
    });

    console.error({data})

    if(data.error) {
      return {
        success: false,
        message: data.error || "Error in sending email",
      }
    }

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
