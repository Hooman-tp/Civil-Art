"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/construction.mp4";
const MOBILE_VIDEO_SRC = "/videos/construction-mobile-hevc.mp4";

/*
  فریم اول ویدیو، از قبل استخراج و به‌صورت عکس ذخیره شده.
  تا وقتی مرورگر داده‌ی واقعی ویدیو را دانلود می‌کند، این عکس بلافاصله
  نمایش داده می‌شود و به‌جای صفحه‌ی سیاه، کاربر همان لحظه یک فریم واقعی
  می‌بیند. همین عکس، بلورشده، به‌عنوان پرکننده‌ی پس‌زمینه در حالت
  contain هم استفاده می‌شود (توضیح کامل پایین‌تر).

  ساخت این فایل با ffmpeg:
    ffmpeg -i construction.mp4 -ss 00:00:00.000 -vframes 1 -q:v 2 construction-poster.jpg
  و قرار دادن در public/videos/construction-poster.jpg
*/
const POSTER_SRC = "/videos/construction-poster.jpg";
const LOGO_SRC = "/images/civil-art-logo.png";

/*
  ارتفاع کل بخش اسکرول‌محور (شامل ۱۰۰vh استیکیِ داخلش).
*/
const SCROLL_TRACK_VH = 500;

/*
  ثابت زمانیِ نرم‌سازیِ نمایی (بر حسب ثانیه). عدد کوچیک‌تر = واکنش
  سریع‌تر/نزدیک‌تر به اسکرول خام؛ عدد بزرگ‌تر = نرم‌تر ولی با کمی
  تأخیرِ محسوس‌تر. عمداً بدون سقفِ سختِ سرعت (rate cap) — چرا، در
  کامنتِ کنار تابعِ tick توضیح داده شده.
*/
const TIME_SMOOTHING_TAU = 0.26;

// کوچک‌تر از یک فریم ویدیو؛ برای جلوگیری از ست‌کردنِ بی‌فایده‌ی
// currentTime وقتی چیزی عملاً تغییر نکرده (کاربر ثابت مانده)
const SEEK_EPSILON = 0.008;

/*
  آستانه‌ی «عدم تطابق نسبت ابعاد» بین ویدیو (افقی، ۱۶:۹) و ویوپورت.
  رفعِ باگِ «فیلم رو گوشی زوم شده»: نسخه‌ی قبلی روی همه‌جا از cover
  استفاده می‌کرد تا مشکلِ نوارهای سیاهِ نسخه‌ی قبل‌تر از آن حل شود؛
  اما روی گوشیِ عمودیِ باریک، cover یک ویدیوی افقیِ عریض را تا حدی
  می‌بُرد که فقط برشِ مرکزیِ ~۲۶٪ عرضِ فریم دیده می‌شد — دقیقاً همان
  چیزی که «زوم‌شده» به‌نظر می‌رسید.

  دوباره تشخیصِ نسبت‌ابعاد فعاله: وقتی این نسبت از این عدد بیشتر شود
  (گوشیِ عمودی با این ویدیوی افقی)، به‌جای cover از contain استفاده
  می‌شود (کل فریم دیده می‌شود، بدون برشِ تهاجمی) و پشتش یک پرکننده‌ی
  بلورشده (یک <img> ساکن از POSTER_SRC، نه ویدیو — چون blur روی
  <video> رو iOS Safari باگ شناخته‌شده دارد) قرار می‌گیرد.
*/
const ASPECT_MISMATCH_THRESHOLD = 1.5;

/*
  مکان هر بخش از خانه بر حسب ثانیه‌ی واقعیِ ویدیو. این اعداد از روی
  خودِ فایل construction.mp4 استخراج شدند (فریم‌برداری هر ۱ ثانیه و
  بررسی دستیِ محتوای هر بخش)، نه حدسی — یعنی با تصویر واقعی ویدیو
  منطبق است.
*/
const LOCATIONS: { time: number; label: string }[] = [
  { time: 0,  label: "ورودی" },
  { time: 5,  label: "آشپزخانه و ناهارخوری" },
  { time: 11, label: "سینمای خانگی" },
  { time: 15, label: "نشیمن" },
  { time: 19, label: "محوطه و استخر" },
  { time: 28, label: "نشیمن و راهرو" },
  { time: 35, label: "پلکان" },
  { time: 45, label: "اتاق خواب اصلی" },
  { time: 49, label: "تراس اختصاصی" },
  { time: 53, label: "حمام و رختکن" },
];

