"use client";

import { useState } from "react";

/*
  این بخش با پس‌زمینه‌ی طلاییِ توپر طراحی شده — سومین رنگ در کنار
  مشکی و سفید، تا صفحه یکنواخت نباشد و یک نقطه‌ی «پررنگ» و متمایز
  در مسیر اسکرول داشته باشد.

  نکته: فعلاً فقط پیام موفقیت محلی نشان می‌دهد. برای فعال‌سازی
  واقعی به یک سرویس خبرنامه (Mailchimp، Mailerlite و غیره) نیاز
  است.
*/
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg,#e8c96a,#D4AF37 60%,#b8912e)",
        padding: "70px 24px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#1a1a1a", marginBottom: "12px" }}>
          عضویت در خبرنامه
        </h2>
        <p style={{ color: "rgba(20,20,20,0.7)", fontSize: "14px", marginBottom: "28px" }}>
          از آخرین پروژه‌ها و مقالات تخصصی Civil-Art باخبر شوید.
        </p>

        {submitted ? (
          <div style={{ color: "#1a1a1a", fontSize: "14px", fontWeight: 700 }}>
            ✓ با تشکر! ایمیل شما ثبت شد.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              style={{
                flex: "1 1 260px",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "999px",
                padding: "12px 20px",
                color: "#111",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#111",
                color: "#D4AF37",
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              عضویت
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
