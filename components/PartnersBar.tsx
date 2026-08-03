/*
  نوار «همکاران و کارفرمایان» — یک ابزار اعتمادسازی رایج در
  سایت‌های شرکتی که نشان می‌دهد با چه سازمان‌ها/نهادهایی همکاری
  شده است.

  فعلاً به‌جای لوگوی واقعی، نام سازمان‌ها به‌صورت متنی نمایش داده
  می‌شود. وقتی لوگوی واقعی کارفرمایان/همکاران را داشتی، می‌توانی
  هر <span> را با یک <img> جایگزین کنی.
*/
const PARTNERS = [
  "سازمان نظام مهندسی",
  "شهرداری تهران",
  "بانک ملی ایران",
  "وزارت راه و شهرسازی",
  "سازمان برنامه و بودجه",
];

export default function PartnersBar() {
  return (
    <section
      style={{
        background: "#0b0b0d",
        borderTop: "1px solid rgba(212,175,55,0.1)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        padding: "50px 24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ color: "#D4AF37", letterSpacing: "3px", fontSize: "12px", fontWeight: 700 }}>
            همکاران و کارفرمایان
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: "18px",
          }}
        >
          {PARTNERS.map((p) => (
            <div
              key={p}
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "18px 12px",
                textAlign: "center",
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
