import ForgotPasswordEmail from "../../emails/forgotPassEmail";
import { resend } from "./resend";

interface SendForgotPassEmailArgs {
  username: string;
  otp: number;
  email: string;
}

export async function sendForgotPassEmail({
  username,
  otp,
  email,
}: SendForgotPassEmailArgs) {
  try {
    await resend.emails.send({
      from: "LeetClub <service@leetclub.com>",
      to: email,
      subject: "LeetClub Forgot Password Email",
      react: ForgotPasswordEmail({ username, otp }),
    });
    return { success: true, message: "Forgot password email sent successfully." };
  } catch (emailError) {
    console.error("Error sending forgot password email:", emailError);
    return { success: false, message: "Failed to send forgot password email." };
  }
}
