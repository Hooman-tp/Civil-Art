import type { MetadataRoute } from "next";

// بعداً که دامنه واقعی مشخص شد، این آدرس را با دامنه واقعی جایگزین کنید
const BASE_URL = "https://civil-art.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/gallery",
    "/team",
    "/contact",
    "/faq",
    "/certificates",
    "/careers",
    "/privacy-policy",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
