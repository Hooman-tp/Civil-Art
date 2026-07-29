import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import ScrollProgress from "../components/ScrollProgress";
import StructuredData from "../components/StructuredData";
import WhatsAppButton from "../components/WhatsAppButton";
import SkipToContent from "../components/SkipToContent";
import { Vazirmatn } from "next/font/google";
import type { Metadata } from "next";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: {
    default: "Civil-Art | شرکت فنی و مهندسی",
    template: "%s | Civil-Art",
  },
  description:
    "Civil-Art، شرکت فنی و مهندسی فعال در طراحی، نظارت، مدیریت و اجرای پروژه‌های عمرانی، ساختمانی و صنعتی با بیش از ۱۸ سال تجربه.",
  keywords: [
    "شرکت مهندسی",
    "طراحی سازه",
    "پیمانکاری ساختمان",
    "عمران",
    "نظارت کارگاهی",
    "Civil-Art",
  ],
  authors: [{ name: "Civil-Art" }],
  openGraph: {
    title: "Civil-Art | شرکت فنی و مهندسی",
    description:
      "طراحی، نظارت، مدیریت و اجرای پروژه‌های عمرانی، ساختمانی و صنعتی با رویکردی مدرن و دقیق.",
    locale: "fa_IR",
    type: "website",
    siteName: "Civil-Art",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={vazir.className}
        style={{ overflowX: "hidden", background: "#050505", color: "#fff" }}
      >
        <SkipToContent />
        <StructuredData />
        <ScrollProgress />
        <Header />
        <SmoothScroll>
          <main id="main-content">{children}</main>
        </SmoothScroll>
        <Footer />
        <BackToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}