// نسبتی از کل مسیرِ اسکرول (نه ثانیه‌ی ویدیو) که طی آن صفحه‌ی مقدمه محو می‌شود
const INTRO_FADE_END = 0.035;

/*
  یک تولیدکننده‌ی عددِ شبه‌تصادفیِ «قطعی» (deterministic): برای عددِ
  seed یکسان، همیشه خروجیِ یکسان می‌دهد. چرا نه Math.random ساده؟
  چون این کامپوننت روی سرور هم یک‌بار رندر می‌شود (SSR) و بعد روی
  کلاینت هم (hydration) — اگر موقعیتِ ستاره‌ها با Math.random ساخته
  می‌شد، هر بار عددی متفاوت می‌داد و React یک hydration mismatch
  گزارش می‌کرد (HTML سرور با HTML کلاینت فرق می‌کرد). با این تابع،
  سرور و کلاینت دقیقاً یک الگوی ستاره‌ی یکسان تولید می‌کنند.
*/
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/*
  آسمانِ پرستاره به‌عنوان یک SVG استاتیک (همون تکنیکِ BLUEPRINT_GRID
  که جای دیگه‌ی پروژه استفاده شده: یک الگوی SVG به‌صورت data-URI در
  background-image). عمداً DOM جداگانه برای هر ستاره ساخته نشده
  (۱۵۰+ المان با انیمیشنِ جداگانه روی موبایل هزینه‌ی رندر داره)؛ به‌جاش
  یک تصویرِ ثابت با چشمک‌زنیِ نرمِ کلی روی کل لایه.
*/
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
  const videoRef   = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const locationLabelRef = useRef<HTMLSpanElement>(null);
  const locationWrapRef = useRef<HTMLDivElement>(null);
  const lastLocationRef = useRef<string>(LOCATIONS[0].label);

  /*
    این کامنت رو به‌روز می‌کنم چون فهمیدیم مشکل فقط رو موبایله، نه
    دسکتاپ — این خودش خیلی چیز مهمی رو مشخص می‌کنه: این دقیقاً همون
    امضای یک سیاستِ شناخته‌شده‌ی iOS Safari/WebKit است، نه یک مسابقه‌ی
    hydration (که باید رو هر دو پلتفرم یکسان ظاهر می‌شد).

    iOS Safari، برای صرفه‌جویی در مصرفِ داده/باتری، preload="auto" رو
    روی یک <video> که autoplay نداره محافظه‌کارانه‌تر از دسکتاپ در نظر
    می‌گیره — و در برخی حالت‌ها واقعاً بارگذاریِ داده رو تا وقتی یک
    فراخوانیِ واقعیِ play() (نه صرفاً اسکرول) رخ نده، متوقف/لغو نگه
    می‌داره. چون ویدیوی ما muted است، این play() از نظر سیاست‌های
    autoplay مرورگرها مجاز است (autoplayِ بی‌صدا همه‌جا مجاز است).
    بلافاصله بعدش pause می‌کنیم تا چیزی به‌صورت ناخواسته «پخش» نشه —
    خودِ کنترلِ currentTime رو کدِ اسکرول انجام می‌ده، نه پخشِ خطی.

    چرا «برو یه صفحه‌ی دیگه، برگرد» قبلاً درستش می‌کرد: تپ‌کردن روی
    یک لینک یک user activation قویه که این محدودیت رو برای کلِ session
    باز می‌کنه؛ اسکرولِ صرف همیشه به همون اندازه قوی حساب نمی‌شه.
  */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let warmupTimer: ReturnType<typeof setTimeout> | null = null;

    // روی موبایل ابتدا HEVC کم‌حجم‌تر را امتحان می‌کنیم؛ اگر دستگاه/مرورگر
    // HEVC را پشتیبانی نکند، خودکار به H.264 اصلی برمی‌گردیم.
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const hevcSupported =
      typeof video.canPlayType === "function" &&
      video.canPlayType('video/mp4; codecs="hvc1"') !== "";

    const src = mobile && hevcSupported ? MOBILE_VIDEO_SRC : VIDEO_SRC;
    video.src = src;
    video.load();

    const startWarmup = () => {
      if (cancelled) return;
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }

      // فقط برای گرم‌کردن decoder/render pipeline. صفحه‌ی Intro روی آن است،
      // بنابراین کاربر حرکت خطی ویدیو را نمی‌بیند.
      warmupTimer = setTimeout(() => {
        if (!cancelled) {
          video.pause();
          video.currentTime = 0;
        }
      }, 900);
    };

    if (video.readyState >= 2) {
      startWarmup();
    } else {
      video.addEventListener("canplay", startWarmup, { once: true });
      video.addEventListener("loadeddata", startWarmup, { once: true });
    }

    return () => {
      cancelled = true;
      if (warmupTimer) clearTimeout(warmupTimer);
      video.pause();
    };
  }, []);

  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    let rafId: number | null = null;
    let lastTs = 0;
    let displayedTime = 0;
    let targetTime = 0;
    let initialized = false;
    let lastProgress = -1;
    let lastSeekTarget = -1;
    let seeking = false;
    let pendingTarget = -1;
    let renderPlayInFlight = false;
    let momentumTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTargetTime = 0;
    let direction = 0;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // روی موبایل 30fps کافی است؛ اما seek فقط زمانی ارسال می‌شود که seek
    // قبلی تمام شده باشد تا Safari صف بزرگی از seekها نسازد.
    const SEEK_EPSILON = isMobile ? 0.012 : 0.008;
    const SMOOTHING_TAU = isMobile ? 0.045 : 0.055;
    const MOMENTUM_MS = isMobile ? 230 : 170;
    const ACTIVE_PLAYBACK_RATE = 0.001;

    const getTargetProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / total));
    };

    const keepRendererAlive = () => {
      if (!video.paused || renderPlayInFlight) {
        if (!video.paused) video.playbackRate = ACTIVE_PLAYBACK_RATE;
        return;
      }

      renderPlayInFlight = true;
      video.playbackRate = ACTIVE_PLAYBACK_RATE;
      const promise = video.play();

      if (promise && typeof promise.finally === "function") {
        promise.finally(() => {
          renderPlayInFlight = false;
        }).catch(() => {
          renderPlayInFlight = false;
        });
      } else {
        renderPlayInFlight = false;
      }
    };

    const stopRendererAfterMomentum = () => {
      if (momentumTimer) clearTimeout(momentumTimer);
      momentumTimer = setTimeout(() => {
        video.pause();
        video.playbackRate = 1;
      }, MOMENTUM_MS);
    };

    const issueSeek = (time: number) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const clamped = Math.max(0, Math.min(duration - 0.001, time));

      if (seeking) {
        pendingTarget = clamped;
        return;
      }

      if (
        lastSeekTarget >= 0 &&
        Math.abs(clamped - lastSeekTarget) < SEEK_EPSILON
      ) {
        return;
      }

      seeking = true;
      pendingTarget = -1;
      lastSeekTarget = clamped;
      video.currentTime = clamped;
    };

    const onSeeked = () => {
      seeking = false;

      // فقط آخرین هدف را اعمال می‌کنیم؛ هدف‌های میانی دور ریخته می‌شوند.
      if (pendingTarget >= 0) {
        const next = pendingTarget;
        pendingTarget = -1;
        issueSeek(next);
      }
    };

    video.addEventListener("seeked", onSeeked);

    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);

      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
      lastTs = ts;

      const p = getTargetProgress();

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${p * 100}%`;
      }

      if (introRef.current) {
        const introOpacity = Math.max(0, 1 - p / INTRO_FADE_END);
        introRef.current.style.opacity = String(introOpacity);
        introRef.current.style.pointerEvents =
          introOpacity <= 0.02 ? "none" : "auto";
      }

      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0 || video.readyState < 2) {
        return;
      }

      targetTime = p * duration;

      if (!initialized) {
        displayedTime = targetTime;
        lastTargetTime = targetTime;
        initialized = true;
      } else {
        const delta = targetTime - lastTargetTime;
        if (Math.abs(delta) > 0.0005) {
          direction = delta > 0 ? 1 : -1;
        }
        lastTargetTime = targetTime;

        // smoothing فقط روی اختلاف باقی‌مانده اعمال می‌شود؛ بنابراین
        // انگشت از ویدیو جلو نمی‌افتد و reverse هم با پرش همراه نمی‌شود.
        const alpha = 1 - Math.exp(-dt / SMOOTHING_TAU);
        displayedTime += (targetTime - displayedTime) * alpha;

        // تغییر جهت: سریع‌تر به هدف جدید برگرد، بدون overshoot.
        if (
          direction !== 0 &&
          (targetTime - displayedTime) * direction < 0
        ) {
          displayedTime = targetTime;
        }
      }

      const movement = Math.abs(targetTime - displayedTime);

      if (Math.abs(p - lastProgress) > 0.000001) {
        lastProgress = p;
        keepRendererAlive();
        stopRendererAfterMomentum();
      }

      // در حالت فعال، decoder در وضعیت playing بسیار آهسته می‌ماند تا Safari
      // مسیر decode/render را رها نکند؛ اما currentTime همچنان فرمان اصلی است.
      if (!video.paused) {
        video.playbackRate = ACTIVE_PLAYBACK_RATE;
      }

      if (movement > SEEK_EPSILON) {
        issueSeek(displayedTime);
      }

      let currentLabel = LOCATIONS[0].label;
      for (let i = LOCATIONS.length - 1; i >= 0; i--) {
        if (displayedTime >= LOCATIONS[i].time) {
          currentLabel = LOCATIONS[i].label;
          break;
        }
      }

      if (
        currentLabel !== lastLocationRef.current &&
        locationLabelRef.current
      ) {
        lastLocationRef.current = currentLabel;
        locationLabelRef.current.textContent = currentLabel;
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (momentumTimer) clearTimeout(momentumTimer);
      video.removeEventListener("seeked", onSeeked);
      video.pause();
      video.playbackRate = 1;
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
        {/* پرکننده‌ی بلورشده‌ی پس‌زمینه؛ فقط وقتی fitMode برابر contain است مونت می‌شود (نسبت ابعاد ویدیو و ویوپورت خیلی فرق دارند) */}
        {fitMode === "contain" && (
          <img
            src={POSTER_SRC}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              filter: "blur(35px) brightness(0.35) saturate(0.4)",
              transform: "scale(1.15)",
              zIndex: 0,
            }}
          />
        )}

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
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            // @ts-expect-error -- React runtime supports fetchPriority (camelCase) but @types/react hasn't added it to VideoHTMLAttributes yet
            fetchPriority="high"
            poster={POSTER_SRC}
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: fitMode,
              objectPosition: "center",
            }}
          />
        </div>

        <style>{`
          @keyframes caSpin { to { transform:rotate(360deg); } }
          
          @keyframes caTwinkle { 0%,100% { opacity:1; } 50% { opacity:0.72; } }
          @keyframes caChevronBounce { 0%,100% { transform:translateY(0); opacity:0.6; } 50% { transform:translateY(6px); opacity:1; } }
          .ca-location-text { position:relative; display:block; background:linear-gradient(135deg,#fff0a8 0%,#f5d76e 24%,#d4af37 52%,#ffd95a 76%,#b8860b 100%); background-clip:text; -webkit-background-clip:text; color:transparent;  }

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
            .ca-location-tag { bottom: 2.25rem !important; right: 1.1rem !important; left: auto !important; text-align: right !important; }
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

        {/* برچسبِ مکانِ فعلی؛ محتوای متن مستقیم روی DOM آپدیت می‌شود (نه state) تا اسکرول باعثِ re-render نشود؛ انیمیشن روی wrapper اعمال می‌شود تا متن+خط زیرش با هم حرکت کنند */}
        <div
          className="ca-location-tag"
          style={{ position: "absolute", bottom: "4rem", right: "3rem", zIndex: 10, textAlign: "right" }}
        >
          <div ref={locationWrapRef}>
            <span
              ref={locationLabelRef}
              className="ca-location-text"
              style={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: 0.3,
                lineHeight: 1.2,
              }}
            >
              {LOCATIONS[0].label}
            </span>

          </div>
        </div>

        {/*
          صفحه‌ی مقدمه: لوگو + عنوان + راهنمای اسکرول، روی زمینه‌ی
          آسمانِ پرستاره. کاملاً مستقل از آماده‌بودنِ ویدیوست (به محضِ
          رندرِ کامپوننت نمایش داده می‌شود، نه بعد از لودِ ویدیو) و با
          شروعِ اسکرول محو می‌شود. اسپینرِ لودینگِ قبلی حذف شد چون این
          صفحه همان نقش را بهتر ایفا می‌کند: هم برندشده است، هم به
          کاربر می‌گوید چه‌کار کند، و در فاصله‌ای که کاربر آن را
          می‌خواند، ویدیو فرصتِ لود شدن پیدا می‌کند.
        */}
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
