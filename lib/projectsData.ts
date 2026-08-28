/**
 * ══════════════════════════════════════════════════════════════════
 * منبع واحد داده‌ی پروژه‌ها (Single Source of Truth)
 * ══════════════════════════════════════════════════════════════════
 *
 * قانون طلایی:
 * مقدار «slug» در هر آیتم زیر باید دقیقاً - حرف به حرف - با نام پوشه‌ی
 * متناظرش در مسیر زیر یکی باشد:
 *
 *     public/images/projects/{slug}/
 *
 * چون همین «slug» هم برای ساخت مسیر عکس‌ها و هم برای آدرس صفحه‌ی
 * جزئیات (/projects/{slug}) استفاده می‌شود، هرگز نباید فاصله یا
 * کاراکتر فارسی داشته باشد.
 *
 * فیلدهای متنی (name, year, tag, shortDesc, fullDesc, specs) عمداً
 * خالی گذاشته شده‌اند تا خودت متن واقعی هر پروژه را وارد کنی.
 *
 * عکس‌های هر پروژه به‌صورت خودکار از روی فایل‌های داخل پوشه‌اش خوانده
 * می‌شوند (نگاه کن به lib/getProjectImages.ts). فقط عکس را داخل پوشه
 * بریز، نیازی به نوشتن دستی تعداد عکس نیست.
 * ══════════════════════════════════════════════════════════════════
 */

export type ProjectSpec = { label: string; value: string };

export type ProjectCategory =
  | "مسکونی"
  | "ویلا"
  | "زیرساخت"
  | "اداری"
  | "نقاشی و پتینه و تکسچر"
  | "دیزاین داخلی"
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
};

