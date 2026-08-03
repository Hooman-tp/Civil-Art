"use client";

import { useCallback, useEffect } from "react";
import WatermarkedImage from "./WatermarkedImage";

export type LightboxImage = { src: string; alt: string };

type ImageLightboxProps = {
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * نمایش تمام‌صفحه‌ی یک عکس با امکان جابه‌جایی بین چند عکس (کلید جهت‌نما،
 * دکمه‌های بعدی/قبلی، یا کلیک روی پس‌زمینه برای بستن). برای استفاده در
 * گالری، لیست پروژه‌ها و گالری داخل صفحه‌ی هر پروژه به‌کار می‌رود.
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
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "1px solid rgba(212,175,55,0.4)",
          background: "rgba(11,11,13,0.85)",
          color: "#D4AF37",
          fontSize: "20px",
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1002,
        }}
      >
        ✕
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="عکس قبلی"
            style={{
              position: "absolute",
              left: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: "1px solid rgba(212,175,55,0.4)",
              background: "rgba(11,11,13,0.85)",
              color: "#D4AF37",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 1002,
            }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="عکس بعدی"
            style={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: "1px solid rgba(212,175,55,0.4)",
              background: "rgba(11,11,13,0.85)",
              color: "#D4AF37",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 1002,
            }}
          >
            →
          </button>
        </>
      )}

      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          width: "min(92vw, 1200px)",
          height: "min(85vh, 800px)",
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
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.6)",
            fontSize: "13px",
            zIndex: 1002,
          }}
        >
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
