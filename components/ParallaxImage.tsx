"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/*
  کامپوننت پارالاکس — فعلاً در هیچ صفحه‌ای استفاده نمی‌شود (چون
  عکس واقعی هنوز آماده نیست)، ولی برای وقتی که عکس‌های واقعی
  پروژه‌ها را اضافه کردی، آماده و بدون باگ نگه داشته شده.

  رفع باگ: import قبلی `ScrollTrigger` از "../lib/gsap" بلااستفاده
  بود (چون فقط به‌عنوان config-key پلاگین استفاده می‌شود، نه مستقیم
  در کد)، و باعث خطای build می‌شد (دقیقاً مشابه باگ قبلی error.tsx).
  اینجا فقط gsap import شده است.
*/
export default function ParallaxImage({
  src,
  alt,
  speed = 18,
}: {
  src: string;
  alt: string;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!imgRef.current || !containerRef.current) return;
      gsap.fromTo(
        imgRef.current,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          top: "-22%",
          left: 0,
          width: "100%",
          height: "144%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