export const PROJECTS: Project[] = [
  // ─────────────────────────────────────────────
  // مسکونی
  // ─────────────────────────────────────────────
  { slug: "tower-mashhad", category: "مسکونی", tag: "", name: "برج مسکونی مشهد", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "residential-apartment-facade", category: "مسکونی", tag: "", name: "نمای ساختمان مسکونی", year: "", shortDesc: "", fullDesc: "", specs: [] },

  // ─────────────────────────────────────────────
  // اداری
  // ⚠️ اسم پوشه فعلاً اندونزیایی است (Gedung-perkantoran-arta)
  // پیشنهاد بعدی: office-building-arta
  // ─────────────────────────────────────────────
  { slug: "Gedung-perkantoran-arta", category: "اداری", tag: "", name: "ساختمان اداری آرتا", year: "", shortDesc: "", fullDesc: "", specs: [] },

  // ─────────────────────────────────────────────
  // ویلا
  // ⚠️ اسم پوشه‌ی Vila-pribadi-di-Mazandaran فعلاً اندونزیایی است
  // پیشنهاد بعدی: private-villa-mazandaran
  // ─────────────────────────────────────────────
  { slug: "villa-garden", category: "ویلا", tag: "", name: "ویلای باغی", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "private-villa", category: "ویلا", tag: "", name: "ویلای خصوصی", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "villa-facade", category: "ویلا", tag: "", name: "نمای ویلای مدرن", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "villa-01", category: "ویلا", tag: "", name: "ویلای مدرن ۰۱", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "villa-02", category: "ویلا", tag: "", name: "ویلای مدرن ۰۲", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "villa-03", category: "ویلا", tag: "", name: "ویلای مدرن ۰۳", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "villa-under-construction-01", category: "ویلا", tag: "", name: "ویلای در حال ساخت ۰۱", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "villa-under-construction-02", category: "ویلا", tag: "", name: "ویلای در حال ساخت ۰۲", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "Vila-pribadi-di-Mazandaran", category: "ویلا", tag: "", name: "ویلای خصوصی مازندران", year: "", shortDesc: "", fullDesc: "", specs: [] },

  // ─────────────────────────────────────────────
  // دیزاین داخلی
  // ⚠️ اسم پوشه‌ی Desain-interior-vila-pribadi فعلاً اندونزیایی است
  // پیشنهاد بعدی: villa-interior-design
  // ─────────────────────────────────────────────
  { slug: "interior-design", category: "دیزاین داخلی", tag: "", name: "طراحی داخلی مدرن", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "classic-interior-design", category: "دیزاین داخلی", tag: "", name: "طراحی داخلی کلاسیک", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "contemporary-luxury-interior-karaj", category: "دیزاین داخلی", tag: "", name: "طراحی داخلی لوکس معاصر کرج", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "modern-luxury-interior-tehran", category: "دیزاین داخلی", tag: "", name: "طراحی داخلی لوکس مدرن تهران", year: "", shortDesc: "", fullDesc: "", specs: [] },
  {
    // ⚠️ این پوشه هنوز فاصله دارد؛ باید رنیم شود به همین اسم دقیقاً:
    // modern-luxury-interior-mani-tejarat-anzali
    slug: "modern-luxury-interior-mani-tejarat-anzali",
    category: "دیزاین داخلی",
    tag: "",
    name: "",
    year: "",
    shortDesc: "",
    fullDesc: "",
    specs: [],
  },
  { slug: "modern-luxury-kitchen", category: "دیزاین داخلی", tag: "", name: "آشپزخانه لوکس مدرن", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "modern-minimal-luxury", category: "دیزاین داخلی", tag: "", name: "مینیمال مدرن لوکس", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "ultra-luxury-interior", category: "دیزاین داخلی", tag: "", name: "طراحی داخلی فوق لوکس", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "japandi-warm-minimalism", category: "دیزاین داخلی", tag: "", name: "مینیمالیسم گرم جاپندی", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "material-mood-board", category: "دیزاین داخلی", tag: "", name: "مودبرد متریال", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "Desain-interior-vila-pribadi", category: "دیزاین داخلی", tag: "", name: "طراحی داخلی ویلای خصوصی", year: "", shortDesc: "", fullDesc: "", specs: [] },

  // ─────────────────────────────────────────────
  // محوطه‌سازی
  // ─────────────────────────────────────────────
  { slug: "roof-garden", category: "محوطه‌سازی", tag: "", name: "روف‌گاردن", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "yard-landscaping", category: "محوطه‌سازی", tag: "", name: "محوطه‌سازی حیاط", year: "", shortDesc: "", fullDesc: "", specs: [] },

  // ─────────────────────────────────────────────
  // تزئینات کلاسیک
  // ⚠️ پوشه‌ی زیر هنوز فاصله دارد و اسمش اندونزیایی هم هست؛
  // باید رنیم شود به همین اسم دقیقاً: ceiling-fresco-baroque-amirkabir
  // ─────────────────────────────────────────────
  { slug: "ceiling-fresco-baroque-amirkabir", category: "تزئینات کلاسیک", tag: "", name: "نقاشی سقف باروک امیرکبیر", year: "", shortDesc: "", fullDesc: "", specs: [] },
  { slug: "classic-plastering-gold-leaf", category: "تزئینات کلاسیک", tag: "", name: "گچبری کلاسیک و ورق طلا", year: "", shortDesc: "", fullDesc: "", specs: [] },

  // ─────────────────────────────────────────────
  // نقاشی و پتینه و تکسچر
  // ⚠️ اسم پوشه فعلاً اندونزیایی است (Pengecatan-profesional)
  // پیشنهاد بعدی: professional-painting
  // ─────────────────────────────────────────────
  { slug: "Pengecatan-profesional", category: "نقاشی و پتینه و تکسچر", tag: "", name: "نقاشی حرفه‌ای ساختمان", year: "", shortDesc: "", fullDesc: "", specs: [] },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * برای پیش‌نمایش «پروژه‌های برجسته» در صفحه‌ی اصلی، به‌جای برداشتن چند
 * آیتم اول آرایه (که چون پروژه‌ها بر اساس دسته‌بندی گروه‌بندی شده‌اند
 * فقط یک دسته را نشان می‌داد)، این تابع به‌صورت چرخشی از هر دسته‌بندی
 * یک پروژه انتخاب می‌کند تا در پیش‌نمایش، تنوع دسته‌ها حفظ شود.
 */
export function getFeaturedProjects(count: number): Project[] {
  const byCategory = new Map<ProjectCategory, Project[]>();
  for (const project of PROJECTS) {
    const list = byCategory.get(project.category) ?? [];
    list.push(project);
    byCategory.set(project.category, list);
  }

  const categories = Array.from(byCategory.keys());
  const result: Project[] = [];
  let round = 0;

  while (result.length < count) {
    let addedInThisRound = false;

    for (const category of categories) {
      const project = byCategory.get(category)?.[round];
      if (project) {
        result.push(project);
        addedInThisRound = true;
        if (result.length === count) break;
      }
    }

    if (!addedInThisRound) break;
    round++;
  }

  return result;
}
