"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/construction.mp4";

/*
  فریم اول ویدیو، از قبل استخراج و به‌صورت عکس ذخیره شده.
  تا وقتی مرورگر داده‌ی واقعی ویدیو را دانلود می‌کند (که روی موبایل و
  شبکه‌ی کند ممکن است چند ثانیه طول بکشد)، این عکس بلافاصله نمایش داده
  می‌شود و به‌جای صفحه‌ی سیاه، کاربر همان لحظه یک فریم واقعی می‌بیند.

  ساخت این فایل با ffmpeg:
    ffmpeg -i construction.mp4 -ss 00:00:00.000 -vframes 1 -q:v 2 construction-poster.jpg
  و قرار دادن در public/videos/construction-poster.jpg
*/
const POSTER_SRC = "/videos/construction-poster.jpg";

const STEPS = [
  { time: 0,    label: "اجرای فونداسیون", desc: "شروع از صفر، با چشمی به آینده" },
  { time: 0.15, label: "اسکلت بتنی",      desc: "پایه‌های محکم از اعماق زمین" },
  { time: 0.25, label: "اجرای دیوارها",  desc: "بنیانی که نسل‌ها بر آن خواهند ایستاد" },
  { time: 0.37, label: "اجرای نما",       desc: "شکل گرفتن رویا در آهن و فولاد" },
  { time: 0.55, label: "محوطه سازی حیات", desc: "هنر در لایه بیرونی هر سازه" },
  { time: 0.90, label: "تحویل پروژه",     desc: "لحظه‌ای که افتخار به دست می‌آید" },
];

/*
  ارتفاع کل بخش اسکرول‌محور (شامل ۱۰۰vh استیکیِ داخلش).
  این عدد مستقیماً «سرعت» حس‌شده‌ی اسکرول را کنترل می‌کند: هرچقدر
  بزرگ‌تر باشد، برای رسیدن به انتهای ویدیو باید بیشتر اسکرول کرد،
  یعنی هر پیکسل اسکرول به بازه‌ی زمانیِ کوچک‌تری از ویدیو نگاشت
  می‌شود و حرکت ویدیو کندتر و باوقارتر به‌نظر می‌رسد.
  قبلاً ۳۰۰vh بود (یعنی فقط ۲۰۰vh مسیر واقعی اسکرول)، که برای یک
  کلیپ ~۶۴ ثانیه‌ای خیلی کوتاه بود و باعث می‌شد ویدیو با یک اسکرول
  معمولی تقریباً کامل «رد» شود. ۴۵۰vh (یعنی ۳۵۰vh مسیر واقعی) این
  فاصله را تقریباً ۷۵٪ بیشتر می‌کند. اگر باز هم سریع بود، این عدد را
  بیشتر کن؛ اگر کند بود، کمترش کن.
*/
const SCROLL_TRACK_VH = 450;

/*
  ثابت زمانیِ نرم‌سازی (بر حسب ثانیه) برای رسیدن currentTime نمایش‌
  داده‌شده به currentTime هدف. این فرمول (نمایی و مبتنی بر dt واقعیِ
  بین فریم‌ها، نه یک ضریب ثابت به‌ازای هر فریم) باعث می‌شود سرعتِ
  نرم‌شدن مستقل از فریم‌ریت مانیتور کاربر باشد (۶۰Hz، ۱۲۰Hz، ۱۴۴Hz
  همه یک حس یکسان می‌دهند) — برخلاف لرپ ساده‌ی «ضرب در عدد ثابت
  در هر فریم» که روی مانیتورهای پرفریم‌ریت سریع‌تر از موبایل به‌نظر
  می‌رسد. عدد کوچیک‌تر = نرم‌تر و با تأخیر بیشتر؛ عدد بزرگ‌تر = تندتر
  و نزدیک‌تر به پرش آنی.
*/
const TIME_SMOOTHING_TAU = 0.16;

