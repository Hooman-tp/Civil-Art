"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "خانه" },
  { href: "/about", label: "درباره ما" },
  { href: "/services", label: "خدمات" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/gallery", label: "گالری" },
  { href: "/team", label: "تیم ما" },
  { href: "/contact", label: "تماس" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      /*
        رفع درخواست «نوار بالا رو از حالت دودی شیشه‌ای درش بیار»:
        قبلاً background تیره‌ی نیمه‌شفاف + یک خط طلایی زیرش یک
        نوار/پنل قابل‌مشاهده می‌ساخت. هر دو حذف شدند؛ هدر الان کاملاً
        شفاف است و فقط لوگو و متن‌های ناوبری روی هرچه پشتش هست (روی
        صفحه‌ی اصلی: ویدیوی هیرو) شناور می‌مانند. توجه: در صفحاتی که
        زیر هدر یک پس‌زمینه‌ی تیره/گرادیانِ کمکی برای کنتراست ندارند،
        ممکن است لازم باشد بعداً یک راه‌حل کنتراست جداگانه اضافه شود.
      */
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/*
          رفع درخواست «لوگو واسه ویندوز کوچیکه، واسه موبایل هم یه‌خورده
          بزرگترش کن»: چون سایز از طریق style اینلاین ست شده بود، امکان
          تعریف اندازه‌ی متفاوت برای دسکتاپ/موبایل وجود نداشت (اینلاین
          style نمی‌تواند media query داشته باشد). الان اندازه از طریق
          کلاس header-logo و همان بلوک <style> پایین صفحه (که پیش‌تر برای
          نمایش/مخفی‌کردن منو استفاده می‌شد) به‌صورت ریسپانسیو کنترل
          می‌شود: ۵۲px روی موبایل (قبلاً ۴۰px) و ۷۲px روی دسکتاپ (قبلاً
          ۴۰px، که با توجه به عرض هدر ۱۴۰۰px واقعاً کوچک به‌نظر می‌رسید).
          نسبت واقعی لوگو (۱۴۰×۹۳) حفظ می‌شود چون فقط height ست می‌شود و
          width روی auto می‌ماند.
        */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <Image
            src="/images/civil-art-logo.png"
            alt="Civil-Art"
            width={140}
            height={93}
            priority
            className="header-logo"
            style={{ width: "auto" }}
          />
        </Link>

        {/* ── منو دسکتاپ ── */}
        <nav className="desktop-nav" style={{ display: "flex", gap: "22px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  color: isActive ? "#D4AF37" : "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 400,
                  whiteSpace: "nowrap",
                  borderBottom: isActive ? "2px solid #D4AF37" : "2px solid transparent",
                  paddingBottom: "4px",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── دکمه همبرگری ── */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="باز کردن منو"
          aria-expanded={menuOpen}
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          <span
            style={{
              width: "24px",
              height: "2px",
              background: "#D4AF37",
              transition: "transform 0.3s",
              transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
            }}
          />
          <span
            style={{
              width: "24px",
              height: "2px",
              background: "#D4AF37",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />
          <span
            style={{
              width: "24px",
              height: "2px",
              background: "#D4AF37",
              transition: "transform 0.3s",
              transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* ── منوی موبایل ── */}
      {menuOpen && (
        <nav
          className="mobile-nav"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 24px 20px",
            gap: "4px",
            borderTop: "1px solid rgba(212,175,55,0.1)",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  color: isActive ? "#D4AF37" : "#fff",
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: "none",
                  padding: "12px 0",
                  fontSize: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      <style>{`
        .header-logo { height: 52px; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-nav { display: none !important; }
          .header-logo { height: 72px; }
        }
      `}</style>
    </header>
  );
}
