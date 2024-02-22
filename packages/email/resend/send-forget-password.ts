import { Resend } from "resend";
import { ResetPasswordEmail } from "../emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

type TSendForgetPasswordEmail = {
  receiverEmailAddress: string;
  receiverName: string;
  resetPasswordLink: string;
};

export const sendResetPasswordEmail = async ({
  receiverEmailAddress,
  receiverName,
  resetPasswordLink,
}: TSendForgetPasswordEmail) => {
  try {
    const data = await resend.emails.send({
      from: 'Sarthak Roy',
      to: [receiverEmailAddress],
      subject: 'Reset your password',
      react: ResetPasswordEmail({ name: receiverName, resetPasswordLink }),
      text: `Hello ${receiverName}, here is your password reset link: ${resetPasswordLink}`,
    });

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
    return {
      success: false,
      message: await JSON.stringify(error) || "Error in sending email",
    };
  }
};
