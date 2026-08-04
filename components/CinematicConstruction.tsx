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

  const [ready, setReady]           = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  /*
    نسبت واقعی عرض/ارتفاع ویدیو (مثلاً ۱۱۷۶/۱۷۶۴). قبلاً فقط یک
    boolean (isVertical) داشتیم که کافی نبود — پایین توضیح داده شده.
  */
  const [aspect, setAspect] = useState<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const readDims = () => {
      setIsVertical(video.videoHeight > video.videoWidth);
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAspect(video.videoWidth / video.videoHeight);
      }
      setReady(true);
    };

    video.addEventListener("loadedmetadata", readDims);

    if (video.readyState >= 1 && video.videoWidth > 0) {
      readDims();
    }

    return () => video.removeEventListener("loadedmetadata", readDims);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video   = videoRef.current;
    const blur    = blurRef.current;
    if (!wrapper || !video) return;

    /*
      رفع باگ: قبلاً progress و activeStep با useState ذخیره می‌شدند،
      یعنی هر بار اسکرول، کل کامپوننت (متن، دات‌ها، نوار پیشرفت)
      re-render می‌شد. دقیقاً همان الگویی که در Header/ScrollProgress/
      BackToTop باعث تداخل با پخش ویدیو می‌شد، اینجا هم وجود داشت —
      با این تفاوت که اینجا حساس‌تر است چون مستقیم روی همان ویدیویی
      اثر می‌گذارد که داریم اسکراب می‌کنیم. الان همه‌چیز مستقیم روی
      DOM نوشته می‌شود؛ React فقط یک‌بار (روی mount) رندر می‌کند.
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

    const update = () => {
      /*
        رفع باگ بالقوه: قبلاً از wrapper.offsetTop + window.scrollY
        استفاده می‌شد. طبق تجربه‌ی قبلی پروژه، getBoundingClientRect
        روش صحیح و سازگار با Lenis است، چون مستقیم از موقعیت واقعیِ
        رندرشده‌ی المان می‌خواند و به فرضیات درباره‌ی نوع اسکرول
        (native یا شبیه‌سازی‌شده) وابسته نیست.
      */
      const rect  = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${p * 100}%`;
      }

      if (video.readyState >= 2 && video.duration) {
        video.currentTime = p * video.duration;
        if (blur && blur.readyState >= 2) blur.currentTime = video.currentTime;
      }

      let step = 0;
      for (let i = STEPS.length - 1; i >= 0; i--) {
        if (p >= STEPS[i].time) { step = i; break; }
      }
      applyActiveStep(step);
    };

    /*
      رفع باگ «سیاه می‌مونه تا اسکرول کنی»:
      قبلاً update() فقط موقع mount (که هنوز readyState ویدیو کمتر
      از ۲ است) و روی هر scroll صدا زده می‌شد. یعنی اولین باری که
      واقعاً currentTime روی یک فریم معتبر ست می‌شد، دقیقاً هم‌زمان
      با اولین اسکرول کاربر بود — نه زودتر. الان به‌محض اینکه ویدیو
      به readyState=2 برسه (رویداد loadeddata)، بدون نیاز به اسکرول
      کاربر، update() یک‌بار دیگر صدا زده می‌شود تا فریم بلافاصله
      با موقعیت فعلی اسکرول همگام شود.
    */
    /*
      رفع باگ «فیلم صفحه خانه کند شده»:
      قبلاً update() مستقیم و بدون هیچ throttle داخل رویداد scroll
      اجرا می‌شد. روی اسکرول معمولی این رویداد به‌ازای هر پیکسل چندین
      بار شلیک می‌شود (خصوصاً با تاچ‌پد که خیلی متراکم‌تر از ماوس
      رویداد می‌فرستد)، و هر بار مقداردهی video.currentTime یک seek
      واقعی روی ویدیو انجام می‌دهد — این یعنی ده‌ها seek در ثانیه که
      باعث لگ و عقب‌افتادگی فریم می‌شود. الان با requestAnimationFrame
      اجرای واقعی را به حداکثر یک‌بار در هر فریم رندر مرورگر (معمولاً
      ۶۰ بار در ثانیه) محدود می‌کنیم؛ رویدادهای اضافه‌ی بین این‌ها
      نادیده گرفته می‌شوند، بدون افت محسوس در حس همگام‌بودن با اسکرول.
    */
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    video.addEventListener("loadeddata", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("loadeddata", update);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "300vh", position: "relative" }}>
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
        {isVertical && (
          <video
            ref={blurRef}
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

        {/*
          رفع باگ اصلی «واترمارک فقط روی موبایل درست شد، روی ویندوز نه»:
          قبلاً باکس تیره‌ی پوشاننده‌ی واترمارک، مستقیماً نسبت به کل
          صفحه (100vw × 100vh) موقعیت‌دهی می‌شد (bottom:0; right:0).
          روی موبایل این تقریباً درست بود چون ویدیو کل عرض صفحه را
          می‌گرفت، اما روی دسکتاپ ویدیو فقط یک ستون باریک ۴۰٪ در وسط
          صفحه است — یعنی باکسِ «راست/پایینِ صفحه» اصلاً روی ویدیو
          نمی‌افتاد و واترمارک دیده می‌شد.
          الان یک «فریم» جدید (کانتینر زیر) دقیقاً هم‌اندازه‌ی خودِ
          ویدیوی نمایش‌داده‌شده است (همان ابعادی که قبلاً روی خودِ
          تگ video بود) و واترمارک به‌جای صفحه، داخل همین فریم و نسبت
          به گوشه‌ی خودش پوشانده می‌شود — پس چه ویدیو ۴۰٪ وسط دسکتاپ
          باشد چه تمام‌عرض موبایل، پوشش همیشه دقیقاً روی گوشه‌ی واقعی
          ویدیو می‌افتد.

          رفع باگ دوم «بالای عکس روی موبایل خالی می‌افتد»:
          قبلاً روی موبایل از object-fit:contain با ارتفاع ثابت ۱۰۰vh
          استفاده می‌شد؛ چون نسبت ابعاد گوشی با نسبت ابعاد ویدیوی
          عمودی یکی نیست، این باعث می‌شد فضای خالی (letterbox) بالا و
          پایین ویدیو بیفتد. الان به‌جای ارتفاع ثابت، از aspect-ratio
          واقعی خودِ ویدیو استفاده می‌شود؛ یعنی فریم دقیقاً هم‌اندازه‌ی
          محتوای واقعی ویدیو کشیده می‌شود (بدون فضای خالی داخلی) و در
          صفحه به‌صورت عمودی وسط‌چین می‌ماند. فضای بالا/پایینِ باقی‌مانده
          (طبیعی و لازم چون نسبت‌ابعاد فرق دارد) با همان لایه‌ی بلورِ
          پس‌زمینه (blurRef) پر می‌شود، نه با یک نوار خالیِ تیره.
        */}
        <div
          className="cinematic-video-frame"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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

          {/*
            پوشش واترمارک «Media.io AI Gen»: بخشی از خودِ پیکسل‌های
            construction.mp4 است، پس با کد قابل حذف کامل نیست — راه‌حل
            قطعی این است که همین ویدیو را بدون واترمارک دوباره export
            کنی و در public/videos/construction.mp4 جایگزین فایل فعلی
            کنی. تا آن زمان، این باکس همیشه دقیقاً گوشه‌ی پایین‌راستِ
            خودِ ویدیو (نه صفحه) را می‌پوشاند.
          */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "clamp(90px, 18vw, 190px)",
              height: "clamp(36px, 6vw, 60px)",
              zIndex: 3,
              background: "linear-gradient(135deg, rgba(5,5,5,0.97), rgba(5,5,5,0.85))",
            }}
          />
        </div>

        <style>{`
          @keyframes caFade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
          @keyframes caSpin { to { transform:rotate(360deg); } }

          .cinematic-video-frame {
            width: 40%;
            height: ${isVertical ? "108vh" : "100%"};
          }

          @media (prefers-reduced-motion: reduce) {
            .cinematic-text { animation: none !important; }
          }

          /*
            توجه: نسخه‌ی قبلی اینجا سعی می‌کرد روی موبایل با محاسبه‌ی
            aspect-ratio واقعی ویدیو، فریم را بدون هیچ crop نمایش دهد.
            همین محاسبه منشاء باگ «نوار تیره‌ی بالای فیلم» بود (توضیح
            کامل در کامنت داخل media query پایین). الان دوباره ساده و
            یکسان با دسکتاپ شد: همیشه cover و تمام کادر را پر می‌کند.
          */
          @media (max-width: 768px) {
            /*
              رفع باگ «فاصله/گپ تیره بالای فیلم روی موبایل»:
              روش قبلی سعی می‌کرد ارتفاع فریم را دقیقاً برابر
              aspect-ratio واقعی ویدیو حساب کند (calc(100vw / aspect))
              تا بدون crop نمایش داده شود. اما چون این فریم با
              top:50%/left:50% + translate(-50%,-50%) وسط‌چین است،
              هر بار که این عدد کمی کمتر از 100vh می‌شد (یا قبل از
              رسیدن aspect واقعی، برای یک لحظه undefined بود)، بالا و
              پایین فریم از پس‌زمینه‌ی #050505 خودِ wrapper پر می‌شد —
              همان نوار تیره‌ی زیر هدر که گزارش شده بود. الان روی
              موبایل هم دقیقاً مثل دسکتاپ، فریم همیشه ۱۰۰٪ عرض و ۱۰۰٪
              ارتفاعِ کانتینر (که خودش 100vh است) را با object-fit:cover
              پر می‌کند — یعنی هیچ‌وقت گپ خالی نمی‌ماند، به قیمتِ کمی
              crop در گوشه‌های ویدیوی عمودی (که قابل‌قبول‌تر از یک نوار
              تیره‌ی توپر است).
            */
            .cinematic-video-frame {
              width: 100% !important;
              height: 100% !important;
            }
            .cinematic-label-top { top: 5.5rem !important; right: 1.2rem !important; }
            .cinematic-label-top span { font-size: 10px !important; letter-spacing: 3px !important; }
            .cinematic-label-top div { width: 24px !important; }
            .cinematic-dots { left: 1rem !important; gap: 0.6rem !important; }
            .cinematic-dot-num { display: none !important; }
            .cinematic-text {
              bottom: 2rem !important;
              right: 1.2rem !important;
              left: 1.2rem !important;
              max-width: none !important;
            }
            .cinematic-text h2 { font-size: clamp(22px,7vw,32px) !important; }
            .cinematic-text p { font-size: clamp(12px,3vw,14px) !important; }
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

        {/*
          رفع باگ «مراحل ساخت پشت لوگوی هدر پنهان می‌شود»:
          هدر سایت position:fixed دارد و همیشه روی همه‌چیز (z-index:100)
          می‌نشیند. قبلاً این برچسب در top:2rem بود که دقیقاً زیر هدر و
          پشت لوگو قرار می‌گرفت. الان به‌اندازه‌ی ارتفاع واقعی هدر
          (~90px دسکتاپ / ~76px موبایل) پایین‌تر آمده و یک سایه‌ی متن
          هم گرفته تا روی تصویر روشن ویدیو هم واضح و پررنگ خوانده شود
          (قبلاً چون فقط رنگ طلایی کم‌کنتراست بود، روی فریم‌های روشن
          ویدیو کم‌رنگ به‌نظر می‌رسید).
        */}
        <div className="cinematic-label-top" style={{ position: "absolute", top: "6.5rem", right: "3rem", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 1, background: "#D4AF37", boxShadow: "0 1px 4px rgba(0,0,0,0.6)" }} />
          <span style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 5, fontWeight: 700, textShadow: "0 1px 6px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)" }}>مراحل ساخت</span>
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
          <div ref={stepIndexRef} style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 5, fontWeight: 700, marginBottom: "0.6rem" }}>
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
