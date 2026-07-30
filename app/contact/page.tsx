"use client";

import { useRef, useState } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface ContactApiResponse {
  success: boolean;
  error?: string;
}

const DEFAULT_ERROR_MESSAGE =
  "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی و دوباره تلاش کنید.";

export default function ContactPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  // Honeypot: invisible to real users, bots that auto-fill every field trip this.
  const companyRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = "";
    if (phoneRef.current) phoneRef.current.value = "";
    if (subjectRef.current) subjectRef.current.value = "";
    if (messageRef.current) messageRef.current.value = "";
    if (companyRef.current) companyRef.current.value = "";
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      name: nameRef.current?.value.trim() || "",
      phone: phoneRef.current?.value.trim() || "",
      subject: subjectRef.current?.value.trim() || "",
      message: messageRef.current?.value.trim() || "",
      company: companyRef.current?.value.trim() || "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: ContactApiResponse | null = null;
      try {
        data = (await response.json()) as ContactApiResponse;
      } catch {
        data = null;
      }

      if (!response.ok || !data?.success) {
        setStatus("error");
        setErrorMessage(data?.error || DEFAULT_ERROR_MESSAGE);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(DEFAULT_ERROR_MESSAGE);
    }
  };

  const isSubmitting = status === "submitting";

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
            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "8px",
                  padding: "32px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
                <h3 style={{ color: "#D4AF37", fontWeight: 700, marginBottom: "8px" }}>
                  پیام شما با موفقیت ارسال شد
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "20px" }}>
                  در اسرع وقت با شما تماس خواهیم گرفت. برای پیگیری فوری‌تر می‌توانید
                  از طریق واتساپ یا شماره تلفن هم پیام بدهید.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
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
                {status === "error" && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    style={{
                      background: "rgba(220,38,38,0.08)",
                      border: "1px solid rgba(220,38,38,0.35)",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      color: "#fca5a5",
                      fontSize: "13px",
                      lineHeight: 1.8,
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>نام و نام خانوادگی</label>
                  <input
                    ref={nameRef}
                    type="text"
                    required
                    disabled={isSubmitting}
                    style={inputStyle}
                    className="contact-input"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>شماره تماس</label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    required
                    disabled={isSubmitting}
                    style={inputStyle}
                    className="contact-input"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label style={labelStyle}>موضوع پروژه</label>
                  <input
                    ref={subjectRef}
                    type="text"
                    disabled={isSubmitting}
                    style={inputStyle}
                    className="contact-input"
                  />
                </div>
                <div>
                  <label style={labelStyle}>توضیحات</label>
                  <textarea
                    ref={messageRef}
                    required
                    rows={5}
                    disabled={isSubmitting}
                    style={{ ...inputStyle, resize: "vertical" }}
                    className="contact-input"
                    placeholder="توضیح مختصری از نیاز خود بنویسید..."
                  />
                </div>

                {/* Honeypot field — hidden from sighted and screen-reader users, bots fill it anyway */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <input
                    ref={companyRef}
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting
                      ? "rgba(212,175,55,0.35)"
                      : "linear-gradient(180deg,#efd98a,#D4AF37)",
                    color: "#000",
                    fontWeight: 700,
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    marginTop: "8px",
                  }}
                >
                  {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
                </button>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                  پیام شما مستقیماً برای تیم ما ارسال می‌شود.
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

        .contact-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-input::placeholder {
          color: rgba(17, 17, 17, 0.4);
        }

        .contact-input:focus {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25);
        }

        .contact-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
  background: "#ffffff",
  border: "1px solid rgba(212,175,55,0.35)",
  borderRadius: "6px",
  padding: "12px 14px",
  color: "#111111",
  fontSize: "14px",
  outline: "none",
};