/*
  آستانه‌ی «عدم تطابق نسبت ابعاد» بین ویدیو و ویوپورت. وقتی این
  نسبت از این عدد بیشتر شود (مثلاً ویدیوی افقیِ عریض روی گوشیِ
  عمودیِ باریک)، پر کردن کادر با cover باعث برش شدید و حسِ «زوم‌شده»
  می‌شود؛ در آن حالت به‌جای cover از contain + یک لایه‌ی بلورِ
  پس‌زمینه (که خودِ همین ویدیو را با blur/تیرگی به‌عنوان پرکننده‌ی
  اطراف نشان می‌دهد) استفاده می‌کنیم تا کل فریم دیده شود، بدون نوار
  خالی/سیاه و بدون برش تهاجمی. اگر ویدیوی جدیدی با نسبت ابعاد دیگری
  جایگزین شود، این منطق خودش را با آن هماهنگ می‌کند — به هیچ breakpoint
  ثابتی وابسته نیست.
*/
const ASPECT_MISMATCH_THRESHOLD = 1.5;

export default function CinematicConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const blurRef    = useRef<HTMLVideoElement>(null);

  // نوار پیشرفت و بلوک متن/دات‌ها دیگر از طریق useState آپدیت
  // نمی‌شوند — مستقیم روی DOM نوشته می‌شوند (توضیح کامل پایین‌تر).
  const progressFillRef = useRef<HTMLDivElement>(null);
  const textBlockRef    = useRef<HTMLDivElement>(null);
  const stepIndexRef    = useRef<HTMLDivElement>(null);
  const stepTitleRef    = useRef<HTMLHeadingElement>(null);
  const stepDescRef     = useRef<HTMLParagraphElement>(null);
  const dotRefs         = useRef<Array<HTMLDivElement | null>>([]);
  const dotCircleRefs   = useRef<Array<HTMLDivElement | null>>([]);
  const dotNumberRefs   = useRef<Array<HTMLSpanElement | null>>([]);
  const activeStepRef   = useRef(0);

  const [ready, setReady] = useState(false);

  /*
    رفع درخواست «تصویر داخل سایت زوم‌شده است»:
    این زوم واقعی نبود، نتیجه‌ی این بود که قبلاً روی دسکتاپ کادرِ
    ویدیو فقط ۴۰٪ عرض صفحه (یک ستون سینمایی باریک وسط‌چین) بود و
    object-fit:cover همان ستون باریک را با برش زیاد پر می‌کرد — یعنی
    کاربر همیشه فقط یک تکه‌ی بریده‌شده و بزرگ‌نمایی‌شده از ویدیو
    می‌دید، نه کل فریم. طبق درخواست («ویدیو تمام صفحه است، برای کل
    صفحه تنظیمش کن»)، آن ستون باریک کاملاً حذف شده و فریم همیشه
    دقیقاً ۱۰۰٪ عرض و ۱۰۰٪ ارتفاعِ کانتینر استیکی را می‌گیرد.
    fitMode هم مشخص می‌کند که pr همان تمام‌صفحه با cover پر شود
    (وقتی نسبت ابعاد ویوپورت به ویدیو نزدیک است) یا با contain +
    بلور پس‌زمینه (وقتی نسبت ابعاد خیلی فرق دارد، مثل گوشی عمودی) تا
    آنجا هم برش تهاجمی/زوم کاذب رخ ندهد.
  */
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
      setReady(true);
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
    const blur    = blurRef.current;
    if (!wrapper || !video) return;

    /*
      رفع باگ: قبلاً progress و activeStep با useState ذخیره می‌شدند،
      یعنی هر بار اسکرول، کل کامپوننت (متن، دات‌ها، نوار پیشرفت)
      re-render می‌شد. الان همه‌چیز مستقیم روی DOM نوشته می‌شود؛
      React فقط یک‌بار (روی mount) رندر می‌کند.
    */
    const applyActiveStep = (nextStep: number) => {
      if (nextStep === activeStepRef.current) return;
      activeStepRef.current = nextStep;

      const data = STEPS[nextStep];

      if (stepIndexRef.current) {
        stepIndexRef.current.textContent = `${toPersian(nextStep + 1)} / ${toPersian(STEPS.length)}`;
      }
      if (stepTitleRef.current) stepTitleRef.current.textContent = data.label;
      if (stepDescRef.current) stepDescRef.current.textContent = data.desc;

      dotRefs.current.forEach((dot, i) => {
        if (dot) dot.style.opacity = i === nextStep ? "1" : "0.22";
      });
      dotCircleRefs.current.forEach((circle, i) => {
        if (!circle) return;
        const size = i === nextStep ? "10px" : "4px";
        circle.style.width = size;
        circle.style.height = size;
      });
      dotNumberRefs.current.forEach((num, i) => {
        if (num) num.style.display = i === nextStep ? "inline" : "none";
      });

      // ری‌استارت انیمیشن fade با ترفند force-reflow، بدون remount کردن DOM
      if (textBlockRef.current) {
        const el = textBlockRef.current;
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "caFade 0.5s ease forwards";
      }
    };

    /*
      رفع درخواست «سرعت اسکرول خیلی زیاده، می‌خوام خیلی نرم باشه،
      انگار خود فیلم پلی شده»:
      قبلاً currentTime مستقیماً و آنی برابر با پیشرفت خام اسکرول
      ست می‌شد — یعنی با یک تکون سریع ماوس/تاچ‌پد، ویدیو ده‌ها ثانیه
      می‌پرید و مثل اسلایدشو به‌نظر می‌رسید، نه پخش واقعی.
      الان یک حلقه‌ی requestAnimationFrame دائمی (نه وابسته به رویداد
      scroll) هر فریم موقعیت واقعی اسکرول را می‌خواند (با
      getBoundingClientRect — همان روش سازگار با Lenis که قبلاً در
      این پروژه جواب داده) و currentTimeِ «نمایش‌داده‌شده» را با یک
      میرایی نمایی (exponential smoothing، مستقل از فریم‌ریت — فرمول
      بالا در TIME_SMOOTHING_TAU) به‌سمت currentTimeِ «هدف» می‌راند.
      نتیجه: حتی یک اسکرول خیلی سریع هم به‌جای پرش آنی، مثل یک
      جلوموتور نرم و سینمایی حس می‌شود؛ و چون این حلقه دائمی است (نه
      فقط داخل هندلر scroll)، حتی در فاصله‌ی بین رویدادهای اسکرول یا
      حین شتاب‌گیری/کاهش‌شتابِ اسکرول لمسی هم پیوسته و بدون پرش ادامه
      پیدا می‌کند.
    */
    let rafId: number | null = null;
    let lastTs: number | null = null;
    let displayedTime = 0;
    let hasSyncedInitial = false;

    const getTargetProgress = () => {
      const rect  = wrapper.getBoundingClientRect();
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

      if (progressFillRef.current && !hasSyncedInitial) {
        // پیش از آماده‌شدن متادیتای ویدیو، حداقل خودِ نوار پیشرفت را با پیشرفت خام هماهنگ نگه می‌داریم
        progressFillRef.current.style.width = `${p * 100}%`;
      }

      if (!(video.readyState >= 2 && video.duration)) return;

      const targetTime = p * video.duration;

      if (!hasSyncedInitial) {
        // اولین باری که ویدیو آماده می‌شود، بدون میرایی مستقیم به فریم درست بپر (نه صفحه‌ی سیاه، نه یک انیمیشن غیرضروری اول کار)
        displayedTime = targetTime;
        hasSyncedInitial = true;
      } else {
        const alpha = 1 - Math.exp(-dt / TIME_SMOOTHING_TAU);
        displayedTime += (targetTime - displayedTime) * alpha;
      }

      video.currentTime = displayedTime;
      if (blur && blur.readyState >= 2) blur.currentTime = displayedTime;

      const displayedProgress = displayedTime / video.duration;

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${displayedProgress * 100}%`;
      }

      let step = 0;
      for (let i = STEPS.length - 1; i >= 0; i--) {
        if (displayedProgress >= STEPS[i].time) { step = i; break; }
      }
      applyActiveStep(step);
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
        {/*
          لایه‌ی بلورِ پس‌زمینه: فقط وقتی fitMode برابر contain است
          مونت می‌شود (یعنی نسبت ابعاد ویدیو و ویوپورت خیلی فرق
          دارند — معمولاً گوشی عمودی با این ویدیوی افقی). خودِ همین
          ویدیو با blur/تیرگی/کمی بزرگ‌نمایی، دور تا دورِ ویدیوی اصلیِ
          contain‌شده را پر می‌کند تا هیچ نوار خالی/سیاهی دیده نشود.
        */}
        {fitMode === "contain" && (
          <video
            ref={blurRef}
            className="cinematic-blur-bg"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              filter: "blur(30px) brightness(0.22) saturate(0.35)",
              transform: "scale(1.1)",
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
            preload="auto"
            poster={POSTER_SRC}
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: fitMode,
              objectPosition: "center",
            }}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>

        <style>{`
          @keyframes caFade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
          @keyframes caSpin { to { transform:rotate(360deg); } }

          /* رفع فاصله‌ی سیاه بالای فریم روی iOS Safari: نوار آدرس/تولبار پویا باعث می‌شود 100vh با ارتفاع واقعیِ قابل‌مشاهده فرق کند؛ dvh این را دقیق می‌کند */
          @supports (height: 100dvh) {
            .cinematic-sticky { height: 100dvh !important; }
          }

          @media (prefers-reduced-motion: reduce) {
            .cinematic-text { animation: none !important; }
          }

          @media (max-width: 768px) {
            .cinematic-label-top { top: 1rem !important; right: 1.1rem !important; }
            .cinematic-label-top span { font-size: 9px !important; letter-spacing: 2px !important; }
            .cinematic-label-top div { width: 20px !important; }
            .cinematic-dots { left: 1rem !important; gap: 0.55rem !important; }
            .cinematic-dot-num { display: none !important; }
            .cinematic-step-index { font-size: 10px !important; letter-spacing: 3px !important; margin-bottom: 0.4rem !important; }
            .cinematic-text {
              bottom: 1.75rem !important;
              right: 1.1rem !important;
              left: 1.1rem !important;
              max-width: none !important;
            }
            .cinematic-text h2 { font-size: clamp(18px,5.5vw,24px) !important; margin-bottom: 0.4rem !important; }
            .cinematic-text p { font-size: clamp(11px,2.6vw,13px) !important; line-height: 1.6 !important; }
          }
        `}</style>

        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            background:
              "linear-gradient(to bottom,rgba(5,5,5,0.6) 0%,rgba(5,5,5,0) 20%,rgba(5,5,5,0) 65%,rgba(5,5,5,0.9) 100%)",
          }}
        />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
          <div ref={progressFillRef} style={{ height: "100%", width: "0%", background: "linear-gradient(to left,#D4AF37,#f5e08a)" }} />
        </div>

        <div className="cinematic-label-top" style={{ position: "absolute", top: "2rem", right: "3rem", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 1, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 5, fontWeight: 700 }}>مراحل ساخت</span>
        </div>

        <div className="cinematic-dots" style={{ position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              style={{ display: "flex", alignItems: "center", gap: 8, opacity: i === 0 ? 1 : 0.22 }}
            >
              <div
                ref={(el) => { dotCircleRefs.current[i] = el; }}
                style={{ width: i === 0 ? 10 : 4, height: i === 0 ? 10 : 4, borderRadius: "50%", background: "#D4AF37", transition: "all 0.3s" }}
              />
              <span
                ref={(el) => { dotNumberRefs.current[i] = el; }}
                className="cinematic-dot-num"
                style={{ color: "#D4AF37", fontSize: 9, letterSpacing: 3, fontWeight: 700, display: i === 0 ? "inline" : "none" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <div
          ref={textBlockRef}
          className="cinematic-text"
          style={{
            position: "absolute", bottom: "3.5rem", right: "3rem", zIndex: 10, maxWidth: 500,
            animation: "caFade 0.5s ease forwards",
          }}
        >
          <div ref={stepIndexRef} className="cinematic-step-index" style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 5, fontWeight: 700, marginBottom: "0.6rem" }}>
            {toPersian(1)} / {toPersian(STEPS.length)}
          </div>
          <h2 ref={stepTitleRef} style={{ color: "#fff", fontSize: "clamp(28px,4.5vw,62px)", fontWeight: 900, lineHeight: 1.15, marginBottom: "0.6rem" }}>
            {STEPS[0].label}
          </h2>
          <p ref={stepDescRef} style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(13px,1vw,15px)", lineHeight: 1.8, fontWeight: 300 }}>
            {STEPS[0].desc}
          </p>
          <div style={{ width: 40, height: 2, background: "#D4AF37", marginTop: "1rem" }} />
        </div>

        {!ready && (
          <div style={{ position: "absolute", inset: 0, zIndex: 25, background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 36, height: 36, margin: "0 auto", border: "2px solid rgba(212,175,55,0.12)", borderTop: "2px solid #D4AF37", borderRadius: "50%", animation: "caSpin 0.8s linear infinite" }} />
              <p style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 4, marginTop: 14 }}>در حال بارگذاری...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function toPersian(n: number) {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}
