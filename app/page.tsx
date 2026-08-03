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

/**
 * بافت ظریف «کاغذ نقشه‌کشی مهندسی» (blueprint grid) به‌عنوان امضای
 * بصری این صفحه — به‌جای پس‌زمینه‌ی تخت و یک‌دست قبلی، خطوط طلاییِ
 * بسیار کم‌رنگ که به هویت «مهندسی» شرکت اشاره می‌کند، بدون اینکه با
 * محتوا رقابت کند.
 */
const BLUEPRINT_GRID = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M48 0.5H0V48" fill="none" stroke="rgba(212,175,55,0.07)" stroke-width="1"/></svg>'
)}")`;

export default function Home() {
  const featuredProjects = getFeaturedProjects(6);

  return (
    <>
      <CinematicConstruction />
      <Hero />
      <QuickAccessCTA />

      {/* ── آمار سریع (مشکی + بافت نقشه‌کشی) ── */}
      <section
        style={{
          background: "#0b0b0d",
          backgroundImage: BLUEPRINT_GRID,
          backgroundRepeat: "repeat",
          borderBottom: "1px solid rgba(212,175,55,0.12)",
          padding: "70px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "20px",
          }}
        >
          <StatCard icon={<IconBuilding />} value="+۱۲۰" label="پروژه تکمیل شده" />
          <StatCard icon={<IconMedal />} value="+۱۸" label="سال تجربه" />
          <StatCard icon={<IconTeam />} value="+۶۰" label="نیروی متخصص" />
          <StatCard icon={<IconHandshake />} value="+۴۰" label="کارفرمای دائمی" />
        </div>
      </section>

      {/* ── معرفی کوتاه (سفید) ── */}
      <section
        style={{
          background: "#ffffff",
          color: "#111",
          padding: "110px 24px",
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
            margin: "0 auto 36px",
          }}
        >
          Civil-Art یک شرکت فنی و مهندسی فعال در زمینه طراحی، نظارت، مدیریت و
          اجرای پروژه‌های عمرانی، ساختمانی و صنعتی است. هدف ما ارائه راهکارهای
          مهندسی نوین و اجرای پروژه‌ها با بالاترین استانداردهای کیفیت است.
        </p>
        <Link
          href="/about"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#B8912E",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 700,
            borderBottom: "1px solid #B8912E",
            paddingBottom: "4px",
          }}
        >
          بیشتر درباره ما بخوانید
          <span aria-hidden="true">←</span>
        </Link>
      </section>

      {/* ── روند همکاری (سفید) ── */}
      <ProcessTimeline />

      {/* ── پیش‌نمایش خدمات (مشکی + بافت نقشه‌کشی) ── */}
      <section
        style={{
          background: "#0b0b0d",
          backgroundImage: BLUEPRINT_GRID,
          backgroundRepeat: "repeat",
          padding: "110px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Eyebrow text="خدمات تخصصی" />
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900 }}>
              آنچه ارائه می‌دهیم
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "24px",
            }}
          >
            <ServiceCard
              icon={<IconBuilding />}
              title="طراحی ساختمان های ویلایی - مسکونی-اداری و تجاری"
            />
            <ServiceCard icon={<IconClipboardCheck />} title="نظارت کارگاهی" />
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/services" className="btn-outline-gold">
              مشاهده همه خدمات
            </Link>
          </div>
        </div>
      </section>

      {/* ── پیش‌نمایش پروژه‌ها (مشکی) ── */}
      <section style={{ background: "#050505", padding: "110px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
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

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/projects" className="btn-outline-gold">
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

      {/* ── CTA پایانی (مشکی + بافت نقشه‌کشی) ── */}
      <section
        style={{
          background: "#0b0b0d",
          backgroundImage: BLUEPRINT_GRID,
          backgroundRepeat: "repeat",
          borderTop: "1px solid rgba(212,175,55,0.15)",
          padding: "110px 24px",
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

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div
      className="stat-card"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(212,175,55,0.15)",
        borderRadius: "16px",
        padding: "28px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ color: "#D4AF37", marginBottom: "12px", display: "flex", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ color: "#fff", fontSize: "clamp(26px,3.6vw,38px)", fontWeight: 900 }}>{value}</div>
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

function ServiceCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      className="service-card"
      style={{
        background: "#111113",
        border: "1px solid rgba(212,175,55,0.15)",
        borderRadius: "18px",
        padding: "40px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          margin: "0 auto 22px",
          borderRadius: "14px",
          background: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4AF37",
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.7 }}>{title}</h3>
    </div>
  );
}

/* ── آیکون‌های خطی سفارشی (بدون ایموجی، بدون وابستگی خارجی) ── */

function IconBuilding() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 21V7L12 3L20 7V21" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 21H21.5" strokeLinecap="round" />
      <path d="M9 21V14H15V21" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 10H8.51M15.5 10H15.51" strokeLinecap="round" />
    </svg>
  );
}

function IconClipboardCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="5" y="4" width="14" height="17" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12.5L11 14.5L15 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMedal() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5L7 22L12 19L17 22L15 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTeam() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21V19C3 16.7909 5.68629 15 9 15C12.3137 15 15 16.7909 15 19V21" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M15.5 15.2C18.2 15.6 20 17.2 20 19V21" strokeLinecap="round" />
    </svg>
  );
}

function IconHandshake() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 12L6 8L10 11L14 7L16 9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8L2 12L5 16L9 12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 9L20 5L22 8L18 13L14 10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11L12.5 13.5" strokeLinecap="round" />
    </svg>
  );
}
