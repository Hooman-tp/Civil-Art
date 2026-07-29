"use client";

import { useState, useRef } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  /*
    ══════════════════════════════════════════════════════════
    نکته مهم: این فرم فعلاً به هیچ سرویس ایمیل واقعی وصل نیست
    (چون هیچ API key یا سرویس بک‌اندی تنظیم نشده). به‌جای نمایش
    یک پیام موفقیت دروغین که هیچ پیامی واقعاً ارسال نمی‌کند، این
    فرم مستقیماً برنامه‌ی ایمیل پیش‌فرض کاربر (Gmail، Outlook و
    غیره) را با اطلاعات فرم از پیش پر می‌کند و باز می‌کند — دقیقاً
    مثل دکمه‌ی واتساپ، بدون نیاز به هیچ تنظیمات یا هزینه‌ی سرویس.

    اگر بعداً خواستی این فرم به‌صورت خودکار (بدون باز شدن ایمیل)
    مستقیم به inbox ارسال شود، باید یک سرویس مثل Web3Forms،
    Formspree یا Resend را تنظیم کنی و اینجا یک fetch به API آن
    سرویس اضافه شود.
    ══════════════════════════════════════════════════════════
  */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value || "";
    const phone = phoneRef.current?.value || "";
    const subject = subjectRef.current?.value || "درخواست مشاوره از سایت";
    const message = messageRef.current?.value || "";

    const body = `نام: ${name}\nشماره تماس: ${phone}\n\nپیام:\n${message}`;

    const mailtoLink = `mailto:hooman.tp@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span
            style={{
              color: "#D4AF37",
              letterSpacing: "5px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            تماس با ما
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1
          style={{
            fontSize: "clamp(30px,5vw,52px)",
            fontWeight: 900,
            marginBottom: "20px",
            lineHeight: 1.25,
          }}
        >
          پروژه‌ای دارید؟ بیایید صحبت کنیم
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "17px",
            lineHeight: 2,
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          برای مشاوره رایگان اولیه با ما تماس بگیرید. کارشناسان ما در اسرع وقت
          پاسخگوی شما هستند.
        </p>
      </section>

      {/* ── فرم + اطلاعات تماس ── */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            background: "#0b0b0d",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "12px",
            padding: "48px",
          }}
          className="contact-grid"
        >
          {/* ستون اطلاعات */}
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              با تیم ما صحبت کنید
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                lineHeight: 1.9,
                marginBottom: "32px",
              }}
            >
              فرم را پر کنید یا مستقیماً از راه‌های زیر با ما در ارتباط باشید.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <ContactRow icon="📍" label="آدرس" value="آدرس در حال تکمیل" />
              <ContactRow icon="📞" label="تلفن" value="۰۹۱۲-۹۲۴۵۶۶۴" link="tel:09129245664" />
              <ContactRow icon="✉️" label="ایمیل" value="hooman.tp@gmail.com" link="mailto:hooman.tp@gmail.com" />
              <ContactRow icon="🕐" label="ساعات کاری" value="شنبه تا چهارشنبه، ۸ الی ۱۷" />
              <ContactRow icon="📷" label="اینستاگرام" value="hooman_tp" link="https://instagram.com/hooman_tp" />
              <ContactRow icon="✈️" label="تلگرام" value="۰۹۱۲-۹۲۴۵۶۶۴" link="https://t.me/09129245664" />
            </div>
          </div>

          {/* ستون فرم */}
          <div>
            {submitted ? (
              <div
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>✉️</div>
                <h3 style={{ color: "#D4AF37", fontWeight: 700, marginBottom: "8px" }}>
                  برنامه ایمیل شما باز شد
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "20px" }}>
                  اگر برنامه ایمیل باز نشد، می‌توانید مستقیم پیام را از طریق واتساپ یا شماره
                  تلفن ارسال کنید.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(212,175,55,0.4)",
                    color: "#D4AF37",
                    padding: "10px 24px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>نام و نام خانوادگی</label>
                  <input ref={nameRef} type="text" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>شماره تماس</label>
                  <input ref={phoneRef} type="tel" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>موضوع پروژه</label>
                  <input ref={subjectRef} type="text" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>توضیحات</label>
                  <textarea
                    ref={messageRef}
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="توضیح مختصری از نیاز خود بنویسید..."
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(180deg,#efd98a,#D4AF37)",
                    color: "#000",
                    fontWeight: 700,
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    marginTop: "8px",
                  }}
                >
                  ارسال پیام از طریق ایمیل
                </button>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                  با کلیک روی دکمه، برنامه ایمیل شما با پیام آماده باز می‌شود.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            padding: 28px !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  link,
}: {
  icon: string;
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          background: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "12px", color: "#D4AF37", marginBottom: "2px" }}>{label}</div>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
          >
            {value}
          </a>
        ) : (
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{value}</div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "rgba(255,255,255,0.5)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#151515",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  padding: "12px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
};
