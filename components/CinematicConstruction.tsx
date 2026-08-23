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
  ثابت زمانیِ نرم‌سازیِ نمایی (بر حسب ثانیه). این تنها اهرمِ سرعت/
  نرمی است — از قصد هیچ سقفِ سختی روی سرعت پخش گذاشته نشده.

  توضیح یک تصمیم مهم (برای جلوگیری از تکرار یک اشتباه قبلی): نسخه‌ای
  که یک سقفِ سختِ سرعت داشت (مثلاً «حداکثر ۱.۱۵ برابر سرعت واقعی
  ویدیو») باعث می‌شد چون این ویدیو ~۶۴ ثانیه‌ست، دیدن کاملش حداقل
  ~۵۵ ثانیه اسکرولِ پیوسته طول بکشد — مهم نبود کاربر چقدر تند اسکرول
  می‌کرد. همین سقف باعث یک باگ جدی‌تر هم می‌شد: چون currentTime
  می‌توانست خیلی عقب‌تر از هدف بماند، وقتی جهت اسکرول ناگهان برعکس
  می‌شد (پایین بعد بالا)، currentTime اول باید همان «عقب‌ماندگی»ِ
  انباشته‌شده در جهت قبلی را جبران می‌کرد و همین حس «دیر اقدام کردن»
  به‌وجود می‌آورد.

  فرمول فعلی (خالص exponential smoothing، بدون سقف) این مشکل را
  ندارد: currentTime همیشه به‌سمت هدفِ لحظه‌ای می‌رود، با تأخیرِ
  کوچکِ ثابت (مقیاس‌شده با TAU)، مستقل از اینکه ویدیو چند ثانیه‌ای
  باشد یا هدف چقدر سریع تغییر کند. یعنی یک اسکرولِ تند همچنان می‌تواند
  کل ویدیو را در چند ثانیه رد کند (نه دقیقه)، و برعکس‌کردنِ جهت هم
  بلافاصله منعکس می‌شود.

  عدد کوچیک‌تر = واکنش سریع‌تر/نزدیک‌تر به اسکرول خام؛ عدد بزرگ‌تر =
  نرم‌تر ولی با کمی تأخیرِ محسوس‌تر. با شبیه‌سازیِ عددیِ چند سناریوی
  اسکرول (تند/عادی/تغییرِ ناگهانیِ جهت) روی همین ویدیوی ۶۴ثانیه‌ای،
  ۰.۲۶ نقطه‌ی تعادلِ خوبی بود: در یک اسکرولِ تندِ ۲ثانیه‌ای کل ویدیو
  در حدود ۳ ثانیه به‌طور کامل «می‌رسد»، و در تغییرِ جهت هیچ تأخیرِ
  محسوسی قبل از برگشت وجود ندارد.
*/
const TIME_SMOOTHING_TAU = 0.26;

/*
  آستانه‌ی «عدم تطابق نسبت ابعاد» بین ویدیو و ویوپورت. وقتی این نسبت
  از این عدد بیشتر شود (مثلاً ویدیوی افقیِ عریض روی گوشیِ عمودیِ
  باریک)، پر کردن کادر با cover باعث برش شدید و حسِ «زوم‌شده» می‌شود؛
  در آن حالت به‌جای cover از contain + یک لایه‌ی بلورِ پس‌زمینه
  استفاده می‌کنیم تا کل فریم دیده شود، بدون برش تهاجمی.
*/
const ASPECT_MISMATCH_THRESHOLD = 1.5;

// کوچک‌تر از یک فریم ویدیو (در ۳۰fps هر فریم ≈۰.۰۳۳ثانیه)؛ برای جلوگیری
// از ست‌کردنِ بی‌فایده‌ی currentTime وقتی چیزی عملاً تغییر نکرده (کاربر ثابت مانده)
const SEEK_EPSILON = 0.008;

export default function CinematicConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const blurRef    = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);

  /*
    رفع «تصویر زوم‌شده»: قبلاً روی دسکتاپ کادرِ ویدیو فقط ۴۰٪ عرض
    صفحه بود (یک ستون باریک وسط‌چین) و cover همان ستون باریک را با
    برش زیاد پر می‌کرد. الان فریم همیشه دقیقاً ۱۰۰٪ عرض/ارتفاعِ
    کانتینر استیکی است. fitMode هم تعیین می‌کند که تمام‌صفحه با
    cover پر شود (نسبت ابعاد ویوپورت به ویدیو نزدیک است) یا با
    contain + بلور پس‌زمینه (نسبت ابعاد خیلی فرق دارد، مثل گوشی
    عمودی با این ویدیوی افقی).
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
      if (blur && blur.readyState >= 2 && Math.abs(blur.currentTime - displayedTime) > SEEK_EPSILON) {
        blur.currentTime = displayedTime;
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
          لایه‌ی بلورِ پس‌زمینه: فقط وقتی fitMode برابر contain است
          مونت می‌شود (نسبت ابعاد ویدیو و ویوپورت خیلی فرق دارند —
          معمولاً گوشی عمودی با این ویدیوی افقی). خودِ همین ویدیو با
          blur/تیرگی دور تا دورِ ویدیوی اصلیِ contain‌شده را پر
          می‌کند تا نواری خالی/سیاه دیده نشود.
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
          @keyframes caSpin { to { transform:rotate(360deg); } }

          /* رفع فاصله‌ی سیاه بالای فریم روی iOS Safari: نوار آدرس/تولبار پویا باعث می‌شود 100vh با ارتفاع واقعیِ قابل‌مشاهده فرق کند؛ dvh این را دقیق می‌کند */
          @supports (height: 100dvh) {
            .cinematic-sticky { height: 100dvh !important; }
          }
        `}</style>

        {/*
          فقط یک گرادیانِ خیلی ملایم بالا (برای خوانا ماندن نوار
          ناوبریِ ثابتِ سایت روی ویدیو) و یک محوشدگیِ سبک پایین (برای
          گذر نرم به سکشن بعدی). هیچ متن/برچسب/دایره‌ای روی ویدیو
          نمایش داده نمی‌شود.
        */}
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
