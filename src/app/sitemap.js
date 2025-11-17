export default function sitemap() {
  const baseUrl = "https://edu-kho-frontend.vercel.app"; // Thay link thật của bạn

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Thêm các trang khác nếu có (vd: /gioi-thieu)
  ];
}
