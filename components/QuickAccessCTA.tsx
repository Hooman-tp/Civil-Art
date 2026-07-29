import Link from "next/link";

const ITEMS = [
  { href: "/services", icon: "🏗️", title: "خدمات ما", desc: "طراحی، نظارت و اجرا" },
  { href: "/projects", icon: "📁", title: "پروژه‌ها", desc: "مشاهده نمونه کارها" },
  { href: "/contact", icon: "💬", title: "تماس با ما", desc: "مشاوره رایگان" },
];

export default function QuickAccessCTA() {
  return (
    <section style={{ background: "#050505", padding: "0 24px" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          transform: "translateY(-40px)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px",
          background: "rgba(212,175,55,0.15)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
        className="quick-access-grid"
      >
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="quick-access-item"
            style={{
              background: "#111214",
              padding: "28px 20px",
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>{item.icon}</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
          </Link>
        ))}
      </div>

      <style>{`
        .quick-access-item { transition: background 0.25s ease; }
        .quick-access-item:hover { background: #1a1b1e !important; }
        @media (max-width: 700px) {
          .quick-access-grid { grid-template-columns: 1fr !important; transform: none !important; margin-top: 24px; }
        }
      `}</style>
    </section>
  );
}
