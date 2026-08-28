import Link from "next/link";
import type { ReactNode } from "react";
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
import { BLUEPRINT_GRID } from "../lib/backgroundPatterns";
import CinematicStatsSection from "../components/cinematic/CinematicStatsSection";

export default function Home() {
  const featuredProjects = getFeaturedProjects(6);

  return (
    <>
      <CinematicConstruction />
      <Hero />
      <QuickAccessCTA />

      {/* ── آمار سریع (حالا با پس‌زمینه‌ی سه‌بعدیِ سینمایی؛ محتوا/اعداد دقیقاً همان قبلی) ── */}
      <CinematicStatsSection
        stats={[
          { icon: <IconBuilding />, value: "+۲۷", label: "پروژه تکمیل شده" },
          { icon: <IconMedal />, value: "+۲۰", label: "سال تجربه" },
          { icon: <IconTeam />, value: "+۶۰", label: "نیروی متخصص" },
        ]}
      />

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

      {/* ── پیش‌نمایش خدمات (مشکی + بافت نقشه‌کشی + قاب کنگره‌ای) ── */}
      <section
        style={{
          background: "#0b0b0d",
          backgroundImage: BLUEPRINT_GRID,
          backgroundRepeat: "repeat",
          padding: "90px 24px 110px",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SectionTab icon={<IconBuilding />} title="خدمات تخصصی" subtitle="SERVICES" />
          </div>

          <div
            style={{
              border: "1px solid rgba(212,175,55,0.18)",
              borderRadius: "26px",
              background: "rgba(255,255,255,0.015)",
              padding: "52px 32px 40px",
            }}
          >
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

            <div style={{ textAlign: "center", marginTop: "44px" }}>
              <Link href="/services" className="btn-outline-gold">
                مشاهده همه خدمات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── پیش‌نمایش پروژه‌ها (مشکی + قاب کنگره‌ای) ── */}
      <section style={{ background: "#050505", padding: "90px 24px 110px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SectionTab icon={<IconGallery />} title="نمونه کارها" subtitle="PROJECTS" />
          </div>

          <div
            style={{
              border: "1px solid rgba(212,175,55,0.18)",
              borderRadius: "26px",
              background: "rgba(255,255,255,0.015)",
              padding: "52px 24px 44px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: "40px 28px",
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

            <div style={{ textAlign: "center", marginTop: "44px" }}>
              <Link href="/projects" className="btn-outline-gold">
                مشاهده همه پروژه‌ها
              </Link>
            </div>
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

/* ── بلوک‌های ساختاری ── */

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

/**
 * برچسب کنگره‌ای (section tab) — امضای بصری این نسخه از صفحه‌ی اصلی:
 * یک برچسب معلق، شبیه زبانه‌ی پوشه، که از بالای هر پنل قاب‌دار آویزان
 * است. الهام‌گرفته از ساختار سایت مرجعی که فرستادی، اما با پالت
 * طلایی/مشکی برند Civil-Art (نه رنگ‌های آن سایت).
 */
function SectionTab({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="section-tab">
      <div style={{ color: "#D4AF37", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
        {icon}
      </div>
      <div style={{ color: "#fff", fontWeight: 900, fontSize: "14px" }}>{title}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "1.5px", marginTop: "2px" }}>
        {subtitle}
      </div>
    </div>
  );
}

function ServiceCard({ icon, title }: { icon: ReactNode; title: string }) {
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

function IconGallery() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
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
