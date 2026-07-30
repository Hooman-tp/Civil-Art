/**
 * ══════════════════════════════════════════════════════════════════
 * منبع واحد داده‌ی پروژه‌ها (Single Source of Truth)
 * ══════════════════════════════════════════════════════════════════
 *
 * قانون طلایی (مهم‌ترین نکته):
 * مقدار «slug» در هر آیتم زیر باید دقیقاً - حرف به حرف، بدون فاصله،
 * بدون حروف فارسی - با نام پوشه‌ی متناظرش در مسیر زیر یکی باشد:
 *
 *     public/images/projects/{slug}/
 *
 * یعنی اگر بعداً نام یک پوشه را روی دیسک عوض کردی، تنها کاری که لازم
 * است انجام بدهی این است: همین‌جا مقدار «slug» همان پروژه را با نام
 * جدید پوشه جایگزین کنی. هیچ فایل دیگری در پروژه نیاز به تغییر ندارد،
 * چون تمام مسیرهای عکس در کامپوننت‌ها از روی همین slug ساخته می‌شوند:
 * `/images/projects/${slug}/cover.jpg` و `/images/projects/${slug}/1.jpg` و ...
 *
 * فیلدهای متنی زیر عمداً خالی گذاشته شده‌اند تا خودت متن واقعی هر
 * پروژه را وارد کنی:
 *   - name        → نام پروژه (مثلاً «مجتمع مسکونی آسمان»)
 *   - year        → سال اجرا (مثلاً «۱۴۰۲»)
 *   - tag         → دسته‌بندی کوتاه برای نمایش روی کارت (مثلاً «مسکونی · تهران»)
 *   - shortDesc   → توضیح یک/دو خطی برای کارت پروژه
 *   - fullDesc    → توضیح کامل برای صفحه‌ی جزئیات پروژه
 *   - specs       → آرایه‌ای از مشخصات فنی، هرکدام به شکل:
 *                   { label: "زیربنا", value: "۴۸,۰۰۰ متر مربع" }
 *
 * فیلد galleryCount را برابر با تعداد واقعی عکس‌هایی که داخل هر پوشه
 * ریختی قرار بده (بدون احتساب cover.jpg).
 *
 * اگر بعداً به دسته‌بندی جدیدی نیاز داشتی، فقط یک مقدار جدید به
 * union type «ProjectCategory» زیر اضافه کن.
 * ══════════════════════════════════════════════════════════════════
 */

export type ProjectSpec = { label: string; value: string };

export type ProjectCategory =
  | "مسکونی"
  | "ویلا"
  | "زیرساخت"
  | "صنعتی"
  | "آب و فاضلاب"
  | "طراحی داخلی"
  | "محوطه‌سازی"
  | "تزئینات کلاسیک";

export type Project = {
  slug: string;
  category: ProjectCategory;
  tag: string;
  name: string;
  year: string;
  shortDesc: string;
  fullDesc: string;
  specs: ProjectSpec[];
  galleryCount: number;
};

export const PROJECTS: Project[] = [
  // ─────────────────────────────────────────────
  // پروژه‌های قبلی که پوشه‌ی عکس واقعی برایشان پیدا شد (اسلاگ اصلاح شد)
  // ─────────────────────────────────────────────
  {
    slug: "residential-asman-arta",
    category: "مسکونی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "tower-mashhad",
    category: "مسکونی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "warehouse-central",
    category: "صنعتی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "water-treatment-kermanshah",
    category: "آب و فاضلاب",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "pump-station-south",
    category: "آب و فاضلاب",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-garden",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },

  // ─────────────────────────────────────────────
  // ⚠️ این ۳ مورد در پوشه‌های فعلی پیدا نشدند
  // اگر عکس واقعی برایشان نداری، این ۳ آیتم را حذف کن
  // ─────────────────────────────────────────────
  {
    slug: "bridge-amirkabir",
    category: "زیرساخت",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "industrial-razi",
    category: "صنعتی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "intersection-karaj",
    category: "زیرساخت",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },

  // ─────────────────────────────────────────────
  // پروژه‌های جدید (بر اساس پوشه‌های واقعی)
  // ─────────────────────────────────────────────
  {
    slug: "ceiling-fresco-baroque-amirkabir",
    category: "تزئینات کلاسیک",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "contemporary-luxury-interior-karaj",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "modern-luxury-interior-anzali",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "modern-luxury-interior-tehran",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "modern-luxury-kitchen",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "ultra-luxury-interior",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "classic-plastering-gold-leaf",
    category: "تزئینات کلاسیک",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "japandi-warm-minimalism",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "interior-design",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "classic-interior-design",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "roof-garden",
    category: "محوطه‌سازی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "modern-minimal-luxury",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "material-mood-board",
    category: "طراحی داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "yard-landscaping",
    category: "محوطه‌سازی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "residential-apartment-facade",
    category: "مسکونی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-facade",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-01",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-03",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-f",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-under-construction-01",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "villa-under-construction-02",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
  {
    slug: "private-villa",
    category: "ویلا",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
    galleryCount: 0,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
