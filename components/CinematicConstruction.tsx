"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/construction.mp4";

const STEPS = [
  { time: 0,    label: "اجرای فونداسیون",        desc: "شروع از صفر، با چشمی به آینده" },
  { time: 0.15, label: "اسکلت بتنی",        desc: "پایه‌های محکم از اعماق زمین" },
  { time: 0.25, label: "اجرای دیوارها", desc: "بنیانی که نسل‌ها بر آن خواهند ایستاد" },
  { time: 0.37, label: "اجرای نما",      desc: "شکل گرفتن رویا در آهن و فولاد" },
  { time: 0.55, label: "محوطه سازی حیات",        desc: "هنر در لایه بیرونی هر سازه" },
  { time: 0.90, label: "تحویل پروژه",      desc: "لحظه‌ای که افتخار به دست می‌آید" },
];

export default function CinematicConstruction() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const blurRef    = useRef<HTMLVideoElement>(null);

  const [progress, setProgress]     = useState(0);
  const [ready, setReady]           = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMeta = () => {
      setIsVertical(video.videoHeight > video.videoWidth);
      setReady(true);
    };

    video.addEventListener("loadedmetadata", onLoadedMeta);

    // اگر ویدیو از قبل (قبل از mount شدن listener) آماده بوده باشد
    if (video.readyState >= 1 && video.videoWidth > 0) {
      setIsVertical(video.videoHeight > video.videoWidth);
      setReady(true);
    }

    return () => video.removeEventListener("loadedmetadata", onLoadedMeta);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video   = videoRef.current;
    const blur    = blurRef.current;
    if (!wrapper || !video) return;

    const update = () => {
      const top   = wrapper.offsetTop;
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const p = Math.max(0, Math.min(1, (window.scrollY - top) / total));
      setProgress(p);

      if (video.readyState >= 2 && video.duration) {
        video.currentTime = p * video.duration;
        if (blur && blur.readyState >= 2) blur.currentTime = video.currentTime;
      }

      let step = 0;
      for (let i = STEPS.length - 1; i >= 0; i--) {
        if (p >= STEPS[i].time) { step = i; break; }
      }
      setActiveStep(step);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  const step = STEPS[activeStep];

  return (
    <div ref={wrapperRef} style={{ height: "300vh", position: "relative" }}>
      <div
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
            muted
            playsInline
            preload="auto"
            aria-hidden
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

        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: isVertical ? "contain" : "cover",
            objectPosition: "center",
            zIndex: 1,
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            background:
              "linear-gradient(to bottom,rgba(5,5,5,0.6) 0%,rgba(5,5,5,0) 20%,rgba(5,5,5,0) 65%,rgba(5,5,5,0.9) 100%)",
          }}
        />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(to left,#D4AF37,#f5e08a)" }} />
        </div>

        <div style={{ position: "absolute", top: "2rem", right: "3rem", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 1, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 5, fontWeight: 700 }}>مراحل ساخت</span>
        </div>

        <div style={{ position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)", zIndex: 10, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: i === activeStep ? 1 : 0.22 }}>
              <div style={{ width: i === activeStep ? 10 : 4, height: i === activeStep ? 10 : 4, borderRadius: "50%", background: "#D4AF37", transition: "all 0.3s" }} />
              {i === activeStep && <span style={{ color: "#D4AF37", fontSize: 9, letterSpacing: 3, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>}
            </div>
          ))}
        </div>

        <div key={activeStep} style={{ position: "absolute", bottom: "3.5rem", right: "3rem", zIndex: 10, maxWidth: 500, animation: "caFade 0.5s ease forwards" }}>
          <style>{`
            @keyframes caFade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
            @keyframes caSpin { to { transform:rotate(360deg); } }
          `}</style>
          <div style={{ color: "#D4AF37", fontSize: 11, letterSpacing: 5, fontWeight: 700, marginBottom: "0.6rem" }}>
            {toPersian(activeStep + 1)} / {toPersian(STEPS.length)}
          </div>
          <h2 style={{ color: "#fff", fontSize: "clamp(28px,4.5vw,62px)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.6rem" }}>
            {step.label}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(13px,1vw,15px)", lineHeight: 1.9, fontWeight: 300, maxWidth: 320 }}>
            {step.desc}
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
