/*
  داده‌ی ساختاریافته (Schema.org) برای موتورهای جستجو.

  این کامپوننت به گوگل و سایر موتورهای جستجو اطلاعات دقیق و
  ماشین‌خوان درباره‌ی کسب‌وکار می‌دهد (نام، نوع کسب‌وکار، اطلاعات
  تماس). این می‌تواند باعث نمایش بهتر سایت در نتایج جستجو شود
  (مثلاً نمایش شماره تماس یا امتیاز مستقیم در گوگل).

  نکته: مقادیر url، telephone و address را وقتی دامنه و آدرس واقعی
  مشخص شد، به‌روزرسانی کن.
*/
export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Civil-Art",
    description:
      "شرکت فنی و مهندسی فعال در طراحی، نظارت، مدیریت و اجرای پروژه‌های عمرانی، ساختمانی و صنعتی.",
    url: "https://civil-art.ir",
    telephone: "+98-912-9245664",
    email: "hooman.tp@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IR",
    },
    sameAs: ["https://instagram.com/hooman_tp", "https://t.me/09129245664"],
    areaServed: "IR",
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
