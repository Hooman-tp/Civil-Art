"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const FRAME_COUNT = 150;
const framePath = (i: number) => `/videos/frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;

export interface FrameSequenceHandle {
  /** فریم را بر اساس پیشرفت ۰ تا ۱ رسم می‌کند */
  setProgress: (progress: number) => void;
}

/**
 * پخش‌کننده‌ی «دنباله‌ی فریم» روی canvas، جایگزینِ <video currentTime=...>.
 *
 * چرا این تغییر؟ نسخه‌ی قبلی (ویدیوی واقعی + seek روی هر تیکِ اسکرول)
 * چند مشکلِ ساختاری داشت که هیچ‌کدام با تنظیمِ فرمولِ نرم‌سازی یا آستانه‌ی
 * seek قابلِ‌حل نبودند، چون ریشه‌شان «موتور دیکودِ ویدیو» بود، نه ریاضیِ
 * اسکرول:
 *   ۱. seek مکرر روی <video> از دیکودرِ مرورگر عبور می‌کند؛ با اسکرولِ
 *      سریع، لگ/توقفِ محسوس ایجاد می‌شد (مستقل از نرم‌سازیِ زمانی).
 *   ۲. iOS Safari برای preload="auto" روی ویدیویِ بدونِ autoplay محافظه‌کار
 *      است؛ نیاز به «آن‌لاک‌کردن» با یک play()/pause() موقت داشت.
 *   ۳. object-fit:cover روی گوشیِ عمودی با ویدیویِ افقی، برشِ تهاجمی
 *      ایجاد می‌کرد (همان باگِ «زوم‌شده»)؛ نیاز به تشخیصِ نسبت‌ابعاد و
 *      سوییچ به contain + یک پرکننده‌ی بلورشده داشت.
 *
 * با canvas: همه‌ی فریم‌ها از قبل به‌صورت تصویر بارگذاری می‌شوند و فقط
 * drawImage انجام می‌شود — بدون دیکودِ ویدیو، بدون سیاست‌های autoplay،
 * و چون خودمان مستقیماً محاسبه می‌کنیم چطور فریم را بچینیم، منطقِ
 * contain/blur-fill به یک شاخه‌ی ساده تبدیل می‌شود (پایین‌تر).
 */
const FrameSequencePlayer = forwardRef<FrameSequenceHandle, { onFirstFrameReady?: () => void }>(
  function FrameSequencePlayer({ onFirstFrameReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentIndexRef = useRef(0);
    const [firstFrameReady, setFirstFrameReady] = useState(false);

    const drawFrame = (index: number) => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[index];
      if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const pxW = Math.round(cssW * dpr);
      const pxH = Math.round(cssH * dpr);
      if (pxW === 0 || pxH === 0) return;
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }

      const coverScale = Math.max(pxW / img.naturalWidth, pxH / img.naturalHeight);
      const containScale = Math.min(pxW / img.naturalWidth, pxH / img.naturalHeight);
      // اگر نسبت‌ابعادِ ویوپورت خیلی با فریم فرق داشته باشد (مثلاً گوشیِ
      // عمودی با ویدیویِ افقی)، cover باعثِ برشِ تهاجمی/زوم می‌شود؛ در آن
      // حالت به contain برمی‌گردیم و پس‌زمینه را با نسخه‌ی بزرگ‌نمایی‌شده و
      // بلورِ همان فریم پر می‌کنیم (نه رنگِ یک‌دست) تا حسِ تمام‌صفحه حفظ شود.
      const mismatch = coverScale / containScale;
      const useContain = mismatch > 1.5;
      const scale = useContain ? containScale : coverScale;
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (pxW - drawW) / 2;
      const dy = (pxH - drawH) / 2;

      ctx.clearRect(0, 0, pxW, pxH);

      if (useContain) {
        ctx.save();
        ctx.filter = "blur(28px) brightness(0.4)";
        const bgScale = coverScale * 1.15;
        const bgW = img.naturalWidth * bgScale;
        const bgH = img.naturalHeight * bgScale;
        ctx.drawImage(img, (pxW - bgW) / 2, (pxH - bgH) / 2, bgW, bgH);
        ctx.restore();
      }

      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    useImperativeHandle(ref, () => ({
      setProgress: (progress: number) => {
        const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));
        currentIndexRef.current = index;
        drawFrame(index);
      },
    }));

    useEffect(() => {
      let cancelled = false;
      const images: HTMLImageElement[] = [];

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = framePath(i);
        img.onload = () => {
          if (i === 0 && !cancelled) {
            drawFrame(0);
            setFirstFrameReady(true);
            onFirstFrameReady?.();
          }
        };
        images.push(img);
      }
      imagesRef.current = images;

      const redraw = () => drawFrame(currentIndexRef.current);
      const ro = new ResizeObserver(redraw);
      if (canvasRef.current) ro.observe(canvasRef.current);
      window.addEventListener("orientationchange", redraw);

      return () => {
        cancelled = true;
        ro.disconnect();
        window.removeEventListener("orientationchange", redraw);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          opacity: firstFrameReady ? 1 : 0,
          transition: "opacity 0.4s",
        }}
      />
    );
  }
);

export default FrameSequencePlayer;
