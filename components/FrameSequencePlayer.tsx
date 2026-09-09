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

  const drawAt = (exactIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowIndex = Math.max(0, Math.min(frameCount - 1, Math.floor(exactIndex)));
    const highIndex = Math.min(frameCount - 1, lowIndex + 1);
    const blend = exactIndex - lowIndex;

    const lowImg = imagesRef.current[lowIndex];
    if (!lowImg || !lowImg.complete || lowImg.naturalWidth === 0) return;

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
    if (blend > 0.02 && highImg && highImg.complete && highImg.naturalWidth > 0) {
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
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `${framePrefix}${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = () => {
        if (i === 0 && !cancelled) {
          drawAt(0);
          setFirstFrameReady(true);
          onFirstFrameReady?.();
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

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
