const TESTIMONIALS = [
  {
    name: "مهندس کاظمی",
    role: "کارفرمای پروژه مجتمع مسکونی آسمان",
    text: "همکاری با تیم Civil-Art از ابتدا تا تحویل کلید، همراه با دقت مهندسی و شفافیت کامل در گزارش‌دهی بود. زمان‌بندی پروژه دقیقاً طبق برنامه پیش رفت.",
  },
  {
    name: "شرکت پیمانکاری راهسازان",
    role: "همکار در پروژه پل کابلی امیرکبیر",
    text: "نظارت عالیه‌ی تیم Civil-Art در طول اجرای پروژه، کیفیت کار را تضمین کرد. ارتباط مستمر و پاسخ‌گویی سریع آن‌ها قابل تقدیر است.",
  },
  {
    name: "خانم رضوانی",
    role: "کارفرمای پروژه ویلای باغ رویا",
    text: "از طراحی اولیه تا آخرین جزئیات محوطه‌سازی، همه چیز با سلیقه و دقت بالا انجام شد. نتیجه فراتر از انتظارم بود.",
  },
];

/*
  این بخش برخلاف بقیه‌ی سایت، پس‌زمینه‌ی سفید دارد — تصمیمی آگاهانه
  برای شکستن یکنواختی رنگ مشکی/طلایی در طول صفحه و ایجاد ریتم
  بصری. لهجه‌ی طلایی همچنان در گیومه و خط جداکننده حفظ شده تا
  هویت برند از دست نرود.
*/
export default function Testimonials() {
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
              <div style={{ color: "#B8912E", fontSize: "28px", lineHeight: 1, marginBottom: "14px" }}>
                "
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
