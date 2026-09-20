"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface FrameSequenceHandle {
  setProgress: (progress: number) => void;
}

interface Props {
  frameCount: number;
  framePrefix: string;
  onFirstFrameReady?: () => void;
}

// پسوند فریم‌ها. فریم‌ها WebP هستند (تقریباً نصفِ حجمِ JPEG در همان کیفیت)،
// به همین خاطر می‌شود با همان حجمِ قبلی فریمِ بیشتری داشت.
const FRAME_EXT = "webp";

// ترکیبِ دو فریمِ همسایه (کراس‌فِید) وقتی دوربین حرکت می‌کند «تصویر دوتایی /
// روح» می‌سازد (خطوطِ سقف و شیشه دوبار دیده می‌شوند). پیش‌فرض خاموش است:
// همیشه یک فریمِ کامل و تمیز نمایش داده می‌شود و نرمیِ حرکت را تراکمِ بالای
// فریم‌ها + دنبال‌کننده‌ی فنریِ CinematicConstruction تأمین می‌کند.
const BLEND_FRAMES = false;

/**
 * پخش‌کننده‌ی «دنباله‌ی فریم» روی canvas، جایگزینِ <video currentTime=...>.
 *
 * - فقط cover: برای دسکتاپ و موبایل دو منبعِ جدا با نسبت‌ابعادِ متناسب داریم.
 * - بارگذاری هوشمند: اول یک شبکه‌ی درشت از کلِ فیلم (تا از همان ثانیه‌های اول
 *   کل مسیر قابل‌اسکرول باشد)، بعد فریم‌ها «از نزدیکِ جایی که کاربر هست» به
 *   بیرون پر می‌شوند. تا رسیدنِ فریمِ دقیق، نزدیک‌ترین فریمِ آماده نمایش داده
 *   می‌شود (به‌جای ماندنِ تصویرِ قبلی).
 */
const FrameSequencePlayer = forwardRef<FrameSequenceHandle, Props>(function FrameSequencePlayer(
  { frameCount, framePrefix, onFirstFrameReady },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentExactRef = useRef(0);
  // کلیدِ آخرین چیزی که کشیده شد؛ اگر تغییری نکرده باشد دوباره نمی‌کشیم
  // (حلقه‌ی اسکرول هر فریمِ مرورگر صدا زده می‌شود، حتی وقتی چیزی عوض نشده)
  const lastKeyRef = useRef("");
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const isReady = (img?: HTMLImageElement): img is HTMLImageElement =>
    !!img && img.complete && img.naturalWidth > 0;

  const nearestReady = (index: number) => {
    const imgs = imagesRef.current;
    for (let d = 0; d < frameCount; d++) {
      const before = imgs[index - d];
      if (isReady(before)) return before;
      const after = imgs[index + d];
      if (isReady(after)) return after;
    }
    return undefined;
  };

  const drawAt = (exactIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clamped = Math.max(0, Math.min(frameCount - 1, exactIndex));
    const lowIndex = BLEND_FRAMES ? Math.floor(clamped) : Math.round(clamped);
    const highIndex = Math.min(frameCount - 1, lowIndex + 1);
    const blend = BLEND_FRAMES ? clamped - lowIndex : 0;

    const exactLow = imagesRef.current[lowIndex];
    const lowReady = isReady(exactLow);
    const lowImg = lowReady ? exactLow : nearestReady(lowIndex);
    if (!lowImg) return;

    const highImg = imagesRef.current[highIndex];
    const useHigh = lowReady && blend > 0.03 && isReady(highImg);

    // سقفِ ۲ برای dpr: فریم‌های منبع فقط ۶۴۰/۹۶۰ پیکسل‌اند؛ روی گوشی‌های
    // dpr=۳ کشیدنِ کانواسِ ۳ برابری فقط بارِ اضافه روی پردازنده می‌گذارد.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pxW = Math.round(canvas.clientWidth * dpr);
    const pxH = Math.round(canvas.clientHeight * dpr);
    if (pxW === 0 || pxH === 0) return;

    const key = `${lowImg.src}|${useHigh ? highImg.src : ""}|${Math.round(blend * 32)}|${pxW}x${pxH}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }

    const drawOne = (img: HTMLImageElement, alpha: number) => {
      const scale = Math.max(pxW / img.naturalWidth, pxH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (pxW - drawW) / 2, (pxH - drawH) / 2, drawW, drawH);
    };

    ctx.clearRect(0, 0, pxW, pxH);
    drawOne(lowImg, 1);
    if (useHigh) drawOne(highImg, blend);
    ctx.globalAlpha = 1;
  };

  useImperativeHandle(ref, () => ({
    setProgress: (progress: number) => {
      const exact = Math.max(0, Math.min(frameCount - 1, progress * (frameCount - 1)));
      currentExactRef.current = exact;
      drawAt(exact);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = Array.from({ length: frameCount }, () => new Image());
    imagesRef.current = images;

    // ۱) شبکه‌ی درشت: فریمِ اول و آخر، بعد هر ۶۴تا، ۳۲تا، ۱۶تا و ۸تا.
    const coarse: number[] = [];
    const seen = new Set<number>();
    const add = (i: number) => {
      if (i >= 0 && i < frameCount && !seen.has(i)) {
        seen.add(i);
        coarse.push(i);
      }
    };
    add(0);
    add(frameCount - 1);
    for (const stride of [64, 32, 16, 8]) {
      for (let i = 0; i < frameCount; i += stride) add(i);
    }

    // ۲) بعد از آن: نزدیک‌ترین فریمِ درخواست‌نشده به موقعیتِ فعلیِ اسکرول.
    const requested = new Uint8Array(frameCount);
    let coarseCursor = 0;
    const nextIndex = () => {
      while (coarseCursor < coarse.length) {
        const i = coarse[coarseCursor++];
        if (!requested[i]) return i;
      }
      const cur = Math.round(currentExactRef.current);
      let best = -1;
      let bestDistance = Infinity;
      for (let i = 0; i < frameCount; i++) {
        if (requested[i]) continue;
        const distance = Math.abs(i - cur);
        if (distance < bestDistance) {
          best = i;
          bestDistance = distance;
        }
      }
      return best;
    };

    const MAX_PARALLEL = 6;
    let active = 0;

    const pump = () => {
      while (!cancelled && active < MAX_PARALLEL) {
        const i = nextIndex();
        if (i < 0) break;
        requested[i] = 1;
        const img = images[i];
        active++;
        const finish = () => {
          active--;
          pump();
        };
        img.onload = () => {
          if (!cancelled) {
            if (i === 0) {
              setFirstFrameReady(true);
              onFirstFrameReady?.();
            }
            drawAt(currentExactRef.current);
          }
          finish();
        };
        img.onerror = finish;
        img.src = `${framePrefix}${String(i + 1).padStart(3, "0")}.${FRAME_EXT}`;
      }
    };
    pump();

    const redraw = () => {
      lastKeyRef.current = "";
      drawAt(currentExactRef.current);
    };
    const ro = new ResizeObserver(redraw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    window.addEventListener("orientationchange", redraw);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("orientationchange", redraw);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, framePrefix]);

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
});

export default FrameSequencePlayer;
