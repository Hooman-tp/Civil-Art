"use client";

import { useState } from "react";
import WatermarkedImage from "../../../components/WatermarkedImage";
import ImageLightbox, { type LightboxImage } from "../../../components/ImageLightbox";

type ProjectGalleryClientProps = {
  cover: string | null;
  gallery: string[];
  alt: string;
};

export default function ProjectGalleryClient({ cover, gallery, alt }: ProjectGalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const allImages: LightboxImage[] = [
    ...(cover ? [{ src: cover, alt }] : []),
    ...gallery.map((src, i) => ({ src, alt: `${alt} - تصویر ${i + 1}` })),
  ];
  const galleryStartIndex = cover ? 1 : 0;

  return (
    <>
      {cover && (
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" }}>
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            aria-label="مشاهده بزرگ‌تر عکس شاخص پروژه"
            className="gallery-thumb"
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#0b0b0d",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(212,175,55,0.18)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              cursor: "zoom-in",
              padding: 0,
            }}
          >
            <WatermarkedImage
              src={cover}
              alt={alt}
              fill
              sizes="(max-width: 1100px) 100vw, 1100px"
              imageClassName="gallery-thumb-image"
            />
          </button>
        </section>
      )}

      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#D4AF37" }}>
          تصاویر پروژه
        </h2>

        {gallery.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            {gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(galleryStartIndex + index)}
                className="gallery-thumb"
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  background: "#0b0b0d",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  padding: 0,
                }}
                aria-label={`مشاهده بزرگ‌تر عکس ${index + 1}`}
              >
                <WatermarkedImage
                  src={src}
                  alt={`${alt} - تصویر ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 220px"
                  imageClassName="gallery-thumb-image"
                />
              </button>
            ))}
          </div>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
            تصویری برای گالری این پروژه هنوز اضافه نشده است.
          </p>
        )}
      </section>

      {activeIndex !== null && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
