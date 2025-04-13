import sendEmail from "./sendEmail";
import { IUser } from "../models/User";
import { Activity } from "../models/Activity";

interface SendResetPasswordEmailOptions {
  user: IUser;
  resetToken: string;
  ip: string;
  userAgent?: string;
}

export const sendResetPasswordEmail = async ({
  user,
  resetToken,
  ip,
  userAgent,
}: SendResetPasswordEmailOptions) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the link below: \n\n ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: "Password reset token",
    message,
  });

  await Activity.create({
    user: user._id,
    type: "user_forgot_password",
    details: `User ${user.firstName} ${user.lastName} requested a password reset`,
    relatedUser: user._id,
    ip,
    userAgent,
  });
};
