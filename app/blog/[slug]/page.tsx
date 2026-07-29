import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "../../../lib/articlesData";
import type { Metadata } from "next";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      <article
        style={{
          paddingTop: "160px",
          paddingBottom: "100px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/blog"
          style={{
            color: "#D4AF37",
            fontSize: "13px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "28px",
          }}
        >
          ← بازگشت به مقالات
        </Link>

        <div style={{ fontSize: "12px", color: "#D4AF37", letterSpacing: "2px", marginBottom: "14px" }}>
          {article.category}
        </div>

        <h1 style={{ fontSize: "clamp(26px,4.5vw,42px)", fontWeight: 900, marginBottom: "20px", lineHeight: 1.35 }}>
          {article.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "18px",
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "40px",
            paddingBottom: "30px",
            borderBottom: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime} مطالعه</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {article.content.map((paragraph, i) => (
            <p
              key={i}
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "15.5px",
                lineHeight: 2.1,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA پایانی */}
        <div
          style={{
            marginTop: "60px",
            padding: "32px",
            background: "#0b0b0d",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>
            سوالی درباره پروژه‌ی خود دارید؟
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "20px" }}>
            تیم مهندسی Civil-Art آماده مشاوره رایگان است.
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              background: "linear-gradient(180deg,#efd98a,#D4AF37)",
              color: "#000",
              fontWeight: 700,
              padding: "12px 32px",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            تماس با ما
          </Link>
        </div>
      </article>
    </div>
  );
}
