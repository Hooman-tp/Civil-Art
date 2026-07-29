import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Civil-Art | شرکت فنی و مهندسی",
    short_name: "Civil-Art",
    description:
      "شرکت فنی و مهندسی فعال در طراحی، نظارت، مدیریت و اجرای پروژه‌های عمرانی، ساختمانی و صنعتی.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#D4AF37",
    lang: "fa",
    dir: "rtl",
  };
}
