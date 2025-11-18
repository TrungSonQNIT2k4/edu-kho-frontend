import Link from "next/link";

// Đây là cách thêm SEO "chuẩn" (bằng JS)
export const metadata = {
  title: "Giới thiệu EduKho | Giải pháp Quản lý VPP Thông minh",
  description:
    "Tìm hiểu về EduKho, phần mềm giúp các cửa hàng VPP và nhà sách quản lý tồn kho sách giáo khoa hiệu quả.",
};

export default function GioiThieuPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Giới thiệu về EduKho (SSG)</h1>
      <p className="mt-4">
        EduKho là giải pháp được thiết kế đặc biệt cho các chủ cửa hàng văn
        phòng phẩm tại Việt Nam...
      </p>
      <Link href="/dashboard">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          EduKhoChat
        </button>
      </Link>
      <Link href="/Login">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Product
        </button>
      </Link>
    </main>
  );
}
