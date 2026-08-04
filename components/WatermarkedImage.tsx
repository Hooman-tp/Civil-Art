import Image, { type ImageProps } from "next/image";

/**
 * ══════════════════════════════════════════════════════════════════
 * واترمارک لوگو روی تمام عکس‌های پروژه‌ها
 * ══════════════════════════════════════════════════════════════════
 * لوگوی کامل شرکت (public/logo.png) با شفافیت زیاد در وسط عکس قرار
 * می‌گیرد — به اندازه‌ی کافی دیده می‌شود که مانع سوءاستفاده شود، اما
 * آن‌قدر کم‌رنگ است که مزاحم دیدن خود عکس نشود.
 *
 * همیشه از همین کامپوننت به‌جای next/image خام برای عکس‌های پروژه
 * استفاده کن تا واترمارک روی همه‌جا یکسان بماند.
 * ══════════════════════════════════════════════════════════════════
 */

type WatermarkedImageProps = Omit<ImageProps, "className"> & {
  /** کلاسی که فقط روی خود عکس اعمال می‌شود (مثلاً برای افکت زوم هنگام هاور) */
  imageClassName?: string;
};

export default function WatermarkedImage({ imageClassName, alt, ...imageProps }: WatermarkedImageProps) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Image {...imageProps} alt={alt} className={imageClassName} />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "38%",
          maxWidth: "220px",
          minWidth: "90px",
          aspectRatio: "1000 / 665",
          opacity: 0.28,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="220px"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
