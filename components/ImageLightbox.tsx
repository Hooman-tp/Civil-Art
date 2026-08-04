"use client";

import { useCallback, useEffect, useRef } from "react";
import WatermarkedImage from "./WatermarkedImage";

export type LightboxImage = { src: string; alt: string };

type ImageLightboxProps = {
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const SWIPE_THRESHOLD_PX = 50;

/**
 * نمایش تمام‌صفحه‌ی یک عکس با ناوبری از طریق کشیدن انگشت (موبایل) یا
 * کشیدن موس (دسکتاپ) — بدون دکمه‌ی فلش یا ضربدر. برای بستن، روی
 * فضای تیره‌ی اطراف عکس کلیک/تپ کن. کلیدهای جهت‌نما و Escape هم
 * برای دسترس‌پذیری کیبورد پشتیبانی می‌شوند (بدون نمایش دکمه‌ی مجزا).
 */
export default function ImageLightbox({ images, activeIndex, onClose, onNavigate }: ImageLightboxProps) {
  const hasMultiple = images.length > 1;
  const current = images[activeIndex];

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goPrev, goNext]);

  const dragStartX = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (dragStartX.current === null || !hasMultiple) {
      dragStartX.current = null;
      return;
    }
    const deltaX = event.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.94)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartX.current = null;
        }}
        style={{
          position: "relative",
          width: "min(92vw, 1200px)",
          height: "min(85vh, 800px)",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          touchAction: "pan-y",
          cursor: hasMultiple ? "grab" : "default",
        }}
      >
        <WatermarkedImage
          src={current.src}
          alt={current.alt}
          fill
          sizes="92vw"
          style={{ objectFit: "contain" }}
        />
      </div>

      {hasMultiple && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.55)",
            fontSize: "12px",
            letterSpacing: "1px",
            zIndex: 1002,
          }}
        >
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
