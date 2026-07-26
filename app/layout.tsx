import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";
import Header from "../components/Header";
import { Vazirmatn } from "next/font/google";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata = {
  title: "Civil-Art",
  description: "شرکت فنی و مهندسی Civil-Art",
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
        <Header />
        <SmoothScroll>
  <main>{children}</main>
</SmoothScroll>
      </body>
    </html>
  );
}
