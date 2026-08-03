import fs from "fs";
import path from "path";

/**
 * ══════════════════════════════════════════════════════════════════
 * خواندن خودکار عکس‌های پروژه از روی دیسک (Server-only)
 * ══════════════════════════════════════════════════════════════════
 *
 * این فایل از ماژول‌های «fs» و «path» نود استفاده می‌کند و فقط در
 * Server Component یا در توابع سمت سرور (مثل generateMetadata) قابل
 * استفاده است — هرگز آن را در فایلی که «use client» دارد import نکن،
 * چون fs در مرورگر وجود ندارد و بیلد را می‌شکند.
 *
 * قانون: فایلی که اسمش (بدون پسوند) دقیقاً «cover» باشد به‌عنوان عکس
 * شاخص/کاور شناسایی می‌شود. بقیه‌ی عکس‌های داخل پوشه به ترتیب طبیعی
 * نامشان (1, 2, 3, ...) در آرایه‌ی gallery قرار می‌گیرند.
 *
 * نتیجه در حافظه cache می‌شود تا در یک درخواست/بیلد، دیسک بارها
 * خوانده نشود (بهینه‌سازی کارایی).
 * ══════════════════════════════════════════════════════════════════
 */

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export type ProjectImages = {
  cover: string | null;
  gallery: string[];
};

const PROJECTS_ROOT_DIR = path.join(process.cwd(), "public", "images", "projects");

const projectImagesCache = new Map<string, ProjectImages>();

function isImageFile(fileName: string): boolean {
  return IMAGE_EXTENSIONS.includes(path.extname(fileName).toLowerCase());
}

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * تمام عکس‌های واقعی یک پروژه را از پوشه‌ی
 * public/images/projects/{slug} می‌خواند و مسیرهای عمومی
 * (public URL) آن‌ها را برمی‌گرداند.
 *
 * اگر پوشه وجود نداشته باشد یا خالی باشد، آرایه‌ی خالی و cover برابر
 * null برمی‌گردد (نه خطا) تا کامپوننت‌ها بتوانند حالت جایگزین گرافیکی
 * نمایش دهند، نه یک آیکون عکس شکسته.
 */
export function getProjectImages(slug: string): ProjectImages {
  const cached = projectImagesCache.get(slug);
  if (cached) return cached;

  const projectDir = path.join(PROJECTS_ROOT_DIR, slug);

  let entries: string[] = [];
  try {
    entries = fs.readdirSync(projectDir);
  } catch {
    const empty: ProjectImages = { cover: null, gallery: [] };
    projectImagesCache.set(slug, empty);
    return empty;
  }

  const imageFiles = entries.filter(isImageFile);

  const coverFile = imageFiles.find(
    (file) => path.parse(file).name.toLowerCase() === "cover"
  );

  const galleryFiles = imageFiles
    .filter((file) => file !== coverFile)
    .sort(naturalCompare);

  const result: ProjectImages = {
    cover: coverFile ? `/images/projects/${slug}/${coverFile}` : null,
    gallery: galleryFiles.map((file) => `/images/projects/${slug}/${file}`),
  };

  projectImagesCache.set(slug, result);
  return result;
}

/**
 * یک عکس شاخص برمی‌گرداند: اول سراغ cover.* می‌رود، اگر پیدا نشد
 * اولین عکس گالری را برمی‌گرداند، و اگر هیچ عکسی در پوشه نبود
 * null برمی‌گرداند (کامپوننت مصرف‌کننده باید حالت جایگزین را
 * نمایش دهد، نه تلاش برای بارگذاری عکسی که وجود ندارد).
 */
export function getProjectCover(slug: string): string | null {
  const { cover, gallery } = getProjectImages(slug);
  return cover ?? gallery[0] ?? null;
}
