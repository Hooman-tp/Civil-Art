/**
 * ══════════════════════════════════════════════════════════════════
 * نظرات مشتریان
 * ══════════════════════════════════════════════════════════════════
 * ۳ نظر قبلی (که به کارفرمایان و پروژه‌های نمایشی/فرضی قدیمی اشاره
 * می‌کردند) حذف شدند. وقتی نظر واقعی از کارفرمایان داشتی، به همین
 * شکل به آرایه‌ی زیر اضافه کن:
 *
 *   { name: "نام کارفرما", role: "کارفرمای پروژه ...", text: "..." }
 *
 * تا وقتی این آرایه خالی است، کل بخش «نظرات مشتریان» به‌صورت خودکار
 * از صفحه پنهان می‌ماند (به‌جای نمایش یک بخش خالی و ناقص روی سایت).
 * ══════════════════════════════════════════════════════════════════
 */
const TESTIMONIALS: { name: string; role: string; text: string }[] = [];

/** آیکون گیومه‌ی طلایی، جایگزین کاراکتر ساده‌ی " قبلی */
function QuoteIcon() {
  return (
    <svg
      width="34"
      height="24"
      viewBox="0 0 34 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="#B8912E">
        <circle cx="6" cy="7" r="6" />
        <path d="M6 13 L1 24 L9 24 Z" />
        <circle cx="27" cy="7" r="6" />
        <path d="M27 13 L22 24 L30 24 Z" />
      </g>
    </svg>
  );
}

/*
  این بخش برخلاف بقیه‌ی سایت، پس‌زمینه‌ی سفید دارد — تصمیمی آگاهانه
  برای شکستن یکنواختی رنگ مشکی/طلایی در طول صفحه و ایجاد ریتم
  بصری. لهجه‌ی طلایی همچنان در آیکون گیومه و خط جداکننده حفظ شده تا
  هویت برند از دست نرود.
*/
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section style={{ background: "#f7f5f0", padding: "100px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: 32, height: 1, background: "#B8912E" }} />
            <span style={{ color: "#B8912E", letterSpacing: "4px", fontSize: "12px", fontWeight: 700 }}>
              نظرات مشتریان
            </span>
            <div style={{ width: 32, height: 1, background: "#B8912E" }} />
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, color: "#111" }}>
            آنچه کارفرمایان می‌گویند
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "1px",
            background: "rgba(184,145,46,0.15)",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ background: "#fff", padding: "32px 26px" }}>
              <div style={{ marginBottom: "14px" }}>
                <QuoteIcon />
              </div>
              <p
                style={{
                  color: "rgba(17,17,17,0.7)",
                  fontSize: "14px",
                  lineHeight: 1.9,
                  marginBottom: "20px",
                }}
              >
                {t.text}
              </p>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "14px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>{t.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(17,17,17,0.45)", marginTop: "2px" }}>
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
