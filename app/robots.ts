import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // بعداً که دامنه واقعی مشخص شد، این آدرس را با دامنه واقعی جایگزین کنید
    sitemap: "https://civil-art.ir/sitemap.xml",
  };
}
