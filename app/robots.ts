import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/headmaster/", "/teacher/", "/parent/"],
    },
    sitemap: "https://apex-global-academy.vercel.app/sitemap.xml",
  };
}
