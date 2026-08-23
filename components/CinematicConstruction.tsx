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

/*
  ارتفاع کل بخش اسکرول‌محور (شامل ۱۰۰vh استیکیِ داخلش). عدد بزرگ‌تر
  یعنی برای رسیدن به انتهای ویدیو باید بیشتر اسکرول کرد؛ عدد
  کوچیک‌تر یعنی هر پیکسل اسکرول به بازه‌ی زمانیِ بزرگ‌تری از ویدیو
  نگاشت می‌شود.
*/
const SCROLL_TRACK_VH = 500;

/*
  ثابت زمانیِ نرم‌سازیِ نمایی (بر حسب ثانیه). عدد کوچیک‌تر = واکنش
  سریع‌تر/نزدیک‌تر به اسکرول خام؛ عدد بزرگ‌تر = نرم‌تر ولی با کمی
  تأخیرِ محسوس‌تر.
*/
const TIME_SMOOTHING_TAU = 0.26;

// کوچک‌تر از یک فریم ویدیو (در ۳۰fps هر فریم ≈۰.۰۳۳ثانیه)؛ برای جلوگیری
// از ست‌کردنِ بی‌فایده‌ی currentTime وقتی چیزی عملاً تغییر نکرده (کاربر ثابت مانده)
const SEEK_EPSILON = 0.008;

export default function CinematicConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => setReady(true);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    if (video.readyState >= 1) onLoadedMetadata();

    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video   = videoRef.current;
    if (!wrapper || !video) return;

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

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${p * 100}%`;
      }

      if (!(video.readyState >= 2 && video.duration)) return;

      const targetTime = p * video.duration;

      if (!hasSyncedInitial) {
        // اولین باری که ویدیو آماده می‌شود، بدون میرایی مستقیم به فریم درست بپر
        displayedTime = targetTime;
        hasSyncedInitial = true;
      } else {
        const alpha = 1 - Math.exp(-dt / TIME_SMOOTHING_TAU);
        displayedTime += (targetTime - displayedTime) * alpha;
      }

      if (Math.abs(video.currentTime - displayedTime) > SEEK_EPSILON) {
        video.currentTime = displayedTime;
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
        {/*
          رفع باگِ نوارهای سیاه بالا/پایینِ ویدیو روی موبایل:
          نسخه‌ی قبلی وقتی نسبت‌ابعادِ ویدیوی افقی با گوشیِ عمودی خیلی
          فرق می‌کرد، به‌جای cover از contain + یک لایه‌ی ویدیوی دومِ
          بلورشده (به‌عنوان پرکننده‌ی پس‌زمینه) استفاده می‌کرد. روی
          آیفونِ واقعی، آن لایه‌ی دوم به‌جای بلورِ ویدیو، کاملاً سیاه
          رندر می‌شد — یک باگ شناخته‌شده در iOS Safari جایی که
          filter:blur() روی <video> با پایپ‌لاینِ کامپوزیت هاردویِ
          ویدیو تداخل پیدا می‌کند و به‌جای فریمِ بلورشده، سیاه نشان
          می‌دهد. همین، آن فضاهای خالی/سیاهِ بزرگ بالا و پایینِ ویدیو
          را ایجاد می‌کرد.

          راه‌حل: کل آن لایه‌ی دوم حذف شد. الان روی همه‌ی صفحه‌ها
          (موبایل و دسکتاپ) از یک cover ساده و تمام‌صفحه استفاده
          می‌شود — دقیقاً همان خواسته‌ی اصلی («تمام صفحه»)، بدون
          پیچیدگیِ یک لایه‌ی ویدیوی دومِ ناپایدار. تاوانش این است که
          روی گوشیِ خیلی باریک/عمودی، فقط بخش مرکزیِ فریم دیده می‌شود
          (چون ویدیو افقی است)، ولی چون فیلم عمداً با فوکوس روی
          مسیر/فضای مرکزی فیلم‌برداری شده، این کراپ در عمل قابل‌قبول
          به‌نظر می‌رسد — و مطمئناً بهتر از نوار سیاهِ خراب‌شده‌ی قبلی
          است.
        */}
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
              objectFit: "cover",
              objectPosition: "center",
            }}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>

        <style>{`
          @keyframes caSpin { to { transform:rotate(360deg); } }

          /* رفع فاصله‌ی سیاه بالای فریم روی iOS Safari: نوار آدرس/تولبار پویا باعث می‌شود 100vh با ارتفاع واقعیِ قابل‌مشاهده فرق کند؛ dvh این را دقیق می‌کند */
          @supports (height: 100dvh) {
            .cinematic-sticky { height: 100dvh !important; }
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
