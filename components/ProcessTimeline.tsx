import { BLUEPRINT_GRID } from "../lib/backgroundPatterns";

/**
 * هر آیکون به‌صورت SVG کدگذاری‌شده (data URI)، دقیقاً مثل تکنیکِ
 * BLUEPRINT_GRID، تولید می‌شود — یعنی کاملاً CSS محض است و نیازی به
 * کلاینت‌کامپوننت‌شدنِ این فایل یا جاوااسکریپت اضافه ندارد.
 */
function iconDataUri(innerPaths: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.45)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${innerPaths}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const ICON_CONSULTATION = iconDataUri(
  '<path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M7 9h10M7 12.5h6"/>'
);
const ICON_DESIGN = iconDataUri(
  '<circle cx="12" cy="4" r="1.1"/><path d="M12 5.1V7"/><path d="M12 7L6.5 20"/><path d="M12 7L17.5 20"/><path d="M9 14.5h6"/>'
);
const ICON_BUDGET = iconDataUri(
  '<rect x="5.5" y="3" width="13" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11.3h.01M12 11.3h.01M16 11.3h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01" stroke-width="2.2"/>'
);
const ICON_CONSTRUCTION_START = iconDataUri(
  '<path d="M4 15.5a8 8 0 0 1 16 0"/><path d="M2.5 15.5h19"/><path d="M12 7.5V4.5"/>'
);
const ICON_HANDOVER = iconDataUri(
  '<circle cx="8" cy="15" r="4"/><path d="M11 12L20 3"/><path d="M17 6l2 2"/><path d="M14.5 8.5l2 2"/>'
);

const STEPS = [
  {
    num: "۰۱",
    title: "مشاوره اولیه",
    desc: "بررسی رایگان نیازها و اهداف پروژه",
    // TODO: عکس واقعی این مرحله را در public/images/process/consultation.jpg قرار بده — تا آن زمان آیکون زیر جایگزینش است
    image: "/images/process/consultation.jpg",
    icon: ICON_CONSULTATION,
  },
  {
    num: "۰۲",
    title: "طراحی مفهومی",
    desc: "ارائه طرح اولیه و بررسی گزینه‌های مختلف",
    image: "/images/process/design.jpg",
    icon: ICON_DESIGN,
  },
  {
    num: "۰۳",
    title: "برآورد هزینه‌ها",
    desc: "محاسبه دقیق بودجه و زمان‌بندی اجرا",
    image: "/images/process/budget.jpg",
    icon: ICON_BUDGET,
  },
  {
    num: "۰۴",
    title: "شروع عملیات اجرایی",
    desc: "اجرای پروژه با نظارت مستمر مهندسی",
    image: "/images/process/construction.jpg",
    icon: ICON_CONSTRUCTION_START,
  },
  {
    num: "۰۵",
    title: "تحویل پروژه",
    desc: "تحویل نهایی و پشتیبانی پس از تحویل",
    image: "/images/process/handover.jpg",
    icon: ICON_HANDOVER,
  },
];

/*
  رفع «پس‌زمینه‌ی مرده»:
  ۱. پس‌زمینه‌ی کل سکشن از یک مشکیِ تخت (#050505) به همان بافتِ
     نقشه‌کشیِ مهندسی (BLUEPRINT_GRID) که در بقیه‌ی بخش‌های تیره‌ی
     صفحه استفاده می‌شود تغییر کرد، به‌علاوه‌ی دو هاله‌ی نرمِ طلاییِ
     محو (radial-gradient) پشت عنوان و پشت آخرین کارت‌ها — یک عمقِ
     ظریف و گرم، بدون شلوغی.
  ۲. هر کارتِ مرحله قبلاً وقتی عکس واقعی‌اش هنوز آپلود نشده بود، فقط
     یک مستطیل مشکیِ تخت نشان می‌داد (چون url(image) لود نمی‌شد و
     پشت آن فقط backgroundColor تخت بود) — دقیقاً همان چیزی که «مرده»
     به‌نظر می‌رسید. الان هر کارت یک گرادیانِ مورب برند + یک آیکونِ
     محوِ مخصوصِ همان مرحله (به‌شکل واترمارک، گوشه‌ی کارت) به‌عنوان
     پایه دارد؛ عکسِ واقعی (اگر/وقتی فایلش در public/images/process/
     قرار بگیرد) خودش روی همین پایه می‌نشیند و آن را می‌پوشاند — یعنی
     از همین امروز حرفه‌ای به‌نظر می‌رسد، و بعداً با اضافه‌کردنِ عکس
     واقعی نیازی به تغییرِ کد نیست.
  همه‌چیز محضِ CSS است (background-image چندلایه، مثل تکنیکِ
  BLUEPRINT_GRID)، بدون جاوااسکریپتِ اضافه — یعنی این فایل همچنان
  یک Server Component سبک می‌ماند.
*/
export default function ProcessTimeline() {
  return (
    <section
      style={{
        backgroundColor: "#050505",
        backgroundImage: `radial-gradient(ellipse 640px 420px at 12% -8%, rgba(212,175,55,0.12), transparent 62%), radial-gradient(ellipse 560px 460px at 100% 108%, rgba(212,175,55,0.07), transparent 62%), ${BLUEPRINT_GRID}`,
        backgroundRepeat: "no-repeat, no-repeat, repeat",
        padding: "100px 24px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
            <span style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "12px", fontWeight: 700 }}>
              روند همکاری
            </span>
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "3px", marginBottom: "12px" }}>
            PROCESS
          </div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, color: "#fff" }}>
            از ایده تا تحویل کلید
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
          {STEPS.map((s, i) => (
            <div key={s.num}>
              <div
                className="process-card"
                style={{
                  position: "relative",
                  borderRadius: "18px",
                  overflow: "hidden",
                  minHeight: "150px",
                  border: "1px solid rgba(212,175,55,0.2)",
                  backgroundImage: `url(${s.image}), linear-gradient(90deg, rgba(5,5,5,0.88) 35%, rgba(5,5,5,0.35) 100%), ${s.icon}, linear-gradient(135deg,#17150d 0%,#0d0c09 55%,#050505 100%)`,
                  backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
                  backgroundSize: "cover, cover, 132px 132px, cover",
                  backgroundPosition: "center, center, left -18px bottom -18px, center",
                  display: "flex",
                  alignItems: "center",
                  padding: "26px 28px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    borderRadius: "50%",
                    border: "1px solid rgba(212,175,55,0.5)",
                    background: "rgba(5,5,5,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D4AF37",
                    fontWeight: 900,
                    fontSize: "14px",
                    marginLeft: "20px",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "6px" }}>
                    {s.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.8 }}>
                    {s.desc}
                  </p>
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "linear-gradient(180deg,#efd98a,#D4AF37)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(212,175,55,0.25)",
                    }}
                  >
                    <IconArrowDown />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <style>{`
          .process-card { transition: transform 0.25s ease, border-color 0.25s ease; }
          .process-card:hover { transform: translateY(-3px); border-color: rgba(212,175,55,0.45); }
          @media (prefers-reduced-motion: reduce) {
            .process-card { transition: none; }
            .process-card:hover { transform: none; }
          }
          @media (max-width: 560px) {
            .process-card { padding: 20px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function IconArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 4V20M12 20L6 14M12 20L18 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
