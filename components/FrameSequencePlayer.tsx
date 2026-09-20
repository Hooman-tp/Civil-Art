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

/**
 * پخش‌کننده‌ی «دنباله‌ی فریم» روی canvas، جایگزینِ <video currentTime=...>.
 *
 * دو تفاوت کلیدی نسبت به نسخه‌ی اول:
 *
 * ۱. کراس‌فِید بین دو فریمِ مجاور (نه فقط رُند‌کردن به نزدیک‌ترین فریم):
 *    با ۶۳ ثانیه ویدیوی منبع، حتی با ۲۶۰ فریم، فاصله‌ی هر فریم حدود
 *    ۰.۲۴ ثانیه است. رُند‌کردن ساده به نزدیک‌ترین فریم یعنی تصویر precisely
 *    هر ۰.۲۴ ثانیه یک‌باره عوض می‌شود — همون حسِ «ورق‌زدن کاغذ». اینجا به‌جایش
 *    ایندکسِ اعشاری محاسبه می‌شود و دو فریمِ مجاور با شفافیتِ متناسب روی هم
 *    ترسیم می‌شوند؛ نتیجه یک گذارِ نرم بینِ فریم‌ها است، نه یک پرشِ ناگهانی.
 *
 * ۲. فقط cover (نه contain/بلور): چون حالا برای دسکتاپ و موبایل دو منبع
 *    جدا با نسبت‌ابعاد متناسب همان دستگاه داریم.
 */
const FrameSequencePlayer = forwardRef<FrameSequenceHandle, Props>(function FrameSequencePlayer(
  { frameCount, framePrefix, onFirstFrameReady },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentExactRef = useRef(0);
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowIndex = Math.max(0, Math.min(frameCount - 1, Math.floor(exactIndex)));
    const highIndex = Math.min(frameCount - 1, lowIndex + 1);
    const blend = exactIndex - lowIndex;

    // با فریم‌های زیاد، همه‌ی فریم‌ها هم‌زمان نمی‌رسند (بارگذاری درشت‌به‌ریز است).
    // اگر فریمِ دقیق هنوز نیامده، نزدیک‌ترین فریمِ آماده نشان داده می‌شود
    // (به‌جای ماندنِ تصویرِ قبلی روی صفحه)، و بدون کراس‌فِید.
    const exactLow = imagesRef.current[lowIndex];
    const lowReady = isReady(exactLow);
    const lowImg = lowReady ? exactLow : nearestReady(lowIndex);
    if (!lowImg) return;

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

    const drawOne = (img: HTMLImageElement, alpha: number) => {
      const scale = Math.max(pxW / img.naturalWidth, pxH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (pxW - drawW) / 2;
      const dy = (pxH - drawH) / 2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    ctx.clearRect(0, 0, pxW, pxH);
    ctx.globalAlpha = 1;
    drawOne(lowImg, 1);

    const highImg = imagesRef.current[highIndex];
    if (lowReady && blend > 0.02 && isReady(highImg)) {
      drawOne(highImg, blend);
    }
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

    // بارگذاری «درشت به ریز»: اول فریمِ اول و آخر، بعد هر ۶۴تا، هر ۳۲تا، ...
    // تا همه. با ۵۲۰ فریم، درخواستِ پشت‌سرهمِ ۱ تا ۵۲۰ باعث می‌شد اسکرولِ
    // اولیه فقط ابتدای ویدیو را ببیند؛ حالا از همان ثانیه‌های اول کلِ مسیر
    // (با فریمِ نزدیک) قابل‌اسکرول است و بعد ریزتر می‌شود.
    const order: number[] = [];
    const seen = new Set<number>();
    const add = (i: number) => {
      if (i >= 0 && i < frameCount && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    add(0);
    add(frameCount - 1);
    for (const stride of [64, 32, 16, 8, 4, 2, 1]) {
      for (let i = 0; i < frameCount; i += stride) add(i);
    }

    const MAX_PARALLEL = 6;
    let cursor = 0;
    let active = 0;

    const pump = () => {
      while (!cancelled && active < MAX_PARALLEL && cursor < order.length) {
        const i = order[cursor++];
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
        img.src = `${framePrefix}${String(i + 1).padStart(3, "0")}.jpg`;
      }
    };
    pump();

    const redraw = () => drawAt(currentExactRef.current);
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
