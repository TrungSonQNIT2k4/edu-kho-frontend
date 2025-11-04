// app/gioi-thieu/page.jsx

// Đây là cách thêm SEO "chuẩn" (bằng JS)
export const metadata = {
  title: "Giới thiệu EduKho | Giải pháp Quản lý VPP Thông minh",
  description:
    "Tìm hiểu về EduKho, phần mềm giúp các cửa hàng VPP và nhà sách quản lý tồn kho sách giáo khoa hiệu quả.",
};

export default function GioiThieuPage() {
  // Vì không có "use client", Next.js tự động
  // biến trang này thành SSG (món ăn làm sẵn).
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Giới thiệu về EduKho (SSG)</h1>
      <p className="mt-4">
        EduKho là giải pháp được thiết kế đặc biệt cho các chủ cửa hàng văn
        phòng phẩm tại Việt Nam...
      </p>
    </main>
  );
}
