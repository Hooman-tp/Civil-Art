import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "../../../lib/projectsData";
import type { Metadata } from "next";

// این تابع در زمان build، یک صفحه جدا برای هر پروژه (بر اساس slug) می‌سازد
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

/*
  نکته مهم: در Next.js نسخه‌های جدید (15 به بعد)، پارامتر params
  در صفحات App Router به‌صورت Promise است و باید با await خوانده
  شود. عدم رعایت این نکته باعث خطای زمان اجرا و بالا نیامدن صفحه
  می‌شود.
*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.shortDesc,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "50px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/projects"
          style={{
            color: "#D4AF37",
            fontSize: "13px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "24px",
          }}
        >
          ← بازگشت به همه پروژه‌ها
        </Link>

        <div style={{ fontSize: "12px", color: "#D4AF37", letterSpacing: "2px", marginBottom: "12px" }}>
          {project.tag} · {project.year}
        </div>

        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.25 }}>
          {project.name}
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 2, maxWidth: "800px" }}>
          {project.fullDesc}
        </p>
      </section>

      {/* ── مشخصات فنی ── */}
      <section
        style={{
          borderTop: "1px solid rgba(212,175,55,0.12)",
          borderBottom: "1px solid rgba(212,175,55,0.12)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: "24px",
          }}
        >
          {project.specs.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#D4AF37" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── گالری تصاویر پروژه (نمایشی) ── */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#D4AF37" }}>
          تصاویر پروژه
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "12px",
          }}
        >
          {Array.from({ length: project.galleryCount }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "4 / 3",
                background: "#0b0b0d",
                border: "1px solid rgba(212,175,55,0.1)",
                borderRadius: "8px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at ${30 + i * 8}% ${20 + i * 5}%, rgba(212,175,55,0.1) 0%, transparent 60%)`,
                }}
              />
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "16px" }}>
          * تصاویر واقعی این پروژه به‌زودی جایگزین خواهد شد.
        </p>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          borderTop: "1px solid rgba(212,175,55,0.12)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, marginBottom: "20px" }}>
          پروژه‌ای مشابه این دارید؟
        </h2>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            background: "linear-gradient(180deg,#efd98a,#D4AF37)",
            color: "#000",
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: "999px",
            textDecoration: "none",
          }}
        >
          دریافت مشاوره رایگان
        </Link>
      </section>
    </div>
  );
}
