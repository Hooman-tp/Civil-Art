"use client";

import Link from "next/link";
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
   * اگر مقدار داده شود، کلیک روی عکس این تابع را صدا می‌زند (برای باز
   * کردن Lightbox) به‌جای رفتن مستقیم به صفحه‌ی پروژه. دکمه‌ی «مشاهده
   * جزئیات» در هر دو حالت همیشه به صفحه‌ی پروژه می‌رود.
   */
  onImageClick?: () => void;
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
  const imageBox = (
    <div
      className="project-card-image-box"
      style={{
        position: "relative",
        aspectRatio: "4 / 3",
        borderRadius: "22px",
        overflow: "hidden",
        background: "#0b0b0d",
        border: "1px solid rgba(212,175,55,0.16)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
      }}
    >
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
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5,5,5,0) 58%, rgba(5,5,5,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  return (
    <div className="project-card">
      {onImageClick ? (
        <div
          onClick={onImageClick}
          role="button"
          tabIndex={0}
          style={{ cursor: coverSrc ? "zoom-in" : "default" }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onImageClick();
            }
          }}
        >
          {imageBox}
        </div>
      ) : (
        <Link href={href} style={{ display: "block" }} aria-label={title}>
          {imageBox}
        </Link>
      )}

      {/*
        پنل اطلاعات روی لبه‌ی پایین عکس روکش می‌شود (margin منفی) تا حس
        عمق و لایه‌بندی بدهد. دکمه‌ی CTA دقیقاً روی خط اتصال عکس و پنل
        شناور است (موقعیت‌دهی کامل داخل globals.css در کلاس project-card-cta).
      */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "-34px 16px 0",
          background: "#111113",
          border: "1px solid rgba(212,175,55,0.22)",
          borderRadius: "16px",
          padding: "30px 20px 18px",
          boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
        }}
      >
        <Link href={href} className="project-card-cta">
          مشاهده جزئیات ←
        </Link>

        {tag && (
          <div style={{ fontSize: "11px", color: "#D4AF37", letterSpacing: "1.5px", marginBottom: "6px" }}>
            {tag}
          </div>
        )}
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: description ? "6px" : year ? "10px" : 0,
            lineHeight: 1.6,
          }}
        >
          {title}
        </h3>
        {description && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.8, marginBottom: year ? "10px" : 0 }}>
            {description}
          </p>
        )}
        {year && <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{year}</span>}
      </div>
    </div>
  );
}
