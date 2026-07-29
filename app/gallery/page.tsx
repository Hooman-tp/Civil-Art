"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECTS } from "../../lib/projectsData";

const CATEGORIES = ["همه", "مسکونی", "زیرساخت", "صنعتی", "آب و فاضلاب"] as const;

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("همه");

  const filtered =
    activeCategory === "همه" ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);

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
          مجموعه‌ای از تصاویر پروژه‌های اجراشده در سراسر کشور. برای مشاهده
          جزئیات کامل هر پروژه، روی تصویر مربوطه کلیک کنید.
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
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="gallery-item"
              style={{
                aspectRatio: "4 / 3",
                background: "#0b0b0d",
                border: "1px solid rgba(212,175,55,0.1)",
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                display: "block",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 40% 30%, rgba(212,175,55,0.1) 0%, transparent 65%)",
                }}
              />
              <div style={{ position: "absolute", bottom: 0, right: 0, left: 0, padding: "18px" }}>
                <div style={{ fontSize: "11px", color: "#D4AF37", marginBottom: "4px" }}>
                  {p.category}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{p.name}</div>
              </div>

              <span className="view-project-btn">مشاهده جزئیات ←</span>
            </Link>
          ))}
        </div>

        <style>{`
          .gallery-item {
            transition: transform 0.3s ease;
          }
          .gallery-item:hover {
            transform: translateY(-4px);
          }
          .view-project-btn {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%,-50%) scale(0.9);
            background: linear-gradient(180deg,#efd98a,#D4AF37);
            color: #000;
            font-size: 12px;
            font-weight: 700;
            padding: 8px 18px;
            border-radius: 999px;
            opacity: 0;
            transition: opacity 0.25s ease, transform 0.25s ease;
            white-space: nowrap;
          }
          .gallery-item:hover .view-project-btn {
            opacity: 1;
            transform: translate(-50%,-50%) scale(1);
          }
        `}</style>
      </section>
    </div>
  );
}
