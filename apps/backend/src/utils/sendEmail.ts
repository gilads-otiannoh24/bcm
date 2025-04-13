import nodemailer from "nodemailer";
import { logInfo, logError } from "./logger";

interface EmailOptions {
  from?: string;
  email: string;
  subject: string;
  message: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
    });

    // Verify connection configuration
    await transporter.verify();
    logInfo("SMTP connection verified successfully");

    // Create message object
    const message = {
      from: `${process.env.FROM_NAME || "Business Card Manager"} <${
        options.from || process.env.FROM_EMAIL || process.env.SMTP_EMAIL
      }>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(message);
    logInfo(`Email sent: ${info.messageId}`);
  } catch (error) {
    logError("Error sending email", error as Error);
    throw new Error(`Email could not be sent: ${(error as Error).message}`);
  }
};

export default sendEmail;
