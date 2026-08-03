"use client";

import { useMemo, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import ImageLightbox, { type LightboxImage } from "../../components/ImageLightbox";
import type { ProjectCategory } from "../../lib/projectsData";

type GalleryProject = {
  slug: string;
  category: ProjectCategory;
  name: string;
  coverSrc: string | null;
};

const ALL_LABEL = "همه";

export default function GalleryClient({ projects }: { projects: GalleryProject[] }) {
  /*
    نکته مهم: لیست دسته‌بندی‌ها دیگر به‌صورت دستی نوشته نمی‌شود. قبلاً
    این لیست ثابت بود و با اضافه‌شدن دسته‌بندی‌های جدید در
    projectsData.ts هماهنگ نمی‌ماند (باگ). حالا مستقیماً از روی داده‌ی
    واقعی پروژه‌ها ساخته می‌شود، پس همیشه به‌روز است.
  */
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return [ALL_LABEL, ...unique];
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === ALL_LABEL ? projects : projects.filter((p) => p.category === activeCategory);

  const filteredWithImages = filtered.filter((p): p is GalleryProject & { coverSrc: string } => Boolean(p.coverSrc));

  const lightboxImages: LightboxImage[] = filteredWithImages.map((p) => ({
    src: p.coverSrc,
    alt: p.name || p.category,
  }));

  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "50px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            گالری تصاویر
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.25 }}>
          نگاهی به آثار ما
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "17px",
            lineHeight: 2,
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          مجموعه‌ای از تصاویر پروژه‌های اجراشده در سراسر کشور. روی هر عکس
          کلیک کنید تا بزرگ‌تر ببینید.
        </p>
      </section>

      {/* ── فیلتر دسته‌بندی ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "50px",
          padding: "0 24px",
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={isActive}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                fontSize: "13px",
                cursor: "pointer",
                border: "1px solid rgba(212,175,55,0.25)",
                background: isActive ? "#D4AF37" : "transparent",
                color: isActive ? "#000" : "#D4AF37",
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── گرید گالری ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "60px 0" }}>
            پروژه‌ای در این دسته‌بندی یافت نشد.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: "28px",
            }}
          >
            {filtered.map((p) => {
              const imageIndex = filteredWithImages.findIndex((x) => x.slug === p.slug);

              return (
                <ProjectCard
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  coverSrc={p.coverSrc}
                  alt={p.name || p.category}
                  title={p.name || p.slug}
                  tag={p.category}
                  onImageClick={imageIndex >= 0 ? () => setActiveIndex(imageIndex) : undefined}
                />
              );
            })}
          </div>
        )}
      </section>

      {activeIndex !== null && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
