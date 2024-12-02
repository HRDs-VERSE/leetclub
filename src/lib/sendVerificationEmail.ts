import VerificationEmail from "../../emails/verificaitionEmail";
import { resend } from "./resend";

interface SendVerificationEmailArgs {
  username: string;
  verifyCode: number;
  email: string;
}

export async function sendVerificationEmail({
  username,
  verifyCode,
  email,
}: SendVerificationEmailArgs) {
  try {
    await resend.emails.send({
      from: "Something <support@something.com>",
      to: email,
      subject: "LeetClub Verification",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
