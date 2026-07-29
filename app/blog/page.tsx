import Link from "next/link";
import { ARTICLES } from "../../lib/articlesData";

export const metadata = {
  title: "مقالات | Civil-Art",
  description: "مقالات تخصصی درباره مهندسی عمران، طراحی سازه، نظارت و مدیریت پروژه‌های ساختمانی.",
};

export default function BlogPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            مقالات
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, marginBottom: "16px" }}>
          نگاهی تخصصی به دنیای مهندسی عمران
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.9 }}>
          مقالاتی درباره طراحی سازه، نظارت کارگاهی و مدیریت پروژه، نوشته‌شده
          توسط تیم مهندسی Civil-Art.
        </p>
      </section>

      {/* ── گرید مقالات ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 120px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "24px",
          }}
        >
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{
                background: "#0b0b0d",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "10px",
                padding: "28px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
              }}
              className="article-card"
            >
              <div style={{ fontSize: "11px", color: "#D4AF37", marginBottom: "12px", letterSpacing: "1px" }}>
                {article.category}
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "12px", lineHeight: 1.6 }}>
                {article.title}
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "13px",
                  lineHeight: 1.9,
                  marginBottom: "20px",
                  flex: 1,
                }}
              >
                {article.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "14px",
                }}
              >
                <span>{article.date}</span>
                <span>{article.readTime} مطالعه</span>
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          .article-card {
            transition: transform 0.25s ease, border-color 0.25s ease;
          }
          .article-card:hover {
            transform: translateY(-4px);
            border-color: rgba(212,175,55,0.4) !important;
          }
        `}</style>
      </section>
    </div>
  );
}
