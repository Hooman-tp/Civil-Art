"use client";

import { useEffect, useRef } from "react";
import FrameSequencePlayer, { FrameSequenceHandle } from "./FrameSequencePlayer";

const LOGO_SRC = "/images/civil-art-logo.png";

// طول واقعیِ ویدیوی منبع (ثانیه)، از ffprobe؛ چون دیگر <video> ای برای
// خواندنِ duration نداریم، این عدد را از قبل ثابت نگه می‌داریم.
const VIDEO_DURATION = 63.533333;

/*
  ارتفاع کل بخش اسکرول‌محور (شامل ۱۰۰vh استیکیِ داخلش).
*/
const SCROLL_TRACK_VH = 500;

/*
  ثابت زمانیِ نرم‌سازیِ نمایی (بر حسب ثانیه). عدد کوچیک‌تر = واکنش
  سریع‌تر/نزدیک‌تر به اسکرول خام؛ عدد بزرگ‌تر = نرم‌تر ولی با کمی
  تأخیرِ محسوس‌تر.
*/
const TIME_SMOOTHING_TAU = 0.26;

/*
  مکان هر بخش از خانه بر حسب ثانیه‌ی واقعیِ ویدیو. این اعداد از روی
  خودِ فایل construction.mp4 استخراج شدند (فریم‌برداری هر ۱ ثانیه و
  بررسی دستیِ محتوای هر بخش)، نه حدسی — یعنی با تصویر واقعی ویدیو
  منطبق است.
*/
const LOCATIONS: { time: number; label: string; eyebrow: string; description: string }[] = [
  { time: 0,  label: "ورودی", eyebrow: "01 / ARRIVAL", description: "سنگ تیره، فلز مشکی و نورپردازی خطی؛ ورودی‌ای مینیمال با تأکید بر شکوه و امنیت." },
  { time: 5,  label: "آشپزخانه و ناهارخوری", eyebrow: "02 / INTERIOR DESIGN", description: "صفحه جزیره با سنگ طبیعی، کابینت‌های مات و مبلمان چوبی با نورپردازی گرم." },
  { time: 11, label: "سینمای خانگی", eyebrow: "03 / HOME CINEMA", description: "آکوستیک کنترل‌شده، متریال تیره و نور مخفی برای تجربه‌ای عمیق و سینمایی." },
  { time: 15, label: "نشیمن", eyebrow: "04 / LIVING SPACE", description: "مبلمان معاصر، بافت‌های طبیعی و قاب‌های شیشه‌ای؛ فضایی آرام و روشن." },
  { time: 19, label: "محوطه و استخر", eyebrow: "05 / LANDSCAPE", description: "ترکیب آب، سنگ و فضای سبز در امتداد معماری؛ منظری یکپارچه و آرام." },
  { time: 28, label: "نشیمن و راهرو", eyebrow: "06 / TRANSITION", description: "خطوط معماری خالص، کف یکپارچه و نورپردازی ظریف در مسیر حرکت خانه." },
  { time: 35, label: "پلکان", eyebrow: "07 / ARCHITECTURAL DETAIL", description: "فلز ظریف و نور خطی؛ پلکانی مینیمال که به عنصر شاخص معماری تبدیل شده است." },
  { time: 45, label: "اتاق خواب اصلی", eyebrow: "08 / MASTER SUITE", description: "چوب طبیعی، پارچه‌های نرم و پالت آرام برای فضایی متعادل و خصوصی." },
  { time: 49, label: "تراس اختصاصی", eyebrow: "09 / PRIVATE TERRACE", description: "چشم‌انداز باز، مبلمان فضای باز و مرزی محو میان فضای داخلی و طبیعت." },
  { time: 53, label: "حمام و رختکن", eyebrow: "10 / PRIVATE SPA", description: "سنگ یکپارچه، شیشه و نور گرم؛ فضایی لوکس با حس آرامش یک اسپا." },
];

