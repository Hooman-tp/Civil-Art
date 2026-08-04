"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WatermarkedImage from "./WatermarkedImage";

export type LightboxImage = { src: string; alt: string };

type ImageLightboxProps = {
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const SWIPE_THRESHOLD_PX = 50;
const ZOOM_STEP = 0.5;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;

/**
 * نمایش تمام‌صفحه‌ی یک عکس با:
 *  - دکمه‌ی بستن (✕) — طبق درخواست، چون قبلاً هیچ راه مشخصی برای
 *    برگشت جز کلیک روی فضای تیره‌ی اطراف وجود نداشت.
 *  - دکمه‌های چرخش (۹۰ درجه چپ/راست) و زوم (بزرگ‌نمایی/کوچک‌نمایی) —
 *    مشابه نوار ابزار گالری تصویر مرورگر که به‌عنوان نمونه فرستاده شد.
 *  - ناوبری قبلی/بعدی با کشیدن انگشت یا موس، و کلیدهای جهت‌نما.
 *  - Escape برای بستن.
 * چرخش/زوم هر بار که تصویر عوض می‌شود ریست می‌شود.
 */
export default function ImageLightbox({ images, activeIndex, onClose, onNavigate }: ImageLightboxProps) {
  const hasMultiple = images.length > 1;
  const current = images[activeIndex];

  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setRotation(0);
    setZoom(1);
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  const rotateLeft = useCallback(() => setRotation((r) => r - 90), []);
  const rotateRight = useCallback(() => setRotation((r) => r + 90), []);
  const zoomIn = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP)), []);
  const resetView = useCallback(() => {
    setRotation(0);
    setZoom(1);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "+" || event.key === "=") zoomIn();
      if (event.key === "-") zoomOut();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goPrev, goNext, zoomIn, zoomOut]);

  const dragStartX = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    // وقتی زوم فعال است، کشیدن برای جابه‌جایی عکس است نه ناوبری بین عکس‌ها
    if (zoom > 1) return;
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (dragStartX.current === null || !hasMultiple || zoom > 1) {
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
      {/* ── نوار ابزار بالا: بستن + چرخش + زوم ── */}
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "absolute",
          top: "16px",
          insetInline: "16px",
          zIndex: 1002,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <ToolbarButton label="چرخش به چپ" onClick={rotateLeft}>
            <IconRotateLeft />
          </ToolbarButton>
          <ToolbarButton label="چرخش به راست" onClick={rotateRight}>
            <IconRotateRight />
          </ToolbarButton>
          <ToolbarButton label="بزرگ‌نمایی" onClick={zoomIn} disabled={zoom >= MAX_ZOOM}>
            <IconZoomIn />
          </ToolbarButton>
          <ToolbarButton label="کوچک‌نمایی" onClick={zoomOut} disabled={zoom <= MIN_ZOOM}>
            <IconZoomOut />
          </ToolbarButton>
          {(rotation !== 0 || zoom !== 1) && (
            <ToolbarButton label="بازنشانی نما" onClick={resetView}>
              <IconReset />
            </ToolbarButton>
          )}
        </div>

        <ToolbarButton label="بستن" onClick={onClose}>
          <IconClose />
        </ToolbarButton>
      </div>

      {/* ── فلش‌های قبلی/بعدی ── */}
      {hasMultiple && (
        <>
          <ToolbarButton
            label="عکس قبلی"
            onClick={goPrev}
            style={{ position: "absolute", insetInlineStart: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 1002 }}
          >
            <IconChevron direction="prev" />
          </ToolbarButton>
          <ToolbarButton
            label="عکس بعدی"
            onClick={goNext}
            style={{ position: "absolute", insetInlineEnd: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 1002 }}
          >
            <IconChevron direction="next" />
          </ToolbarButton>
        </>
      )}

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
          touchAction: zoom > 1 ? "none" : "pan-y",
          cursor: hasMultiple && zoom === 1 ? "grab" : "default",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transition: "transform 0.25s ease",
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

/* ── دکمه‌ی نوار ابزار ── */

function ToolbarButton({
  label,
  onClick,
  disabled,
  children,
  style,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid rgba(212,175,55,0.35)",
        background: "rgba(10,10,10,0.7)",
        color: disabled ? "rgba(255,255,255,0.25)" : "#D4AF37",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ── آیکون‌های خطی (بدون وابستگی خارجی) ── */

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function IconRotateLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 12a9 9 0 1 1 3 6.7" strokeLinecap="round" />
      <path d="M3 8v4.5H7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRotateRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 12a9 9 0 1 0-3 6.7" strokeLinecap="round" />
      <path d="M21 8v4.5h-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M21 21L15.5 15.5" strokeLinecap="round" />
      <path d="M10.5 8V13M8 10.5H13" strokeLinecap="round" />
    </svg>
  );
}

function IconZoomOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M21 21L15.5 15.5" strokeLinecap="round" />
      <path d="M8 10.5H13" strokeLinecap="round" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 14a8 8 0 1 0 2-8.3L4 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevron({ direction }: { direction: "prev" | "next" }) {
  const d = direction === "prev" ? "M15 5L8 12L15 19" : "M9 5L16 12L9 19";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
