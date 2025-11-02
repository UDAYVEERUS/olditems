import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP required" }, { status: 400 });
    }

    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    if (check.status === "approved") {
      return NextResponse.json({ success: true, message: "OTP verified successfully" });
    } else {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Twilio verify OTP error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
