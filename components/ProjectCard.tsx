"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import WatermarkedImage from "./WatermarkedImage";

export type ProjectCardProps = {
  href: string;
  coverSrc: string | null;
  alt: string;
  title: string;
  tag?: string;
  description?: string;
  year?: string;
  /**
   * اگر مقدار داده شود، کلیک روی بدنه‌ی کارت این تابع را صدا می‌زند
   * (برای باز کردن Lightbox) به‌جای رفتن مستقیم به صفحه‌ی پروژه.
   * دکمه‌ی «مشاهده جزئیات» در هر دو حالت همیشه به صفحه‌ی پروژه می‌رود.
   */
  onImageClick?: () => void;
};

const cardBaseStyle: CSSProperties = {
  background: "#0b0b0d",
  aspectRatio: "4 / 3",
  position: "relative",
  overflow: "hidden",
  borderRadius: "20px",
  border: "1px solid rgba(212,175,55,0.15)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  display: "block",
  textDecoration: "none",
  color: "inherit",
};

export default function ProjectCard({
  href,
  coverSrc,
  alt,
  title,
  tag,
  description,
  year,
  onImageClick,
}: ProjectCardProps) {
  const overlayContent = (
    <>
      {coverSrc && (
        <WatermarkedImage
          src={coverSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          imageClassName="project-card-image"
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.14) 0%, transparent 60%), linear-gradient(180deg, rgba(5,5,5,0) 40%, rgba(5,5,5,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "absolute", bottom: 0, right: 0, left: 0, padding: "26px" }}>
        {tag && (
          <div style={{ fontSize: "11px", color: "#D4AF37", letterSpacing: "2px", marginBottom: "8px" }}>
            {tag}
          </div>
        )}
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: description ? "8px" : 0, color: "#fff" }}>
          {title}
        </h3>
        {description && (
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.8, marginBottom: "8px" }}>
            {description}
          </p>
        )}
        {year && <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{year}</span>}
      </div>
    </>
  );

  if (!onImageClick) {
    return (
      <Link href={href} className="project-card" style={cardBaseStyle}>
        {overlayContent}
        <span className="project-card-cta">مشاهده جزئیات ←</span>
      </Link>
    );
  }

  return (
    <div
      className="project-card"
      style={{ ...cardBaseStyle, cursor: "zoom-in" }}
      onClick={onImageClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onImageClick();
        }
      }}
    >
      {overlayContent}
      <Link
        href={href}
        onClick={(event) => event.stopPropagation()}
        className="project-card-cta"
        aria-label={`مشاهده جزئیات ${title}`}
      >
        مشاهده جزئیات ←
      </Link>
    </div>
  );
}
