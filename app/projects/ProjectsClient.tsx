"use client";

import { useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import ImageLightbox, { type LightboxImage } from "../../components/ImageLightbox";
import type { Project } from "../../lib/projectsData";

type ProjectWithCover = Project & { coverSrc: string | null };

export default function ProjectsClient({ projects }: { projects: ProjectWithCover[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // فقط پروژه‌هایی که عکس واقعی دارند وارد چرخه‌ی لایت‌باکس می‌شوند
  const projectsWithImages = projects.filter((p): p is ProjectWithCover & { coverSrc: string } => Boolean(p.coverSrc));

  const lightboxImages: LightboxImage[] = projectsWithImages.map((p) => ({
    src: p.coverSrc,
    alt: p.name || p.tag || p.slug,
  }));

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "28px",
        }}
      >
        {projects.map((p) => {
          const imageIndex = projectsWithImages.findIndex((x) => x.slug === p.slug);

          return (
            <ProjectCard
              key={p.slug}
              href={`/projects/${p.slug}`}
              coverSrc={p.coverSrc}
              alt={p.name || p.tag || p.slug}
              title={p.name || p.slug}
              tag={p.tag || p.category}
              description={p.shortDesc}
              year={p.year}
              onImageClick={imageIndex >= 0 ? () => setActiveIndex(imageIndex) : undefined}
            />
          );
        })}
      </div>

      {activeIndex !== null && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
