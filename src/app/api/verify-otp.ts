import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { phone, otp } = req.body;

  try {
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    if (verification_check.status === "approved") {
      res.status(200).json({ success: true, message: "OTP verified successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error: any) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
