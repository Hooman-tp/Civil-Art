export const metadata = {
  title: "تیم ما | Civil-Art",
  description: "آشنایی با تیم مهندسی و مدیریتی Civil-Art.",
};

const TEAM = [
  { name: "مهندس هومن تقی پور", role: "مدیرعامل و مهندس معمار", exp: "۲۰ سال تجربه" },
  { name: "مهندس محسن منصوری", role: "مدیر پروژه و نظارت اجرایی", exp: "۱۵ سال تجربه" },
  { name: "خانم مهندس فاطمه طباطبائی", role: "مهندس معمار و طراح نما", exp: "۱۲ سال تجربه" },
  { name: "مهندس نگار احمدی", role: "مهندس ژئوتکنیک", exp: "۱۰ سال تجربه" },
  { name: "مهندس رضا کریمی", role: "مهندس راه و ترابری", exp: "۱۴ سال تجربه" },
  { name: "مهندس مریم صادقی", role: "مدیر مالی و قراردادها", exp: "۱۱ سال تجربه" },
];

export default function TeamPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "70px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            تیم ما
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.25 }}>
          افرادی که پشت هر پروژه ایستاده‌اند
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
          تیمی متشکل از مهندسان مجرب که با تعهد و دقت، هر پروژه را از ایده تا
          اجرا همراهی می‌کنند.
        </p>
      </section>

      {/* ── گرید تیم ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "24px",
          }}
        >
          {TEAM.map((member) => (
            <div
              key={member.name}
              style={{
                background: "#0b0b0d",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "10px",
                padding: "36px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#D4AF37,#8a6d1f)",
                  margin: "0 auto 20px",
                }}
              />
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{member.name}</h3>
              <p style={{ color: "#D4AF37", fontSize: "13px", marginTop: "6px" }}>
                {member.role}
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "10px" }}>
                {member.exp}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
