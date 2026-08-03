import Link from "next/link";
import CinematicConstruction from "../components/CinematicConstruction";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import ProcessTimeline from "../components/ProcessTimeline";
import PartnersBar from "../components/PartnersBar";
import QuickAccessCTA from "../components/QuickAccessCTA";
import NewsletterSignup from "../components/NewsletterSignup";
import ProjectCard from "../components/ProjectCard";
import { getFeaturedProjects } from "../lib/projectsData";
import { getProjectCover } from "../lib/getProjectImages";

export default function Home() {
  const featuredProjects = getFeaturedProjects(6);

  return (
    <>
      <CinematicConstruction />
      <Hero />
      <QuickAccessCTA />

      {/* ── آمار سریع (مشکی) ── */}
      <section
        style={{
          background: "#0b0b0d",
          borderBottom: "1px solid rgba(212,175,55,0.12)",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          <Stat value="+۱۲۰" label="پروژه تکمیل شده" />
          <Stat value="+۱۸" label="سال تجربه" />
          <Stat value="+۶۰" label="نیروی متخصص" />
          <Stat value="+۴۰" label="کارفرمای دائمی" />
        </div>
      </section>

      {/* ── معرفی کوتاه (سفید) ── */}
      <section
        style={{
          background: "#ffffff",
          color: "#111",
          padding: "100px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <EyebrowLight text="Civil-Art" />
        <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.3, color: "#111" }}>
          مهندسی که با هنر گره خورده است
        </h2>
        <p
          style={{
            color: "rgba(17,17,17,0.6)",
            fontSize: "16px",
            lineHeight: 2,
            maxWidth: "750px",
            margin: "0 auto 32px",
          }}
        >
          Civil-Art یک شرکت فنی و مهندسی فعال در زمینه طراحی، نظارت، مدیریت و
          اجرای پروژه‌های عمرانی، ساختمانی و صنعتی است. هدف ما ارائه راهکارهای
          مهندسی نوین و اجرای پروژه‌ها با بالاترین استانداردهای کیفیت است.
        </p>
        <Link
          href="/about"
          style={{
            color: "#B8912E",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 700,
            borderBottom: "1px solid #B8912E",
            paddingBottom: "4px",
          }}
        >
          بیشتر درباره ما بخوانید ←
        </Link>
      </section>

      {/* ── روند همکاری (سفید) ── */}
      <ProcessTimeline />

      {/* ── پیش‌نمایش خدمات (مشکی) ── */}
      <section style={{ background: "#0b0b0d", padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <Eyebrow text="خدمات تخصصی" />
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900 }}>
              آنچه ارائه می‌دهیم
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "1px",
              background: "rgba(212,175,55,0.1)",
            }}
          >
            <ServiceCard icon="🏗️" title="طراحی ساختمان های ویلایی - مسکونی-اداری و تجاری" />
            <ServiceCard icon="📋" title="نظارت کارگاهی" />
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link
              href="/services"
              style={{
                display: "inline-block",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#D4AF37",
                padding: "12px 32px",
                borderRadius: "999px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              مشاهده همه خدمات
            </Link>
          </div>
        </div>
      </section>

      {/* ── پیش‌نمایش پروژه‌ها (مشکی) ── */}
      <section style={{ background: "#050505", padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <Eyebrow text="نمونه کارها" />
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900 }}>
              پروژه‌های برجسته
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "28px",
            }}
          >
            {featuredProjects.map((p) => (
              <ProjectCard
                key={p.slug}
                href={`/projects/${p.slug}`}
                coverSrc={getProjectCover(p.slug)}
                alt={p.name || p.tag || p.slug}
                title={p.name || p.slug}
                tag={p.tag || p.category}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link
              href="/projects"
              style={{
                display: "inline-block",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#D4AF37",
                padding: "12px 32px",
                borderRadius: "999px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              مشاهده همه پروژه‌ها
            </Link>
          </div>
        </div>
      </section>

      {/* ── نظرات مشتریان (سفید) ── */}
      <Testimonials />

      {/* ── همکاران و کارفرمایان (مشکی) ── */}
      <PartnersBar />

      {/* ── خبرنامه (طلایی توپر) ── */}
      <NewsletterSignup />

      {/* ── CTA پایانی (مشکی) ── */}
      <section
        style={{
          background: "#0b0b0d",
          borderTop: "1px solid rgba(212,175,55,0.15)",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, marginBottom: "20px", color: "#fff" }}>
          پروژه‌ای در ذهن دارید؟
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px", fontSize: "15px" }}>
          همین امروز با کارشناسان ما مشورت کنید — کاملاً رایگان.
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            background: "linear-gradient(180deg,#efd98a,#D4AF37)",
            color: "#000",
            fontWeight: 700,
            padding: "16px 44px",
            borderRadius: "999px",
            textDecoration: "none",
          }}
        >
          دریافت مشاوره رایگان
        </Link>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ color: "#D4AF37", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "6px", fontSize: "13px" }}>{label}</div>
    </div>
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
      <span style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "12px", fontWeight: 700 }}>{text}</span>
      <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
    </div>
  );
}

function EyebrowLight({ text }: { text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ width: 32, height: 1, background: "#B8912E" }} />
      <span style={{ color: "#B8912E", letterSpacing: "4px", fontSize: "12px", fontWeight: 700 }}>{text}</span>
      <div style={{ width: 32, height: 1, background: "#B8912E" }} />
    </div>
  );
}

function ServiceCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ background: "#0b0b0d", padding: "32px 22px", textAlign: "center" }}>
      <div style={{ fontSize: "28px", marginBottom: "14px" }}>{icon}</div>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{title}</h3>
    </div>
  );
}
