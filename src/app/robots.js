export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/", // Chặn Google vào các trang riêng tư (nếu có)
    },
    sitemap: "https://edu-kho-frontend.vercel.app/sitemap.xml",
  };
}
