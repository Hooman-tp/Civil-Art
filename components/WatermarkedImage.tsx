import Image, { type ImageProps } from "next/image";

/**
 * ══════════════════════════════════════════════════════════════════
 * واترمارک لوگو روی تمام عکس‌های پروژه‌ها
 * ══════════════════════════════════════════════════════════════════
 * به‌جای الگوی تکرارشونده‌ی متنی قبلی، فقط لوگوی شرکت (فایل
 * public/logo-icon.png) به‌صورت کوچک در گوشه‌ی پایین-چپ عکس نمایش
 * داده می‌شود — هدف: اثبات مالکیت عکس بدون خراب کردن حس گالری/عکاسی.
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
          bottom: "3%",
          left: "3%",
          width: "26%",
          maxWidth: "150px",
          minWidth: "72px",
          aspectRatio: "1000 / 665",
          opacity: 0.92,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
        }}
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="150px"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
