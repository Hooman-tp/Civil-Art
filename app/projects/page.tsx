import { PROJECTS } from "../../lib/projectsData";
import { getProjectCover } from "../../lib/getProjectImages";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "پروژه‌ها | Civil-Art",
  description:
    "نمونه پروژه‌های اجراشده Civil-Art در حوزه‌های مسکونی، ویلا، دیزاین داخلی، محوطه‌سازی و تزئینات کلاسیک.",
};

export default function ProjectsPage() {
  const projectsWithCover = PROJECTS.map((p) => ({
    ...p,
    coverSrc: getProjectCover(p.slug),
  }));

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
          تحویل نهایی به سرانجام رسیده‌اند. برای مشاهده جزئیات کامل، روی
          دکمه‌ی «مشاهده جزئیات» بزنید یا روی عکس کلیک کنید تا بزرگ‌تر ببینید.
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
        <ProjectsClient projects={projectsWithCover} />
      </section>
    </div>
  );
}
