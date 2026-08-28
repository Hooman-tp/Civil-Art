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
  specs?: { label: string; value: string }[];
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
  specs = [],
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

      {/* اطلاعات پروژه روی تصویر: شیشه‌ای و مینیمال، بدون افکت سنگین */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "-42px 14px 0",
          background: "rgba(10,10,12,0.58)",
          border: "1px solid rgba(212,175,55,0.24)",
          borderRadius: "18px",
          padding: "25px 20px 18px",
          boxShadow: "0 14px 34px rgba(0,0,0,0.34)",
          backdropFilter: "blur(14px) saturate(120%)",
          WebkitBackdropFilter: "blur(14px) saturate(120%)",
        }}
      >
        <Link href={href} className="project-card-cta">
          مشاهده جزئیات ←
        </Link>

        {tag && (
          <div style={{ fontSize: "9px", color: "#D4AF37", letterSpacing: "2px", marginBottom: "7px", textTransform: "uppercase" }}>
            {tag}
          </div>
        )}
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: description ? "6px" : year ? "9px" : 0, lineHeight: 1.55 }}>
          {title}
        </h3>
        {description && (
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "12px", lineHeight: 1.9, marginBottom: year || specs.length ? "10px" : 0 }}>
            {description}
          </p>
        )}
        {year && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.42)" }}>{year}</span>}
        {specs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "7px 14px", marginTop: "12px", paddingTop: "11px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {specs.slice(0, 6).map((spec) => (
              <div key={spec.label}>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", marginBottom: "2px" }}>{spec.label}</div>
                <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "10px", fontWeight: 600 }}>{spec.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
