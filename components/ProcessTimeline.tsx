const STEPS = [
  {
    num: "۰۱",
    title: "مشاوره اولیه",
    desc: "بررسی رایگان نیازها و اهداف پروژه",
    // TODO: عکس واقعی این مرحله را در public/images/process/consultation.jpg قرار بده
    image: "/images/process/consultation.jpg",
  },
  {
    num: "۰۲",
    title: "طراحی مفهومی",
    desc: "ارائه طرح اولیه و بررسی گزینه‌های مختلف",
    image: "/images/process/design.jpg",
  },
  {
    num: "۰۳",
    title: "برآورد هزینه‌ها",
    desc: "محاسبه دقیق بودجه و زمان‌بندی اجرا",
    image: "/images/process/budget.jpg",
  },
  {
    num: "۰۴",
    title: "شروع عملیات اجرایی",
    desc: "اجرای پروژه با نظارت مستمر مهندسی",
    image: "/images/process/construction.jpg",
  },
  {
    num: "۰۵",
    title: "تحویل پروژه",
    desc: "تحویل نهایی و پشتیبانی پس از تحویل",
    image: "/images/process/handover.jpg",
  },
];

/*
  بازطراحی این بخش با الهام از نمونه‌ی ارسالی (تایم‌لاین عمودی با
  عکس پس‌زمینه و فلش رو‌به‌پایین بین مراحل)، اما با پالت طلایی/مشکی
  برند Civil-Art به‌جای رنگ‌های آن نمونه.

  نکته: مسیر عکس هر مرحله در آرایه‌ی STEPS بالا مشخص شده (فایل‌های
  public/images/process/*.jpg). تا وقتی این عکس‌ها اضافه نشوند،
  هر کارت به‌جای عکس، پس‌زمینه‌ی تیره‌ی برند را نشان می‌دهد — یعنی
  چیزی نمی‌شکند، فقط عکس واقعی دیده نمی‌شود.
*/
export default function ProcessTimeline() {
  return (
    <section style={{ background: "#050505", padding: "100px 24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
            <span style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "12px", fontWeight: 700 }}>
              روند همکاری
            </span>
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "3px", marginBottom: "12px" }}>
            PROCESS
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, color: "#fff" }}>
            از ایده تا تحویل کلید
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
          {STEPS.map((s, i) => (
            <div key={s.num}>
              <div
                className="process-card"
                style={{
                  position: "relative",
                  borderRadius: "18px",
                  overflow: "hidden",
                  minHeight: "150px",
                  border: "1px solid rgba(212,175,55,0.2)",
                  backgroundColor: "#111113",
                  backgroundImage: `linear-gradient(90deg, rgba(5,5,5,0.88) 35%, rgba(5,5,5,0.35) 100%), url(${s.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  padding: "26px 28px",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    borderRadius: "50%",
                    border: "1px solid rgba(212,175,55,0.5)",
                    background: "rgba(5,5,5,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D4AF37",
                    fontWeight: 900,
                    fontSize: "14px",
                    marginLeft: "20px",
                  }}
                >
                  {s.num}
                </div>
                <div>
                  <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "6px" }}>
                    {s.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.8 }}>
                    {s.desc}
                  </p>
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "linear-gradient(180deg,#efd98a,#D4AF37)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(212,175,55,0.25)",
                    }}
                  >
                    <IconArrowDown />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 560px) {
            .process-card { padding: 20px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function IconArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 4V20M12 20L6 14M12 20L18 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
