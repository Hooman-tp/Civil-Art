const STEPS = [
  { num: "۰۱", title: "مشاوره اولیه", desc: "بررسی رایگان نیازها و اهداف پروژه" },
  { num: "۰۲", title: "طراحی مفهومی", desc: "ارائه طرح اولیه و بررسی گزینه‌های مختلف" },
  { num: "۰۳", title: "برآورد هزینه‌ها", desc: "محاسبه دقیق بودجه و زمان‌بندی اجرا" },
  { num: "۰۴", title: "شروع عملیات اجرایی", desc: "اجرای پروژه با نظارت مستمر مهندسی" },
  { num: "۰۵", title: "تحویل پروژه", desc: "تحویل نهایی و پشتیبانی پس از تحویل" },
];

/*
  این بخش هم مثل Testimonials به‌صورت آگاهانه پس‌زمینه‌ی سفید دارد
  تا در کنار بخش‌های مشکی/طلایی، ریتم بصری صفحه شکسته شود.
*/
export default function ProcessTimeline() {
  return (
    <section style={{ background: "#ffffff", padding: "100px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ width: 32, height: 1, background: "#B8912E" }} />
            <span style={{ color: "#B8912E", letterSpacing: "4px", fontSize: "12px", fontWeight: 700 }}>
              روند همکاری
            </span>
            <div style={{ width: 32, height: 1, background: "#B8912E" }} />
          </div>
          <div style={{ color: "rgba(17,17,17,0.3)", fontSize: "11px", letterSpacing: "3px", marginBottom: "12px" }}>
            PROCESS
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, color: "#111" }}>
            از ایده تا تحویل کلید
          </h2>
        </div>

        <div className="process-grid">
          {STEPS.map((s, i) => (
            <div key={s.num} className="process-step" style={{ position: "relative", textAlign: "center" }}>
              {i < STEPS.length - 1 && <div className="process-line" />}

              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "2px solid #D4AF37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  position: "relative",
                  zIndex: 2,
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#B8912E",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                {s.num}
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px", color: "#111" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(17,17,17,0.5)", lineHeight: 1.8, maxWidth: "180px", margin: "0 auto" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <style>{`
          .process-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
          .process-line {
            position: absolute;
            top: 32px;
            right: -50%;
            width: 100%;
            height: 2px;
            background: linear-gradient(to left, rgba(184,145,46,0.35), rgba(184,145,46,0.08));
            z-index: 1;
          }
          @media (max-width: 900px) {
            .process-grid { grid-template-columns: 1fr; gap: 36px; }
            .process-line { display: none; }
          }
        `}</style>
      </div>
    </section>
  );
}
