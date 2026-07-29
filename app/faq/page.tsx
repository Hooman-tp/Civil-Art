"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "فرآیند شروع یک پروژه با Civil-Art چگونه است؟",
    a: "پس از تماس اولیه، تیم ما در یک جلسه رایگان نیازهای پروژه شما را بررسی می‌کند، سپس پیشنهاد فنی و مالی ارائه می‌شود و در صورت توافق، قرارداد و برنامه زمان‌بندی نهایی می‌گردد.",
  },
  {
    q: "آیا برای پروژه‌های کوچک هم همکاری می‌کنید؟",
    a: "بله، Civil-Art از پروژه‌های کوچک مسکونی تا پروژه‌های بزرگ زیرساختی و صنعتی را پوشش می‌دهد و متناسب با حجم کار، تیم مناسب اختصاص می‌یابد.",
  },
  {
    q: "مدت زمان معمول اجرای یک پروژه چقدر است؟",
    a: "بسته به نوع و حجم پروژه متفاوت است. برای پروژه‌های مسکونی معمولاً ۸ تا ۱۸ ماه و برای پروژه‌های بزرگ‌تر زیرساختی ممکن است بیشتر طول بکشد. زمان‌بندی دقیق در قرارداد اولیه مشخص می‌شود.",
  },
  {
    q: "آیا نظارت بر اجرای پروژه هم بر عهده شماست؟",
    a: "بله، Civil-Art علاوه بر طراحی، خدمات نظارت عالیه و مقیم کارگاهی را نیز ارائه می‌دهد تا از اجرای دقیق طبق نقشه و استاندارد اطمینان حاصل شود.",
  },
  {
    q: "هزینه مشاوره اولیه چقدر است؟",
    a: "جلسه مشاوره اولیه و بررسی امکان‌سنجی پروژه کاملاً رایگان است و هیچ تعهدی برای ادامه همکاری ایجاد نمی‌کند.",
  },
  {
    q: "آیا در شهرهای دیگر هم پروژه اجرا می‌کنید؟",
    a: "بله، تیم Civil-Art در سراسر کشور پروژه اجرا کرده و آماده همکاری در هر منطقه جغرافیایی است.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            سوالات متداول
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, marginBottom: "16px" }}>
          پاسخ به پرسش‌های رایج شما
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.9 }}>
          اگر پاسخ سوال خود را اینجا پیدا نکردید، از طریق صفحه تماس با ما در ارتباط باشید.
        </p>
      </section>

      {/* ── لیست سوالات ── */}
      <section
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 24px 120px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  background: "#0b0b0d",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: 700,
                    textAlign: "right",
                  }}
                >
                  <span>{item.q}</span>
                  <span
                    style={{
                      color: "#D4AF37",
                      fontSize: "20px",
                      flexShrink: 0,
                      marginRight: "12px",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.25s",
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "14px",
                      lineHeight: 1.9,
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
