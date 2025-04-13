import { IUser } from "../models/User";
import crypto from "crypto";

export const restPasswordToken = async (user: IUser) => {
  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  return resetToken;
};
