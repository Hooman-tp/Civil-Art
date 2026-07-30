import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const RECIPIENT_EMAIL = "hooman.tp@gmail.com";
const SENDER_EMAIL = "Civil-Art | فرم تماس <onboarding@resend.dev>";

interface ContactRequestBody {
  name: string;
  phone: string;
  subject?: string;
  message: string;
  /** Honeypot field: real users never see or fill this. If it has a value, the request came from a bot. */
  company?: string;
}

type ContactResponse = { success: true } | { success: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{7,20}$/.test(phone);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  if (!process.env.RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY is not set. Add it to your environment variables."
    );
    return NextResponse.json(
      {
        success: false,
        error: "سرویس ارسال ایمیل در حال حاضر تنظیم نشده است.",
      },
      { status: 500 }
    );
  }

  let body: ContactRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const subject = body.subject?.trim() || "درخواست مشاوره از سایت";
  const message = body.message?.trim() ?? "";
  const honeypot = body.company?.trim() ?? "";

  // Honeypot triggered: silently report success to the bot without sending anything.
  if (honeypot.length > 0) {
    return NextResponse.json({ success: true });
  }

  if (!name || name.length < 2 || name.length > 100) {
    return NextResponse.json(
      { success: false, error: "نام و نام خانوادگی معتبر وارد کنید." },
      { status: 400 }
    );
  }

  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json(
      { success: false, error: "شماره تماس معتبر وارد کنید." },
      { status: 400 }
    );
  }

  if (!message || message.length < 5 || message.length > 5000) {
    return NextResponse.json(
      { success: false, error: "توضیحات پیام معتبر وارد کنید." },
      { status: 400 }
    );
  }

  if (subject.length > 200) {
    return NextResponse.json(
      { success: false, error: "موضوع پیام بیش‌ازحد طولانی است." },
      { status: 400 }
    );
  }

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: `[سایت Civil-Art] ${safeSubject}`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; background:#f5f5f5; padding:24px;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
            <div style="background:#050505;padding:20px 24px;">
              <span style="color:#D4AF37;font-weight:700;font-size:16px;">Civil-Art — پیام جدید از فرم تماس</span>
            </div>
            <div style="padding:24px;">
              <p style="margin:0 0 12px;font-size:14px;color:#111;"><strong>نام و نام خانوادگی:</strong> ${safeName}</p>
              <p style="margin:0 0 12px;font-size:14px;color:#111;"><strong>شماره تماس:</strong> ${safePhone}</p>
              <p style="margin:0 0 12px;font-size:14px;color:#111;"><strong>موضوع:</strong> ${safeSubject}</p>
              <p style="margin:16px 0 4px;font-size:13px;color:#666;">توضیحات:</p>
              <p style="margin:0;font-size:14px;color:#111;line-height:1.8;">${safeMessage}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error sending contact email:", err);
    return NextResponse.json(
      {
        success: false,
        error: "خطای غیرمنتظره‌ای رخ داد. لطفاً بعداً دوباره تلاش کنید.",
      },
      { status: 500 }
    );
  }
}
