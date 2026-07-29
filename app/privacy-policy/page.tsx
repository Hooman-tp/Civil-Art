export const metadata = {
  title: "حریم خصوصی | Civil-Art",
  description: "سیاست حفظ حریم خصوصی و نحوه استفاده از اطلاعات کاربران در وب‌سایت Civil-Art.",
};

const SECTIONS = [
  {
    title: "۱. جمع‌آوری اطلاعات",
    body: "اطلاعاتی که از طریق فرم تماس، درخواست مشاوره یا ارسال رزومه دریافت می‌کنیم، شامل نام، شماره تماس، ایمیل و توضیحات پروژه است. این اطلاعات صرفاً برای پاسخ‌گویی به درخواست شما استفاده می‌شود.",
  },
  {
    title: "۲. نحوه استفاده از اطلاعات",
    body: "اطلاعات دریافتی تنها برای ارتباط با شما، ارائه مشاوره و پیگیری درخواست‌های شغلی یا پروژه‌ای استفاده می‌شود و در هیچ شرایطی به اشخاص ثالث فروخته یا اجاره داده نمی‌شود.",
  },
  {
    title: "۳. نگهداری اطلاعات",
    body: "اطلاعات کاربران تا زمانی که برای اهداف ذکرشده ضروری باشد نگهداری می‌شود و می‌توانید در هر زمان درخواست حذف اطلاعات خود را از طریق صفحه تماس با ما مطرح کنید.",
  },
  {
    title: "۴. کوکی‌ها",
    body: "این وب‌سایت ممکن است از کوکی‌های ضروری برای بهبود تجربه کاربری استفاده کند. این کوکی‌ها اطلاعات شخصی حساسی را ذخیره نمی‌کنند.",
  },
  {
    title: "۵. تغییرات در این سیاست",
    body: "Civil-Art حق دارد در صورت لزوم این سیاست حریم خصوصی را به‌روزرسانی کند. آخرین نسخه همیشه در همین صفحه در دسترس خواهد بود.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            حریم خصوصی
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 900, marginBottom: "20px" }}>
          سیاست حفظ حریم خصوصی
        </h1>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: 2, marginBottom: "50px" }}>
          Civil-Art به حریم خصوصی کاربران و مراجعان خود احترام می‌گذارد. این
          صفحه توضیح می‌دهد که چه اطلاعاتی جمع‌آوری می‌شود و چگونه از آن‌ها
          استفاده می‌کنیم.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#D4AF37", marginBottom: "10px" }}>
                {s.title}
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 2 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "60px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
          آخرین به‌روزرسانی: ۱۴۰۳
        </p>
      </section>
    </div>
  );
}
