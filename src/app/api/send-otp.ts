import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { phone } = req.body;

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      });

    res.status(200).json({ success: true, status: verification.status });
  } catch (error: any) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