// نسبتی از کل مسیرِ اسکرول (نه ثانیه‌ی ویدیو) که طی آن صفحه‌ی مقدمه محو می‌شود
const INTRO_FADE_END = 0.035;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const STAR_FIELD_BG = (() => {
  const W = 1000;
  const H = 700;
  const circles: string[] = [];
  for (let i = 0; i < 170; i++) {
    const x = seededRandom(i * 12.9898) * W;
    const y = seededRandom(i * 78.233 + 7) * H;
    const r = 0.5 + seededRandom(i * 37.719 + 3) * 1.3;
    const o = 0.25 + seededRandom(i * 93.989 + 5) * 0.65;
    circles.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#F5D78E" fill-opacity="${o.toFixed(2)}"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${circles.join("")}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CinematicConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<FrameSequenceHandle>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const locationLabelRef = useRef<HTMLSpanElement>(null);
  const locationEyebrowRef = useRef<HTMLDivElement>(null);
  const locationDescriptionRef = useRef<HTMLParagraphElement>(null);
  const locationWrapRef = useRef<HTMLDivElement>(null);
  const lastLocationRef = useRef<string>(LOCATIONS[0].label);

  /*
    چرا دیگر منطقِ «آن‌لاک»/تشخیصِ نسبت‌ابعاد این‌جا نیست: با canvas،
    هیچ ویدیویی برای مدیریتِ preload/autoplay وجود ندارد (فقط تصویر
    بارگذاری می‌شود)، و تشخیصِ cover/contain داخلِ خودِ FrameSequencePlayer
    روی هر فریم محاسبه می‌شود. کل آن دسته از پیچیدگی‌ها ساختاری حذف شدند،
    نه صرفاً پنهان.
  */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId: number | null = null;
    let lastTs: number | null = null;
    let displayedTime = 0;
    let hasSyncedInitial = false;

    const getTargetProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / total));
    };

    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);

      if (lastTs === null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const p = getTargetProgress();

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${p * 100}%`;
      }

      if (introRef.current) {
        const introOpacity = Math.max(0, 1 - p / INTRO_FADE_END);
        introRef.current.style.opacity = String(introOpacity);
        introRef.current.style.pointerEvents = introOpacity <= 0.02 ? "none" : "auto";
      }

      const targetTime = p * VIDEO_DURATION;

      if (!hasSyncedInitial) {
        displayedTime = targetTime;
        hasSyncedInitial = true;
      } else {
        const alpha = 1 - Math.exp(-dt / TIME_SMOOTHING_TAU);
        displayedTime += (targetTime - displayedTime) * alpha;
      }

      playerRef.current?.setProgress(displayedTime / VIDEO_DURATION);

      // برچسبِ مکان: کدام بخش از خانه، بر اساس ثانیه‌ی واقعیِ نمایش‌داده‌شده
      let currentLabel = LOCATIONS[0].label;
      for (let i = LOCATIONS.length - 1; i >= 0; i--) {
        if (displayedTime >= LOCATIONS[i].time) { currentLabel = LOCATIONS[i].label; break; }
      }
      if (currentLabel !== lastLocationRef.current && locationLabelRef.current && locationWrapRef.current) {
        lastLocationRef.current = currentLabel;
        const currentLocation = LOCATIONS.find((location) => location.label === currentLabel) ?? LOCATIONS[0];
        locationLabelRef.current.textContent = currentLocation.label;
        if (locationEyebrowRef.current) locationEyebrowRef.current.textContent = currentLocation.eyebrow;
        if (locationDescriptionRef.current) locationDescriptionRef.current.textContent = currentLocation.description;
        if (locationWrapRef.current) locationWrapRef.current.style.opacity = "1";
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: `${SCROLL_TRACK_VH}vh`, position: "relative" }}>
      <div
        className="cinematic-sticky"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#050505",
        }}
      >
        <div
          className="cinematic-video-frame"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <FrameSequencePlayer ref={playerRef} />
        </div>

        <style>{`
          @keyframes caSpin { to { transform:rotate(360deg); } }
          @keyframes caLocFade { from { opacity:0; transform:translateX(-26px) scale(0.94); } to { opacity:1; transform:translateX(0) scale(1); } }
          @keyframes caTwinkle { 0%,100% { opacity:1; } 50% { opacity:0.72; } }
          @keyframes caChevronBounce { 0%,100% { transform:translateY(0); opacity:0.6; } 50% { transform:translateY(6px); opacity:1; } }

          /* رفع فاصله‌ی سیاه بالای فریم روی iOS Safari: نوار آدرس/تولبار پویا باعث می‌شود 100vh با ارتفاع واقعیِ قابل‌مشاهده فرق کند؛ dvh این را دقیق می‌کند */
          @supports (height: 100dvh) {
            .cinematic-sticky { height: 100dvh !important; }
          }

          @media (prefers-reduced-motion: reduce) {
            .ca-intro-stars, .ca-chevron { animation: none !important; }
          }

          @media (max-width: 768px) {
            .ca-intro-logo { height: 72px !important; margin-bottom: 24px !important; }
            .ca-intro-title { font-size: clamp(22px,7vw,30px) !important; }
            .ca-intro-sub { font-size: 12px !important; margin-top: 12px !important; }
            .ca-location-tag { bottom: 2.1rem !important; right: 1rem !important; left: auto !important; width: min(315px, calc(100vw - 2rem)) !important; text-align: right !important; } .ca-glass-card { padding: 14px 16px 15px !important; border-radius: 15px !important; }
            .ca-location-tag span { font-size: 22px !important; }
          }
        `}</style>

        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background:
              "linear-gradient(to bottom,rgba(5,5,5,0.45) 0%,rgba(5,5,5,0) 18%,rgba(5,5,5,0) 78%,rgba(5,5,5,0.5) 100%)",
          }}
        />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
          <div ref={progressFillRef} style={{ height: "100%", width: "0%", background: "linear-gradient(to left,#D4AF37,#f5e08a)" }} />
        </div>

        {/* کارت شیشه‌ای اطلاعات فضا؛ کوچک و ثابت تا روی اسکرول اثر نگذارد */}
        <div
          className="ca-location-tag"
          style={{
            position: "absolute",
            right: "3rem",
            bottom: "3.2rem",
            width: "min(390px, 34vw)",
            zIndex: 10,
            textAlign: "right",
          }}
        >
          <div
            ref={locationWrapRef}
            className="ca-glass-card"
            dir="rtl"
            style={{
              padding: "18px 22px 20px",
              border: "1px solid rgba(212,175,55,0.34)",
              borderRadius: 18,
              background: "linear-gradient(145deg, rgba(10,10,10,0.52), rgba(10,10,10,0.28))",
              backdropFilter: "blur(18px) saturate(125%)",
              WebkitBackdropFilter: "blur(18px) saturate(125%)",
              boxShadow: "0 18px 55px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div
              ref={locationEyebrowRef}
              style={{
                color: "#D4AF37",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 2.2,
                marginBottom: 7,
                direction: "ltr",
                textAlign: "right",
              }}
            >
              {LOCATIONS[0].eyebrow}
            </div>

            <span
              ref={locationLabelRef}
              style={{
                display: "block",
                color: "#fff",
                fontSize: "clamp(21px, 2.1vw, 30px)",
                fontWeight: 900,
                lineHeight: 1.35,
              }}
            >
              {LOCATIONS[0].label}
            </span>

            <p
              ref={locationDescriptionRef}
              style={{
                color: "rgba(255,255,255,0.74)",
                fontSize: 11.5,
                lineHeight: 2,
                fontWeight: 400,
                margin: "8px 0 0",
              }}
            >
              {LOCATIONS[0].description}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 7, marginTop: 13, direction: "rtl" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4AF37", boxShadow: "0 0 9px rgba(212,175,55,0.55)" }} />
              <span style={{ color: "rgba(212,175,55,0.82)", fontSize: 8.5, letterSpacing: 1.6 }}>
                CIVIL-ART / ARCHITECTURE
              </span>
            </div>
          </div>
        </div>

        <div
          ref={introRef}
          style={{
            position: "absolute", inset: 0, zIndex: 20,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 24px",
            backgroundColor: "#050505",
          }}
        >
          <div
            className="ca-intro-stars"
            style={{
              position: "absolute", inset: 0,
              backgroundImage: STAR_FIELD_BG,
              backgroundRepeat: "repeat",
              animation: "caTwinkle 6s ease-in-out infinite",
            }}
          />

          <div style={{ position: "relative" }}>
            <img
              src={LOGO_SRC}
              alt="Civil-Art"
              className="ca-intro-logo"
              style={{ height: 110, width: "auto", marginBottom: 32, display: "block", marginInline: "auto" }}
            />
            <h1
              className="ca-intro-title"
              style={{ color: "#fff", fontSize: "clamp(26px,4.5vw,48px)", fontWeight: 900, lineHeight: 1.35, maxWidth: 820, margin: "0 auto" }}
            >
              به ویلای لوکس و مدرن نزدیک شوید
            </h1>
            <p
              className="ca-intro-sub"
              style={{ color: "#D4AF37", fontSize: 14, letterSpacing: 1, marginTop: 18 }}
            >
              برای شروع اسکرول کنید
            </p>
            <div className="ca-chevron" style={{ marginTop: 20, display: "flex", justifyContent: "center", animation: "caChevronBounce 1.8s ease-in-out infinite" }}>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
