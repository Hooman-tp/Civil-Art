"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/construction.mp4";

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
    // src/preload روی خود <video> تعریف شده؛ اینجا فقط decoder را
    // برای Safari آماده می‌کنیم.
    const unlockPromise = video.play();
    if (unlockPromise && typeof unlockPromise.then === "function") {
      unlockPromise
        .then(() => video.pause())
        .catch(() => {
          // اگه مرورگر حتی muted-autoplay رو هم اجازه نده، مشکلی نیست؛
          // فقط یعنی این unlock جواب نداده، بدون کرش‌کردنِ برنامه
        });
    }
  }, []);

  /*
    اقدام احتیاطی (defensive): اگه به هر دلیلی — شبکه، مرورگر خاص،
    شرایطی که من نتونستم توی محیط تستم شبیه‌سازی کنم — بارگذاریِ
    ویدیو گیر کرد و هیچ‌وقت حتی یک بایت هم نگرفت (NETWORK_NO_SOURCE)،
    یک تلاشِ دوباره‌ی خودکار انجام می‌شه. اگه ویدیو عادی لود بشه، این
    شرط هیچ‌وقت true نمی‌شه و کاملاً بی‌اثره — هیچ ضرری نداره.
  */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const NETWORK_NO_SOURCE = 3;
    const timer = setTimeout(() => {
      if (video.readyState === 0 && video.networkState === NETWORK_NO_SOURCE) {
        video.load();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const recomputeFitMode = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const videoAspect    = video.videoWidth / video.videoHeight;
      const viewportAspect = window.innerWidth / window.innerHeight;
      const mismatch =
        Math.max(videoAspect, viewportAspect) / Math.min(videoAspect, viewportAspect);
      setFitMode(mismatch > ASPECT_MISMATCH_THRESHOLD ? "contain" : "cover");
    };

    const onLoadedMetadata = () => {
      recomputeFitMode();
      requestAnimationFrame(() => {
        (window as unknown as { __lenis?: { resize?: () => void } }).__lenis?.resize?.();
      });
    };

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recomputeFitMode, 150);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    if (video.readyState >= 1 && video.videoWidth > 0) {
      onLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video   = videoRef.current;
    if (!wrapper || !video) return;

    let rafId: number | null = null;
    let lastTs: number | null = null;
    let displayedTime = 0;
    let hasSyncedInitial = false;
    let lastProgress = -1;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    let playRequestInFlight = false;

    /*
      iOS Safari/WebKit روی بعضی ویدیوها وقتی video کاملاً paused است،
      تغییر سریع currentTime را انجام می‌دهد اما همیشه فریم جدید را فوراً
      روی صفحه repaint نمی‌کند. هنگام حرکت اسکرول، ویدیو را موقتاً در حالت
      play نگه می‌داریم و currentTime را با اسکرول سینک می‌کنیم؛ بلافاصله
      بعد از توقف اسکرول دوباره pause می‌شود.
    */
    const keepVideoRendering = () => {
      if (!video.paused || playRequestInFlight) return;
      playRequestInFlight = true;
      const promise = video.play();
      if (promise && typeof promise.then === "function") {
        promise
          .catch(() => {
            // اگر مرورگر play را رد کرد، seek استاندارد همچنان ادامه دارد.
          })
          .finally(() => {
            playRequestInFlight = false;
          });
      } else {
        playRequestInFlight = false;
      }
    };

    const schedulePause = () => {
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        video.pause();
      }, 140);
    };

    const getTargetProgress = () => {
      const rect  = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / total));
    };

    /*
      چرا بدون سقفِ سختِ سرعت: یک نسخه‌ی قبلی، سرعتِ پخش را به یک
      عددِ ثابت (مثلاً حداکثر ۱.۱۵ برابر سرعتِ واقعی) محدود می‌کرد.
      چون این ویدیو ~۶۴ ثانیه‌ست، آن سقف باعث می‌شد دیدنِ کاملش حداقل
      ~۵۵ ثانیه اسکرولِ پیوسته لازم داشته باشد (صرف‌نظر از سرعتِ دستِ
      کاربر) و برعکس‌کردنِ ناگهانیِ جهتِ اسکرول را هم دیر/کند می‌کرد.
      فرمولِ فعلی (خالص exponential smoothing) این مشکل را ندارد.
    */
    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);

      if (lastTs === null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const p = getTargetProgress();

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${p * 100}%`;
      }

      // محو شدنِ صفحه‌ی مقدمه، فقط بر اساسِ پیشرفتِ خامِ اسکرول (نه آماده‌بودنِ ویدیو)
      if (introRef.current) {
        const introOpacity = Math.max(0, 1 - p / INTRO_FADE_END);
        introRef.current.style.opacity = String(introOpacity);
        introRef.current.style.pointerEvents = introOpacity <= 0.02 ? "none" : "auto";
      }

      if (!(video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0)) {
        return;
      }

      const targetTime = p * video.duration;
      const progressMoved = Math.abs(p - lastProgress) > 0.00001;

      if (progressMoved) {
        lastProgress = p;
        keepVideoRendering();
        schedulePause();
      }

      if (!hasSyncedInitial) {
        displayedTime = targetTime;
        hasSyncedInitial = true;
      } else {
        const alpha = 1 - Math.exp(-dt / TIME_SMOOTHING_TAU);
        displayedTime += (targetTime - displayedTime) * alpha;
      }

      if (Math.abs(video.currentTime - displayedTime) > SEEK_EPSILON) {
        if (typeof video.fastSeek === "function") {
          video.fastSeek(displayedTime);
        } else {
          video.currentTime = displayedTime;
        }
      }

      // برچسبِ مکان: کدام بخش از خانه، بر اساس ثانیه‌ی واقعیِ نمایش‌داده‌شده
      let currentLabel = LOCATIONS[0].label;
      for (let i = LOCATIONS.length - 1; i >= 0; i--) {
        if (displayedTime >= LOCATIONS[i].time) { currentLabel = LOCATIONS[i].label; break; }
      }
      if (currentLabel !== lastLocationRef.current && locationLabelRef.current && locationWrapRef.current) {
        lastLocationRef.current = currentLabel;
        locationLabelRef.current.textContent = currentLabel;
        const wrap = locationWrapRef.current;
        wrap.style.animation = "none";
        void wrap.offsetWidth;
        wrap.style.animation = "caLocFade 0.55s cubic-bezier(0.16,1,0.3,1) forwards";
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (pauseTimer) clearTimeout(pauseTimer);
      video.pause();
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
            src={VIDEO_SRC}
            muted
            autoPlay
            playsInline
            preload="auto"
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
          @keyframes caLocFade { 0% { opacity:0; transform:translate3d(34px,0,0) scale(0.96); filter:blur(7px); } 55% { opacity:0.82; filter:blur(1.5px); } 100% { opacity:1; transform:translate3d(0,0,0) scale(1); filter:blur(0); } }
          @keyframes caTwinkle { 0%,100% { opacity:1; } 50% { opacity:0.72; } }
          @keyframes caChevronBounce { 0%,100% { transform:translateY(0); opacity:0.6; } 50% { transform:translateY(6px); opacity:1; } }
          .ca-location-text { position:relative; display:block; background:linear-gradient(135deg,#ffffff 15%,#f5e08a 52%,#d4af37 100%); background-clip:text; -webkit-background-clip:text; color:transparent; text-shadow:0 3px 22px rgba(0,0,0,0.72); filter:drop-shadow(0 0 10px rgba(212,175,55,0.12)); }
          .ca-location-text::after { content:""; position:absolute; right:0; bottom:-8px; width:34px; height:2px; border-radius:99px; background:linear-gradient(to left,#f5e08a,#d4af37); box-shadow:0 0 12px rgba(212,175,55,0.45); opacity:0.9; }

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
            .ca-location-tag span { font-size: 22px !important; } .ca-location-text::after { bottom: -6px; width: 28px; }
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
