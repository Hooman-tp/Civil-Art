import Image, { type ImageProps } from "next/image";

/**
 * ══════════════════════════════════════════════════════════════════
 * واترمارک خودکار روی تمام عکس‌های پروژه‌ها
 * ══════════════════════════════════════════════════════════════════
 * الگوی تکرارشونده‌ی نام شرکت به‌صورت یک SVG ساخته می‌شود و به‌عنوان
 * background-image تکرار می‌شود (نه با رندر چندباره‌ی المان‌های DOM)،
 * تا از نظر کارایی سبک بماند. هدف جلوگیری از کپی‌برداری و سوءاستفاده
 * از عکس‌های واقعی پروژه‌هاست.
 *
 * همیشه از همین کامپوننت به‌جای next/image خام برای عکس‌های پروژه
 * استفاده کن تا واترمارک روی همه‌جا یکسان بماند.
 * ══════════════════════════════════════════════════════════════════
 */

const WATERMARK_TEXT = "CIVIL-ART";

function buildWatermarkPattern(): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="200">` +
    `<text x="-10" y="120" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" ` +
    `letter-spacing="3" fill="rgba(255,255,255,0.16)" transform="rotate(-30 130 100)">${WATERMARK_TEXT}</text>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const WATERMARK_PATTERN = buildWatermarkPattern();

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
          inset: 0,
          backgroundImage: WATERMARK_PATTERN,
          backgroundRepeat: "repeat",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
