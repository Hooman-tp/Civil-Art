import Link from "next/link";
import { PROJECTS } from "../../lib/projectsData";

export const metadata = {
  title: "پروژه‌ها | Civil-Art",
  description:
    "نمونه پروژه‌های اجراشده Civil-Art در حوزه‌های مسکونی، زیرساخت، صنعتی و آب و فاضلاب.",
};

export default function ProjectsPage() {
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
            نمونه کارها
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.25 }}>
          پروژه‌های برجسته Civil-Art
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "17px",
            lineHeight: 2,
            maxWidth: "750px",
            margin: "0 auto",
          }}
        >
          مجموعه‌ای از پروژه‌هایی که با دقت مهندسی و تعهد به کیفیت، از طراحی تا
          تحویل نهایی به سرانجام رسیده‌اند. برای مشاهده جزئیات کامل هر پروژه،
          روی آن کلیک کنید.
        </p>
      </section>

      {/* ── گرید پروژه‌ها ── */}
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
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "2px",
            background: "rgba(212,175,55,0.1)",
          }}
        >
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="project-card"
              style={{
                background: "#0b0b0d",
                aspectRatio: "4 / 3",
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                display: "block",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.12) 0%, transparent 60%)",
                }}
              />

              <div style={{ position: "absolute", bottom: 0, right: 0, left: 0, padding: "24px" }}>
                <div style={{ fontSize: "11px", color: "#D4AF37", letterSpacing: "2px", marginBottom: "8px" }}>
                  {p.tag}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>{p.name}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.8, marginBottom: "8px" }}>
                  {p.shortDesc}
                </p>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{p.year}</span>
              </div>

              {/* دکمه‌ای که فقط با hover ظاهر می‌شود */}
              <span className="view-project-btn">مشاهده جزئیات ←</span>
            </Link>
          ))}
        </div>

        <style>{`
          .project-card {
            transition: transform 0.3s ease;
          }
          .project-card:hover {
            transform: translateY(-4px);
          }
          .view-project-btn {
            position: absolute;
            top: 42%;
            left: 50%;
            transform: translate(-50%,-50%) scale(0.9);
            background: linear-gradient(180deg,#efd98a,#D4AF37);
            color: #000;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 22px;
            border-radius: 999px;
            opacity: 0;
            transition: opacity 0.25s ease, transform 0.25s ease;
            white-space: nowrap;
          }
          .project-card:hover .view-project-btn {
            opacity: 1;
            transform: translate(-50%,-50%) scale(1);
          }
        `}</style>
      </section>
    </div>
  );
}
