import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Cấu hình Font chữ (Giữ nguyên như code cũ của em)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- CẤU HÌNH SEO (METADATA) ---
// Thay đường dẫn này bằng domain thật nếu em mua domain (vd: edukho.com)
const DOMAIN_URL = "https://edu-kho-frontend.vercel.app";

export const metadata = {
  // 1. Định danh URL gốc (Quan trọng để hình ảnh hiển thị đúng khi share)
  metadataBase: new URL(DOMAIN_URL),

  verification: {
    google: "w0bUCkptQJ69IhkeNGwAN9ANCnI_EzNDSDnolcVQXrc",
  },

  // 2. Cấu hình Tiêu đề (Title) thông minh
  title: {
    default: "EduKho - Quản lý Kho & Sách Giáo Khoa Thông Minh", // Tiêu đề mặc định cho trang chủ
    template: "%s | EduKho", // Mẫu tiêu đề cho các trang con (Vd: "Đăng nhập | EduKho")
  },

  // 3. Mô tả (Description) - Cái này sẽ hiện trên Google
  description:
    "Phần mềm quản lý văn phòng phẩm và sách giáo khoa chuyên nghiệp. Hỗ trợ nhập/xuất kho, tra cứu theo trường học, báo cáo doanh thu và tích hợp Chatbot AI trợ lý ảo.",

  // 4. Từ khóa (Keywords) - Giúp Google hiểu nội dung web
  keywords: [
    "EduKho",
    "quản lý kho sách",
    "phần mềm văn phòng phẩm",
    "quản lý sách giáo khoa",
    "nhập xuất tồn",
    "chatbot bán hàng",
  ],

  // 5. Tác giả & Creator
  authors: [{ name: "EduKho Team", url: DOMAIN_URL }],
  creator: "EduKho Team",

  // 6. Cấu hình hiển thị khi chia sẻ lên Mạng xã hội (Facebook, Zalo, LinkedIn)
  openGraph: {
    title: "EduKho - Giải pháp Quản lý Kho Sách 4.0",
    description:
      "Quản lý nhập xuất tồn, tra cứu sách theo trường học dễ dàng với trợ lý ảo AI.",
    url: DOMAIN_URL,
    siteName: "EduKho",
    images: [
      {
        url: "/opengraph-image.png", // Em cần tạo ảnh này (xem hướng dẫn bên dưới)
        width: 1200,
        height: 630,
        alt: "Giao diện phần mềm EduKho",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  // 7. Cấu hình hiển thị trên Twitter (X)
  twitter: {
    card: "summary_large_image",
    title: "EduKho - Quản lý Kho Sách Thông Minh",
    description: "Giải pháp quản lý toàn diện cho cửa hàng văn phòng phẩm.",
    images: ["/opengraph-image.png"],
  },

  // 8. Chỉ dẫn cho Robot tìm kiếm (Google Bot)
  robots: {
    index: true, // Cho phép Google lập chỉ mục
    follow: true, // Cho phép đi theo các link trong trang
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 9. Icon hiển thị trên tab trình duyệt
  icons: {
    icon: "/edkulogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    // Quan trọng: Đặt lang="vi" để báo cho Google biết đây là web tiếng Việt
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
