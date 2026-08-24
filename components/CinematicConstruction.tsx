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

  الان دوباره تشخیصِ نسبت‌ابعاد برگشته: وقتی این نسبت از این عدد
  بیشتر شود (گوشیِ عمودی با این ویدیوی افقی)، به‌جای cover از contain
  استفاده می‌شود (کل فریم دیده می‌شود، بدون برشِ تهاجمی) و پشتش یک
  پرکننده‌ی بلورشده قرار می‌گیرد تا فضای خالیِ اطراف، سیاهِ خشک نباشد.

  تفاوتِ کلیدی با تلاشِ قبلی: آن پرکننده قبلاً یک <video> دومِ
  بلورشده (با filter:blur) بود که روی آیفونِ واقعی به‌جای بلورِ ویدیو،
  کاملاً سیاه رندر می‌شد (یک باگِ شناخته‌شده‌ی iOS Safari در ترکیبِ
  filter با <video>). الان پرکننده یک <img> بلورشده از همان
  POSTER_SRC است — یک عکسِ ساکن، نه ویدیو — که filter:blur() رویش
  در همه‌ی مرورگرها (از جمله iOS Safari) قابل‌اعتماد و بدون این باگ
  رندر می‌شود. چون این لایه فقط تزئینی/محو است (نه چیزی که باید
  هم‌زمان با اسکرول پخش شود)، یک فریمِ ثابتِ بلورشده از نظر بصری کاملاً
  کافی است.
*/
const ASPECT_MISMATCH_THRESHOLD = 1.5;

export default function CinematicConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
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

      /*
        رفع «رو رفرش، فیلم ثابته؛ باید برم یه صفحه‌ی دیگه و برگردم»:
        SmoothScroll (و Lenis داخلش) توی app/layout.tsx و فقط یک‌بار
        در کل عمر برنامه ساخته می‌شود؛ روی navigation بین صفحات دوباره
        ساخته نمی‌شود، فقط روی reload کامل. طبق کامنتِ خودِ
        hooks/useLenis.ts، نمونه‌ی Lenis روی window.__lenis در دسترسه.

        نظریه: روی یک ری‌لود کامل (بر خلاف SPA navigation که JS از قبل
        گرم است)، effect این کامپوننت ممکنه زودتر از اینکه Lenis کاملاً
        ارتفاعِ صفحه رو (که با اضافه‌شدنِ این بخشِ ۵۰۰vh‌ای عوض می‌شه)
        اندازه‌گیری کنه اجرا بشه. یک lenis.resize() صریح، درست بعد از
        اینکه ارتفاعِ نهاییِ این بخش مشخص شد (همینجا، بعد از
        loadedmetadata)، این عدم‌هماهنگی رو رفع می‌کنه، بدون اینکه به
        useLenis.ts دست بزنیم.
      */
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

      if (!(video.readyState >= 2 && video.duration)) return;

      const targetTime = p * video.duration;

      if (!hasSyncedInitial) {
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
        {fitMode === "contain" && (
          // پرکننده‌ی بلورشده‌ی پس‌زمینه — یک <img> ساکن، نه ویدیو (توضیح در کامنت بالای ASPECT_MISMATCH_THRESHOLD)
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
